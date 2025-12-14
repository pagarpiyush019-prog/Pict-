import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionSplit = ({ transaction, isOpen, onClose, onSave }) => {
  const [splitItems, setSplitItems] = useState([
    {
      id: 1,
      description: transaction?.description || '',
      amount: transaction?.amount || 0,
      category: transaction?.category || '',
      assignedTo: 'me'
    }
  ]);

  const [splitMethod, setSplitMethod] = useState('equal');
  const [participants, setParticipants] = useState(['me']);
  const [newParticipant, setNewParticipant] = useState('');

  const categoryOptions = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' }
  ];

  const splitMethodOptions = [
    { value: 'equal', label: 'Split Equally' },
    { value: 'percentage', label: 'By Percentage' },
    { value: 'amount', label: 'By Amount' },
    { value: 'custom', label: 'Custom Split' }
  ];

  const addParticipant = () => {
    if (newParticipant?.trim() && !participants?.includes(newParticipant?.trim())) {
      setParticipants([...participants, newParticipant?.trim()]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (participant) => {
    if (participant !== 'me' && participants?.length > 1) {
      setParticipants(participants?.filter(p => p !== participant));
      // Update split items to remove assignments to removed participant
      setSplitItems(splitItems?.map(item => 
        item?.assignedTo === participant ? { ...item, assignedTo: 'me' } : item
      ));
    }
  };

  const addSplitItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      amount: 0,
      category: transaction?.category || '',
      assignedTo: 'me'
    };
    setSplitItems([...splitItems, newItem]);
  };

  const updateSplitItem = (id, field, value) => {
    setSplitItems(splitItems?.map(item => 
      item?.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeSplitItem = (id) => {
    if (splitItems?.length > 1) {
      setSplitItems(splitItems?.filter(item => item?.id !== id));
    }
  };

  const calculateEqualSplit = () => {
    const totalAmount = transaction?.amount || 0;
    const perPerson = totalAmount / participants?.length;
    
    const newSplitItems = participants?.map((participant, index) => ({
      id: index + 1,
      description: `${transaction?.description || 'Split item'} - ${participant}`,
      amount: perPerson,
      category: transaction?.category || '',
      assignedTo: participant
    }));
    
    setSplitItems(newSplitItems);
  };

  const getTotalSplitAmount = () => {
    return splitItems?.reduce((sum, item) => sum + (parseFloat(item?.amount) || 0), 0);
  };

  const getAmountDifference = () => {
    const originalAmount = transaction?.amount || 0;
    const splitTotal = getTotalSplitAmount();
    return Math.abs(originalAmount - splitTotal);
  };

  const handleSave = () => {
    const splitData = {
      originalTransaction: transaction,
      splitItems: splitItems?.filter(item => item?.amount > 0),
      participants,
      method: splitMethod,
      totalAmount: getTotalSplitAmount()
    };
    
    onSave(splitData);
    onClose();
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Split Transaction</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {transaction?.description} - ${transaction?.amount?.toFixed(2)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Split Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Split Method"
              options={splitMethodOptions}
              value={splitMethod}
              onChange={setSplitMethod}
            />
            
            {splitMethod === 'equal' && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  iconName="Calculator"
                  onClick={calculateEqualSplit}
                >
                  Calculate Equal Split
                </Button>
              </div>
            )}
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Participants ({participants?.length})
            </label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {participants?.map((participant) => (
                <div
                  key={participant}
                  className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-md"
                >
                  <Icon 
                    name={participant === 'me' ? 'User' : 'Users'} 
                    size={14} 
                    className="text-muted-foreground" 
                  />
                  <span className="text-sm text-foreground">{participant}</span>
                  {participant !== 'me' && (
                    <button
                      onClick={() => removeParticipant(participant)}
                      className="text-muted-foreground hover:text-error"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Add participant name or email"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && addParticipant()}
              />
              <Button
                variant="outline"
                iconName="Plus"
                onClick={addParticipant}
                disabled={!newParticipant?.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Split Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-foreground">
                Split Items ({splitItems?.length})
              </label>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                onClick={addSplitItem}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {splitItems?.map((item, index) => (
                <div key={item?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      label="Description"
                      value={item?.description}
                      onChange={(e) => updateSplitItem(item?.id, 'description', e?.target?.value)}
                      placeholder="Item description"
                    />
                    
                    <Input
                      type="number"
                      label="Amount"
                      value={item?.amount}
                      onChange={(e) => updateSplitItem(item?.id, 'amount', parseFloat(e?.target?.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                    />
                    
                    <Select
                      label="Category"
                      options={categoryOptions}
                      value={item?.category}
                      onChange={(value) => updateSplitItem(item?.id, 'category', value)}
                    />
                    
                    <div className="space-y-2">
                      <Select
                        label="Assigned To"
                        options={participants?.map(p => ({ value: p, label: p === 'me' ? 'Me' : p }))}
                        value={item?.assignedTo}
                        onChange={(value) => updateSplitItem(item?.id, 'assignedTo', value)}
                      />
                      
                      {splitItems?.length > 1 && (
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Trash2"
                          onClick={() => removeSplitItem(item?.id)}
                          className="w-full"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Split Summary</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Original Amount:</span>
                <div className="font-semibold text-foreground">
                  ${transaction?.amount?.toFixed(2)}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Split Total:</span>
                <div className="font-semibold text-foreground">
                  ${getTotalSplitAmount()?.toFixed(2)}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Difference:</span>
                <div className={`font-semibold ${
                  getAmountDifference() > 0.01 ? 'text-warning' : 'text-success'
                }`}>
                  ${getAmountDifference()?.toFixed(2)}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Participants:</span>
                <div className="font-semibold text-foreground">
                  {participants?.length}
                </div>
              </div>
            </div>

            {getAmountDifference() > 0.01 && (
              <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded text-sm text-warning">
                <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                Split amounts don't match the original transaction amount
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Split"
              onClick={handleSave}
              disabled={getAmountDifference() > 0.01}
            >
              Save Split
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSplit;