import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReceiptUpload = ({ onReceiptProcessed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const imageFiles = files?.filter(file => file?.type?.startsWith('image/'));
    
    if (imageFiles?.length === 0) {
      alert('Please select valid image files (JPG, PNG, etc.)');
      return;
    }

    setIsProcessing(true);
    
    try {
      for (const file of imageFiles) {
        await processReceipt(file);
      }
    } catch (error) {
      console.error('Error processing receipts:', error);
      alert('Error processing receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processReceipt = async (file) => {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR results
    const mockOcrData = {
      merchant: "Target Store #1234",
      amount: Math.floor(Math.random() * 200) + 10,
      date: new Date()?.toISOString()?.split('T')?.[0],
      category: "shopping",
      items: [
        { name: "Household Items", amount: 45.99 },
        { name: "Groceries", amount: 32.50 },
        { name: "Personal Care", amount: 18.75 }
      ]
    };

    const processedFile = {
      id: Date.now() + Math.random(),
      file,
      ocrData: mockOcrData,
      preview: URL.createObjectURL(file)
    };

    setUploadedFiles(prev => [...prev, processedFile]);
    onReceiptProcessed(processedFile);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const updated = prev?.filter(f => f?.id !== fileId);
      // Clean up object URLs
      const removed = prev?.find(f => f?.id === fileId);
      if (removed) {
        URL.revokeObjectURL(removed?.preview);
      }
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Upload Receipt Images
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop receipt images here, or click to select files
            </p>
            
            <Button
              variant="outline"
              iconName="Camera"
              onClick={() => fileInputRef?.current?.click()}
              disabled={isProcessing}
            >
              Select Images
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Supports JPG, PNG, and other image formats
          </div>
          
          {/* AI Note */}
          <div className="mt-4 flex items-start gap-2 bg-violet-50 rounded-lg p-3 text-left">
            <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Sparkles" size={12} className="text-violet-600" />
            </div>
            <p className="text-xs text-violet-700">
              <span className="font-medium">AI-Powered:</span> We auto-read amount, date, and merchant from your receipt using AI – you just confirm.
            </p>
          </div>
        </div>
      </div>
      {/* Processing Indicator */}
      {isProcessing && (
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-violet-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">AI is reading your receipt...</span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-violet-100 rounded text-[10px] font-medium text-violet-600">
                  <Icon name="Sparkles" size={10} />
                  AI
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Extracting amount, date, merchant, and items automatically
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Uploaded Files */}
      {uploadedFiles?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Processed Receipts</h4>
          
          {uploadedFiles?.map((file) => (
            <div key={file?.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-4">
                {/* Receipt Preview */}
                <div className="w-16 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={file?.preview}
                    alt="Receipt preview showing transaction details"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* OCR Results */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-foreground">{file?.ocrData?.merchant}</h5>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 rounded text-[10px] font-medium text-emerald-600">
                        <Icon name="Check" size={10} />
                        AI Verified · 96%
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="X"
                      onClick={() => removeFile(file?.id)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-medium text-foreground">
                        ${file?.ocrData?.amount?.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date: </span>
                      <span className="font-medium text-foreground">
                        {new Date(file.ocrData.date)?.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category: </span>
                      <span className="font-medium text-foreground capitalize">
                        {file?.ocrData?.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Items: </span>
                      <span className="font-medium text-foreground">
                        {file?.ocrData?.items?.length} detected
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="Edit"
                    >
                      Edit Details
                    </Button>
                    <Button
                      variant="default"
                      size="xs"
                      iconName="Plus"
                    >
                      Add Transaction
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;