import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

// AI pattern matching based on past transactions
const aiPatterns = {
  'zomato': { category: 'food', account: 'credit-card', confidence: 94 },
  'swiggy': { category: 'food', account: 'credit-card', confidence: 92 },
  'uber': { category: 'transportation', account: 'credit-card', confidence: 96 },
  'ola': { category: 'transportation', account: 'credit-card', confidence: 95 },
  'amazon': { category: 'shopping', account: 'credit-card', confidence: 91 },
  'flipkart': { category: 'shopping', account: 'credit-card', confidence: 90 },
  'netflix': { category: 'entertainment', account: 'credit-card', confidence: 98 },
  'spotify': { category: 'entertainment', account: 'credit-card', confidence: 97 },
  'electricity': { category: 'utilities', account: 'checking', confidence: 89 },
  'water bill': { category: 'utilities', account: 'checking', confidence: 88 },
  'salary': { category: 'income', account: 'checking', confidence: 99 },
  'freelance': { category: 'income', account: 'checking', confidence: 93 },
  'pharmacy': { category: 'healthcare', account: 'checking', confidence: 87 },
  'hospital': { category: 'healthcare', account: 'checking', confidence: 91 },
  'gym': { category: 'healthcare', account: 'credit-card', confidence: 85 },
  'whole foods': { category: 'food', account: 'credit-card', confidence: 93 },
  'starbucks': { category: 'food', account: 'credit-card', confidence: 96 },
};

const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    account: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    merchant: '',
    notes: ''
  });
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [appliedAi, setAppliedAi] = useState({ category: false, account: false });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // AI pattern detection
  useEffect(() => {
    const text = `${formData.description} ${formData.merchant}`.toLowerCase();
    
    for (const [pattern, suggestion] of Object.entries(aiPatterns)) {
      if (text.includes(pattern)) {
        setAiSuggestion({ ...suggestion, pattern });
        
        // Auto-apply suggestions if fields are empty
        if (!formData.category && !appliedAi.category) {
          setFormData(prev => ({ ...prev, category: suggestion.category }));
          setAppliedAi(prev => ({ ...prev, category: true }));
        }
        if (!formData.account && !appliedAi.account) {
          setFormData(prev => ({ ...prev, account: suggestion.account }));
          setAppliedAi(prev => ({ ...prev, account: true }));
        }
        return;
      }
    }
    
    setAiSuggestion(null);
  }, [formData.description, formData.merchant]);

  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' }
  ];

  const categoryOptions = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'income', label: 'Income' },
    { value: 'investment', label: 'Investment' }
  ];

  const accountOptions = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData?.account) {
      newErrors.account = 'Please select an account';
    }
    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        id: Date.now()?.toString(),
        status: 'completed',
        createdAt: new Date()?.toISOString()
      };

      await onSave(transactionData);
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        account: '',
        date: new Date()?.toISOString()?.split('T')?.[0],
        merchant: '',
        notes: ''
      });
      setAiSuggestion(null);
      setAppliedAi({ category: false, account: false });
      
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestedCategories = () => {
    const description = formData?.description?.toLowerCase();
    const suggestions = [];

    if (description?.includes('food') || description?.includes('restaurant') || description?.includes('grocery')) {
      suggestions?.push('food');
    }
    if (description?.includes('gas') || description?.includes('uber') || description?.includes('taxi')) {
      suggestions?.push('transportation');
    }
    if (description?.includes('amazon') || description?.includes('store') || description?.includes('shop')) {
      suggestions?.push('shopping');
    }

    return suggestions;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-lg shadow-modal w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Add New Transaction</h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Transaction Type */}
          <Select
            label="Transaction Type"
            options={typeOptions}
            value={formData?.type}
            onChange={(value) => handleInputChange('type', value)}
            required
          />

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Amount"
              placeholder="0.00"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              error={errors?.amount}
              required
              step="0.01"
              min="0"
            />
            <Input
              type="date"
              label="Date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              error={errors?.date}
              required
            />
          </div>

          {/* Description */}
          <Input
            type="text"
            label="Description"
            placeholder="Enter transaction description"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            error={errors?.description}
            required
          />

          {/* AI Suggestion Banner */}
          {aiSuggestion && (
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg p-3 border border-violet-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                  <Icon name="Sparkles" size={14} className="text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-violet-700">
                    <span className="font-medium">AI detected "{aiSuggestion.pattern}"</span> – auto-filled category and account based on your past patterns.
                  </p>
                </div>
                <span className="text-[10px] font-medium text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                  {aiSuggestion.confidence}% confident
                </span>
              </div>
            </div>
          )}

          {/* Category and Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Category *</label>
                {appliedAi.category && aiSuggestion && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-violet-600">
                    <Icon name="Sparkles" size={10} />
                    Suggested by AI
                  </span>
                )}
              </div>
              <Select
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => {
                  handleInputChange('category', value);
                  setAppliedAi(prev => ({ ...prev, category: false }));
                }}
                error={errors?.category}
                required
                searchable
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Account *</label>
                {appliedAi.account && aiSuggestion && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-violet-600">
                    <Icon name="Sparkles" size={10} />
                    Suggested by AI
                  </span>
                )}
              </div>
              <Select
                options={accountOptions}
                value={formData?.account}
                onChange={(value) => {
                  handleInputChange('account', value);
                  setAppliedAi(prev => ({ ...prev, account: false }));
                }}
                error={errors?.account}
                required
              />
            </div>
          </div>

          {/* Merchant (Optional) */}
          <Input
            type="text"
            label="Merchant (Optional)"
            placeholder="Store or service name"
            value={formData?.merchant}
            onChange={(e) => handleInputChange('merchant', e?.target?.value)}
          />

          {/* Notes (Optional) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
              placeholder="Additional notes about this transaction"
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 -mx-4 md:-mx-6 px-4 md:px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="Plus" size={16} />
                  Add Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;