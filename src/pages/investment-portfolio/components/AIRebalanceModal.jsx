import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AIRebalanceModal = ({ isOpen, onClose, onConfirm, portfolioValue }) => {
  const [step, setStep] = useState('preview'); // preview, processing, success
  const [animateChanges, setAnimateChanges] = useState(false);

  // Current vs Suggested allocation data
  const allocationComparison = [
    { 
      name: 'Index Funds', 
      current: 40, 
      suggested: 45, 
      currentValue: 34200, 
      suggestedValue: 38439,
      color: '#4F46E5',
      change: '+5%',
      reason: 'Increase stability'
    },
    { 
      name: 'Mutual Funds', 
      current: 25, 
      suggested: 22, 
      currentValue: 21355, 
      suggestedValue: 18792,
      color: '#10B981',
      change: '-3%',
      reason: 'Reduce overlap'
    },
    { 
      name: 'ETFs', 
      current: 20, 
      suggested: 18, 
      currentValue: 17084, 
      suggestedValue: 15376,
      color: '#F59E0B',
      change: '-2%',
      reason: 'Trim gains'
    },
    { 
      name: 'Stocks', 
      current: 10, 
      suggested: 8, 
      currentValue: 8542, 
      suggestedValue: 6834,
      color: '#8B5CF6',
      change: '-2%',
      reason: 'Lower volatility'
    },
    { 
      name: 'Gold/SGBs', 
      current: 5, 
      suggested: 7, 
      currentValue: 4271, 
      suggestedValue: 5979,
      color: '#EC4899',
      change: '+2%',
      reason: 'Hedge inflation'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    if (isOpen) {
      setStep('preview');
      setAnimateChanges(false);
      setTimeout(() => setAnimateChanges(true), 300);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setStep('processing');
    
    setTimeout(() => {
      setStep('success');
      
      // Store notification for dashboard
      const notification = {
        id: Date.now(),
        type: 'ai_rebalance',
        priority: 'low',
        title: 'AI Coach Rebalanced Your Portfolio',
        message: 'Your portfolio has been rebalanced to reduce risk while maintaining expected returns. Index fund allocation increased by 5% for stability.',
        timestamp: new Date().toISOString(),
        isNew: true
      };
      
      localStorage.setItem('aiRebalanceNotification', JSON.stringify(notification));
      window.dispatchEvent(new CustomEvent('aiRebalanceComplete', { detail: notification }));
      
      setTimeout(() => {
        onConfirm(allocationComparison);
        onClose();
      }, 2000);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === 'preview' ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-card rounded-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Portfolio Rebalance</h2>
                <p className="text-xs text-violet-200">Smart allocation optimization based on your profile</p>
              </div>
            </div>
            {step === 'preview' && (
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {step === 'preview' && (
            <>
              {/* Comparison Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
                    <span className="text-xs font-medium text-violet-600">AI Suggested</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Portfolio Value</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(portfolioValue || 85420)}</p>
                </div>
              </div>

              {/* Allocation Comparison */}
              <div className="space-y-3 mb-6">
                {allocationComparison.map((item, index) => (
                  <div 
                    key={item.name}
                    className="p-4 rounded-lg border-2 transition-all duration-500"
                    style={{ 
                      transitionDelay: `${index * 100}ms`,
                      opacity: animateChanges ? 1 : 0,
                      transform: animateChanges ? 'translateX(0)' : 'translateX(-16px)',
                      borderColor: item.current !== item.suggested ? '#8B5CF6' : 'var(--color-border)',
                      backgroundColor: item.current !== item.suggested ? '#F5F3FF' : 'var(--color-muted)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-semibold text-foreground">{item.name}</span>
                        {item.current !== item.suggested && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.suggested > item.current 
                              ? 'bg-success/20 text-success' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.change}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-violet-600 font-medium">
                        {item.reason}
                      </span>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-[10px] text-muted-foreground">Current</div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-muted-foreground rounded-full transition-all duration-700"
                            style={{ width: `${item.current}%` }}
                          />
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-xs font-medium text-muted-foreground">{item.current}%</span>
                          <span className="text-[10px] text-muted-foreground/70 ml-1">({formatCurrency(item.currentValue)})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-[10px] text-violet-600 font-medium">Suggested</div>
                        <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000"
                            style={{ width: animateChanges ? `${item.suggested}%` : '0%' }}
                          />
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-xs font-bold text-violet-700">{item.suggested}%</span>
                          <span className="text-[10px] text-violet-500 ml-1">({formatCurrency(item.suggestedValue)})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Icon name="Brain" size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">AI Analysis Summary</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Based on your <span className="font-semibold text-violet-700">Moderate-Aggressive</span> risk profile and 
                      <span className="font-semibold text-violet-700"> 8-10 year</span> investment horizon, I recommend increasing 
                      index fund allocation for stability while adding gold for inflation hedging. 
                      This rebalance reduces portfolio volatility by <span className="font-semibold text-success">~12%</span> while 
                      maintaining similar expected returns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-700 rounded-lg hover:from-violet-700 hover:to-purple-800 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Icon name="Zap" size={16} />
                  Apply AI Rebalance
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 animate-ping opacity-20" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse opacity-40" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-700 flex items-center justify-center">
                  <Icon name="Cpu" size={32} className="text-white animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-2">AI is Rebalancing...</h3>
              <p className="text-sm text-muted-foreground mb-6">Optimizing your portfolio allocation</p>
              
              <div className="max-w-xs mx-auto space-y-2">
                <div className="flex items-center gap-3 text-left">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-xs text-muted-foreground">Analyzing current holdings</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-xs text-muted-foreground">Calculating optimal allocation</span>
                </div>
                <div className="flex items-center gap-3 text-left animate-pulse">
                  <Icon name="Loader" size={16} className="text-violet-500 animate-spin" />
                  <span className="text-xs text-violet-600 font-medium">Executing rebalance trades...</span>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center animate-bounce">
                <Icon name="Check" size={40} className="text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">Rebalance Complete! 🎉</h3>
              <p className="text-sm text-muted-foreground mb-4">Your portfolio has been optimized by AI</p>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">-12%</p>
                  <p className="text-[10px] text-muted-foreground">Risk Reduced</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-violet-600">+0.5%</p>
                  <p className="text-[10px] text-muted-foreground">Expected Return</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">5</p>
                  <p className="text-[10px] text-muted-foreground">Trades Executed</p>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full text-xs text-violet-600">
                <Icon name="Bell" size={12} />
                <span>Notification sent to your dashboard</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRebalanceModal;
