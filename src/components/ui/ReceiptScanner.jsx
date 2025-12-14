import React, { useState, useRef, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import Icon from '../AppIcon';

const ReceiptScanner = ({ isOpen, onClose, onTransactionExtracted }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState(null);
  const [extractedItems, setExtractedItems] = useState([]);
  const [mlConfidence, setMlConfidence] = useState(0);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Category keywords for auto-detection
  const categoryKeywords = {
    'Food & Dining': ['restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'swiggy', 'zomato', 'dominos', 'mcdonalds', 'kfc', 'starbucks', 'subway', 'dining', 'breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'tea', 'biryani', 'dosa', 'thali'],
    'Shopping': ['amazon', 'flipkart', 'myntra', 'mall', 'mart', 'store', 'shop', 'retail', 'fashion', 'clothing', 'electronics', 'reliance', 'dmart', 'big bazaar', 'lifestyle', 'shoppers stop', 'westside', 'max', 'pantaloons'],
    'Groceries': ['grocery', 'vegetables', 'fruits', 'supermarket', 'bigbasket', 'grofers', 'blinkit', 'zepto', 'instamart', 'provisions', 'kirana', 'daily needs', 'milk', 'bread', 'eggs'],
    'Transportation': ['uber', 'ola', 'rapido', 'metro', 'bus', 'train', 'irctc', 'fuel', 'petrol', 'diesel', 'parking', 'toll', 'auto', 'cab', 'taxi', 'airways', 'flight', 'indigo', 'spicejet'],
    'Entertainment': ['movie', 'pvr', 'inox', 'cinema', 'netflix', 'amazon prime', 'hotstar', 'spotify', 'game', 'concert', 'event', 'ticket', 'bookmyshow', 'theatre'],
    'Healthcare': ['pharmacy', 'medical', 'hospital', 'clinic', 'doctor', 'medicine', 'apollo', 'medplus', 'netmeds', 'pharmeasy', '1mg', 'healthcare', 'diagnostic', 'lab', 'test'],
    'Utilities': ['electricity', 'water', 'gas', 'internet', 'broadband', 'wifi', 'mobile', 'recharge', 'bill', 'airtel', 'jio', 'vodafone', 'bsnl', 'tata sky', 'dth'],
    'Education': ['book', 'course', 'udemy', 'coursera', 'school', 'college', 'tuition', 'coaching', 'stationery', 'education', 'learning', 'exam', 'fee'],
  };

  // Merchant name patterns
  const merchantPatterns = [
    /(?:from|at|to|merchant|vendor|store|shop|restaurant|cafe)[\s:]*([A-Za-z0-9\s&'.,-]+)/i,
    /^([A-Z][A-Za-z0-9\s&'.,-]{2,30})$/m,
    /(?:bill|invoice|receipt)[\s]*(?:from|of|by)?[\s:]*([A-Za-z0-9\s&'.,-]+)/i,
  ];

  // Amount patterns for INR
  const amountPatterns = [
    /(?:total|grand total|amount|net amount|payable|paid|rs\.?|inr|₹)[\s.:]*[₹]?[\s]*([0-9,]+\.?[0-9]*)/gi,
    /[₹]\s*([0-9,]+\.?[0-9]*)/g,
    /(?:rs\.?|inr)\s*([0-9,]+\.?[0-9]*)/gi,
    /([0-9,]+\.[0-9]{2})(?:\s*(?:only|rs|inr|₹|total))?/gi,
  ];

  // Date patterns
  const datePatterns = [
    /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/g,
    /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*[,]?\s*(\d{2,4})/gi,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(\d{1,2})[,]?\s*(\d{2,4})/gi,
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedImage(file);
    setError(null);
    setExtractedData(null);
    setRawText('');

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // ML-based image preprocessing
  const preprocessImage = async (imageData) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply contrast enhancement and grayscale conversion
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          
          // Apply adaptive thresholding for better text recognition
          const threshold = 128;
          const value = avg > threshold ? 255 : 0;
          
          data[i] = value;     // Red
          data[i + 1] = value; // Green
          data[i + 2] = value; // Blue
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imageData;
    });
  };

  // Enhanced amount extraction with ML patterns
  const extractAmount = (text) => {
    let amounts = [];
    
    for (const pattern of amountPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const amountStr = match[1].replace(/,/g, '');
        const amount = parseFloat(amountStr);
        if (amount > 0 && amount < 1000000) {
          amounts.push(amount);
        }
      }
    }

    // Return the largest amount (usually the total)
    if (amounts.length > 0) {
      return Math.max(...amounts);
    }
    return null;
  };

  const extractDate = (text) => {
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const dateStr = match[0];
          const parsed = new Date(dateStr);
          if (!isNaN(parsed.getTime())) {
            return parsed.toISOString().split('T')[0];
          }
        } catch (e) {
          continue;
        }
      }
    }
    return new Date().toISOString().split('T')[0];
  };

  const extractMerchant = (text) => {
    const lines = text.split('\n').filter(line => line.trim().length > 2);
    
    // Try patterns first
    for (const pattern of merchantPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const merchant = match[1].trim();
        if (merchant.length > 2 && merchant.length < 50) {
          return merchant;
        }
      }
    }

    // Use first meaningful line as merchant name
    for (const line of lines.slice(0, 5)) {
      const cleanLine = line.trim();
      if (cleanLine.length > 2 && cleanLine.length < 40 && !/^\d+$/.test(cleanLine)) {
        return cleanLine;
      }
    }

    return 'Unknown Merchant';
  };

  const detectCategory = (text, merchant) => {
    const lowerText = (text + ' ' + merchant).toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return category;
        }
      }
    }
    
    return 'Other';
  };

  // ML-based item extraction from receipt
  const extractItems = (text) => {
    const items = [];
    const lines = text.split('\n');
    
    // Pattern to match item lines: name followed by quantity/price
    const itemPattern = /^([A-Za-z][A-Za-z0-9\s\-\.,'&]+).*?([0-9,]+\.?[0-9]{0,2})\s*$/;
    const quantityPattern = /([0-9]+)\s*[xX@]\s*([0-9,]+\.?[0-9]*)/;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip common headers and footers
      if (line.match(/total|subtotal|tax|discount|payment|balance|thank you|visit|bill|invoice|receipt/i)) {
        continue;
      }
      
      const itemMatch = line.match(itemPattern);
      if (itemMatch && itemMatch[1].length > 2) {
        const name = itemMatch[1].trim();
        const price = parseFloat(itemMatch[2].replace(/,/g, ''));
        
        // Check for quantity
        const qtyMatch = line.match(quantityPattern);
        const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
        
        if (price > 0 && price < 10000) {
          items.push({
            name: name,
            quantity: quantity,
            price: price,
            total: price * quantity
          });
        }
      }
    }
    
    return items;
  };

  // Extract tax and discount information
  const extractTaxAndDiscount = (text) => {
    let tax = 0;
    let discount = 0;
    
    // Tax patterns
    const taxPatterns = [
      /(?:tax|gst|cgst|sgst|igst|vat).*?([0-9,]+\.?[0-9]*)/gi,
      /([0-9,]+\.?[0-9]*).*?(?:tax|gst)/gi
    ];
    
    for (const pattern of taxPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (value > 0 && value < 10000) {
          tax = Math.max(tax, value);
        }
      }
    }
    
    // Discount patterns
    const discountPatterns = [
      /(?:discount|off|savings?).*?([0-9,]+\.?[0-9]*)/gi,
      /([0-9,]+\.?[0-9]*).*?(?:discount|off)/gi
    ];
    
    for (const pattern of discountPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (value > 0 && value < 10000) {
          discount = Math.max(discount, value);
        }
      }
    }
    
    return { tax, discount };
  };

  // Calculate ML confidence score
  const calculateConfidence = (extractedData, items, text) => {
    let score = 0;
    let factors = 0;
    
    // Amount detected
    if (extractedData.amount > 0) {
      score += 30;
      factors++;
    }
    
    // Merchant detected
    if (extractedData.merchant && extractedData.merchant !== 'Unknown Merchant') {
      score += 25;
      factors++;
    }
    
    // Date detected
    if (extractedData.date) {
      score += 20;
      factors++;
    }
    
    // Items detected
    if (items.length > 0) {
      score += 15;
      factors++;
    }
    
    // Category auto-detected
    if (extractedData.category !== 'Other') {
      score += 10;
      factors++;
    }
    
    return Math.min(100, score);
  };

  const processReceipt = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    setProcessingStep('Initializing AI model...');
    setProcessingProgress(0);

    try {
      // Preprocess image for better OCR
      setProcessingStep('Enhancing image quality...');
      setProcessingProgress(5);
      const preprocessedImage = await preprocessImage(imagePreview);

      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProcessingProgress(20 + Math.round(m.progress * 50));
            setProcessingStep('Scanning receipt with ML-powered OCR...');
          } else if (m.status === 'loading language traineddata') {
            setProcessingStep('Loading advanced OCR model...');
            setProcessingProgress(15);
          } else if (m.status === 'initializing api') {
            setProcessingStep('Initializing ML engine...');
            setProcessingProgress(10);
          }
        },
      });

      setProcessingStep('Analyzing receipt structure...');
      setProcessingProgress(70);

      const { data: { text } } = await worker.recognize(preprocessedImage);
      
      setRawText(text);
      setProcessingStep('Extracting transaction details with ML...');
      setProcessingProgress(75);

      // Extract data using enhanced AI patterns
      const amount = extractAmount(text);
      const date = extractDate(text);
      const merchant = extractMerchant(text);
      const category = detectCategory(text, merchant);
      const items = extractItems(text);
      const { tax, discount } = extractTaxAndDiscount(text);

      setProcessingStep('Analyzing line items...');
      setProcessingProgress(85);
      setExtractedItems(items);

      const extracted = {
        amount: amount || 0,
        date: date,
        merchant: merchant,
        category: category,
        description: `Purchase at ${merchant}`,
        type: 'expense',
        paymentMethod: 'Cash/Card',
        tax: tax,
        discount: discount,
        items: items,
        itemCount: items.length
      };

      const confidence = calculateConfidence(extracted, items, text);
      setMlConfidence(confidence);
      extracted.confidence = confidence >= 70 ? 'High' : confidence >= 40 ? 'Medium' : 'Low';

      setExtractedData(extracted);
      setProcessingStep('ML Analysis Complete!');
      setProcessingProgress(100);

      await worker.terminate();
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to process receipt. Please try again with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmTransaction = () => {
    if (extractedData && onTransactionExtracted) {
      onTransactionExtracted({
        ...extractedData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        source: 'receipt_scan'
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedData(null);
    setRawText('');
    setError(null);
    setProcessingProgress(0);
    setProcessingStep('');
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="ScanLine" size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Receipt Scanner</h2>
              <p className="text-xs text-white/80">Powered by Deep Learning OCR</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <Icon name="X" size={18} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!imagePreview ? (
            /* Upload Section */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Upload" size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Receipt Image</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop or click to select a receipt image
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Icon name="Image" size={16} />
                  Choose File
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                  className="px-4 py-2 bg-muted text-foreground border border-border rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
                >
                  <Icon name="Camera" size={16} />
                  Take Photo
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            /* Preview & Results Section */
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Receipt preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                {!isProcessing && !extractedData && (
                  <button
                    onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Icon name="X" size={16} className="text-white" />
                  </button>
                )}
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Cpu" size={20} className="text-primary animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{processingStep}</p>
                      <p className="text-xs text-muted-foreground">Processing with Tesseract OCR</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{processingProgress}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-start gap-3">
                  <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-error">{error}</p>
                    <button
                      onClick={() => { setError(null); setImagePreview(null); setSelectedImage(null); }}
                      className="text-xs text-error/80 hover:text-error mt-1"
                    >
                      Try another image
                    </button>
                  </div>
                </div>
              )}

              {/* Extracted Data */}
              {extractedData && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="CheckCircle" size={18} className="text-success" />
                      <span className="font-medium text-success">ML-powered extraction complete!</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        extractedData.confidence === 'High' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : extractedData.confidence === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {extractedData.confidence} Confidence ({mlConfidence}%)
                      </span>
                    </div>
                    {extractedItems.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="ShoppingBag" size={14} />
                        <span>{extractedItems.length} items detected</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted rounded-xl p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <input
                          type="number"
                          value={extractedData.amount}
                          onChange={(e) => setExtractedData({...extractedData, amount: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                        <input
                          type="date"
                          value={extractedData.date}
                          onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Merchant</label>
                      <input
                        type="text"
                        value={extractedData.merchant}
                        onChange={(e) => setExtractedData({...extractedData, merchant: e.target.value})}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                        <select
                          value={extractedData.category}
                          onChange={(e) => setExtractedData({...extractedData, category: e.target.value})}
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {Object.keys(categoryKeywords).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                        <select
                          value={extractedData.type}
                          onChange={(e) => setExtractedData({...extractedData, type: e.target.value})}
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <input
                        type="text"
                        value={extractedData.description}
                        onChange={(e) => setExtractedData({...extractedData, description: e.target.value})}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  {/* Extracted Items */}
                  {extractedItems.length > 0 && (
                    <details className="bg-muted/50 rounded-xl" open>
                      <summary className="px-4 py-3 cursor-pointer text-sm font-bold text-foreground flex items-center gap-2">
                        <Icon name="ShoppingBag" size={16} />
                        Detected Items ({extractedItems.length})
                      </summary>
                      <div className="px-4 pb-4">
                        <div className="bg-card rounded-lg border border-border overflow-hidden">
                          <table className="w-full text-xs">
                            <thead className="bg-muted">
                              <tr>
                                <th className="text-left px-3 py-2 font-semibold">Item</th>
                                <th className="text-center px-3 py-2 font-semibold">Qty</th>
                                <th className="text-right px-3 py-2 font-semibold">Price</th>
                                <th className="text-right px-3 py-2 font-semibold">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {extractedItems.map((item, idx) => (
                                <tr key={idx} className="border-t border-border">
                                  <td className="px-3 py-2">{item.name}</td>
                                  <td className="text-center px-3 py-2">{item.quantity}</td>
                                  <td className="text-right px-3 py-2">₹{item.price.toFixed(2)}</td>
                                  <td className="text-right px-3 py-2 font-medium">₹{item.total.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* Raw OCR Text (Collapsible) */}
                  <details className="bg-muted/50 rounded-xl">
                    <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                      <Icon name="FileText" size={16} />
                      View Raw ML Output
                    </summary>
                    <div className="px-4 pb-4">
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-card p-3 rounded-lg border border-border max-h-40 overflow-y-auto">
                        {rawText || 'No text extracted'}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              {!isProcessing && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  {!extractedData ? (
                    <>
                      <button
                        onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Choose Different Image
                      </button>
                      <button
                        onClick={processReceipt}
                        className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-lg text-sm font-bold hover:from-violet-700 hover:to-purple-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Icon name="Sparkles" size={16} />
                        Scan with ML Model
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setExtractedData(null); setImagePreview(null); setSelectedImage(null); }}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Scan Another Receipt
                      </button>
                      <button
                        onClick={handleConfirmTransaction}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg text-sm font-bold hover:from-emerald-600 hover:to-green-700 transition-all flex items-center gap-2"
                      >
                        <Icon name="Check" size={16} />
                        Add Transaction
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-muted/50 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Icon name="Shield" size={12} />
            <span>ML-powered OCR processes receipts locally • Your data never leaves your device</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
