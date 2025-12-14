import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BudgetCreationForm = ({ isOpen, onClose, onSave, editingBudget }) => {
  const [formData, setFormData] = useState({
    category: '',
    allocated: '',
    period: 'monthly',
    color: 'bg-primary',
    alertThreshold: '80'
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'housing', label: 'Housing & Rent' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'education', label: 'Education' },
    { value: 'savings', label: 'Savings' },
    { value: 'investments', label: 'Investments' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'debt', label: 'Debt Payments' },
    { value: 'other', label: 'Other' }
  ];

  const periodOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const colorOptions = [
    { value: 'bg-primary', label: 'Blue' },
    { value: 'bg-success', label: 'Green' },
    { value: 'bg-warning', label: 'Orange' },
    { value: 'bg-error', label: 'Red' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-teal-500', label: 'Teal' }
  ];

  const budgetTemplates = [
    {
      name: '50/30/20 Rule',
      description: 'Needs (50%), Wants (30%), Savings (20%)',
      categories: [
        { category: 'housing', allocated: 2000, period: 'monthly' },
        { category: 'food', allocated: 600, period: 'monthly' },
        { category: 'utilities', allocated: 200, period: 'monthly' },
        { category: 'entertainment', allocated: 400, period: 'monthly' },
        { category: 'shopping', allocated: 300, period: 'monthly' },
        { category: 'savings', allocated: 800, period: 'monthly' }
      ]
    },
    {
      name: 'Zero-Based Budget',
      description: 'Every dollar has a purpose',
      categories: [
        { category: 'housing', allocated: 1800, period: 'monthly' },
        { category: 'food', allocated: 500, period: 'monthly' },
        { category: 'transportation', allocated: 400, period: 'monthly' },
        { category: 'utilities', allocated: 150, period: 'monthly' },
        { category: 'healthcare', allocated: 200, period: 'monthly' },
        { category: 'entertainment', allocated: 200, period: 'monthly' },
        { category: 'savings', allocated: 600, period: 'monthly' },
        { category: 'debt', allocated: 300, period: 'monthly' }
      ]
    }
  ];

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget?.category,
        allocated: editingBudget?.allocated?.toString(),
        period: editingBudget?.period,
        color: editingBudget?.color,
        alertThreshold: editingBudget?.alertThreshold?.toString() || '80'
      });
    } else {
      setFormData({
        category: '',
        allocated: '',
        period: 'monthly',
        color: 'bg-primary',
        alertThreshold: '80'
      });
    }
    setErrors({});
  }, [editingBudget, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.allocated || parseFloat(formData?.allocated) <= 0) {
      newErrors.allocated = 'Amount must be greater than 0';
    }

    if (!formData?.alertThreshold || parseFloat(formData?.alertThreshold) < 0 || parseFloat(formData?.alertThreshold) > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const budgetData = {
        ...formData,
        allocated: parseFloat(formData?.allocated),
        alertThreshold: parseFloat(formData?.alertThreshold),
        spent: editingBudget?.spent || 0,
        id: editingBudget?.id || Date.now()
      };
      onSave(budgetData);
      onClose();
    }
  };

  const applyTemplate = (template) => {
    // This would typically create multiple budgets, but for demo we'll just show the first one
    const firstCategory = template?.categories?.[0];
    setFormData({
      category: firstCategory?.category,
      allocated: firstCategory?.allocated?.toString(),
      period: firstCategory?.period,
      color: 'bg-primary',
      alertThreshold: '80'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingBudget ? 'Edit Budget' : 'Create New Budget'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="h-8 w-8 p-0"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Budget Templates */}
          {!editingBudget && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Quick Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetTemplates?.map((template, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => applyTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{template?.name}</h4>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{template?.description}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <h3 className="text-lg font-medium text-foreground mb-4">Custom Budget</h3>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors?.category}
              required
              searchable
              placeholder="Select a category"
            />

            <Input
              label="Budget Amount"
              type="number"
              placeholder="0.00"
              value={formData?.allocated}
              onChange={(e) => handleInputChange('allocated', e?.target?.value)}
              error={errors?.allocated}
              required
              min="0"
              step="0.01"
            />

            <Select
              label="Time Period"
              options={periodOptions}
              value={formData?.period}
              onChange={(value) => handleInputChange('period', value)}
              required
            />

            <Input
              label="Alert Threshold (%)"
              type="number"
              placeholder="80"
              value={formData?.alertThreshold}
              onChange={(e) => handleInputChange('alertThreshold', e?.target?.value)}
              error={errors?.alertThreshold}
              description="Get notified when spending reaches this percentage"
              min="0"
              max="100"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions?.map((color) => (
                <button
                  key={color?.value}
                  type="button"
                  onClick={() => handleInputChange('color', color?.value)}
                  className={`w-8 h-8 rounded-full ${color?.value} border-2 transition-all ${
                    formData?.color === color?.value ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  title={color?.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              iconName={editingBudget ? 'Save' : 'Plus'}
              iconPosition="left"
            >
              {editingBudget ? 'Update Budget' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetCreationForm;