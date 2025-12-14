import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InvestmentForm = ({ onClose, onSubmit }) => {
  const [investmentType, setInvestmentType] = useState('bonds');
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    tenure: '',
    interestRate: '',
    riskLevel: 'Low',
    category: ''
  });

  const investmentCategories = {
    bonds: {
      title: 'Government & Corporate Bonds',
      icon: 'Shield',
      color: 'purple',
      options: [
        { name: 'Government Treasury Bonds', rate: '7.5%', tenure: '10 Years', risk: 'Low' },
        { name: 'Corporate Bonds - AAA Rated', rate: '8.2%', tenure: '5 Years', risk: 'Low' },
        { name: 'Infrastructure Bonds', rate: '8.5%', tenure: '7 Years', risk: 'Medium' },
        { name: 'Tax-Free Bonds', rate: '7.0%', tenure: '10 Years', risk: 'Low' }
      ]
    },
    mutualFunds: {
      title: 'Mutual Funds',
      icon: 'TrendingUp',
      color: 'pink',
      options: [
        { name: 'HDFC Balanced Advantage Fund', rate: '12.5%', tenure: 'Open-ended', risk: 'Medium' },
        { name: 'ICICI Prudential Equity Fund', rate: '14.8%', tenure: 'Open-ended', risk: 'High' },
        { name: 'SBI Bluechip Fund', rate: '13.2%', tenure: 'Open-ended', risk: 'Medium' },
        { name: 'Axis Mid Cap Fund', rate: '15.5%', tenure: 'Open-ended', risk: 'High' },
        { name: 'UTI Liquid Fund', rate: '6.8%', tenure: 'Open-ended', risk: 'Low' }
      ]
    },
    sips: {
      title: 'Systematic Investment Plans (SIPs)',
      icon: 'Repeat',
      color: 'amber',
      options: [
        { name: 'HDFC Top 100 Fund SIP', rate: '13.8%', tenure: 'Monthly', risk: 'Medium' },
        { name: 'ICICI Prudential Nifty Index SIP', rate: '12.5%', tenure: 'Monthly', risk: 'Low' },
        { name: 'SBI Small Cap Fund SIP', rate: '16.2%', tenure: 'Monthly', risk: 'High' },
        { name: 'Axis Bluechip Fund SIP', rate: '13.5%', tenure: 'Monthly', risk: 'Medium' }
      ]
    }
  };

  const handleSelectPlan = (option) => {
    setFormData({
      ...formData,
      name: option.name,
      interestRate: option.rate,
      tenure: option.tenure,
      riskLevel: option.risk
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({
      ...formData,
      type: investmentType,
      date: new Date().toISOString()
    });
    onClose();
  };

  const getColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      pink: 'bg-pink-50 border-pink-200 text-pink-700',
      amber: 'bg-amber-50 border-amber-200 text-amber-700'
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Make an Investment</h2>
              <p className="text-blue-100 text-sm mt-1">Choose your investment type and plan</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>

        {/* Investment Type Selector */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Investment Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(investmentCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => {
                  setInvestmentType(key);
                  setFormData({ ...formData, name: '', interestRate: '', tenure: '', riskLevel: 'Low' });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  investmentType === key
                    ? `${getColorClasses(category.color)} border-current shadow-md`
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon name={category.icon} size={24} className="mx-auto mb-2" />
                <p className="font-semibold text-sm">{category.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Investment Plans */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available {investmentCategories[investmentType].title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {investmentCategories[investmentType].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPlan(option)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.name === option.name
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm flex-1">{option.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    option.risk === 'Low' ? 'bg-green-100 text-green-700' :
                    option.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {option.risk} Risk
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Icon name="TrendingUp" size={14} className="text-green-600" />
                    {option.rate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={14} className="text-blue-600" />
                    {option.tenure}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Investment Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Selected Plan Display */}
            {formData.name && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Selected Plan</p>
                <p className="font-semibold text-gray-900">{formData.name}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>Rate: {formData.interestRate}</span>
                  <span>•</span>
                  <span>Tenure: {formData.tenure}</span>
                  <span>•</span>
                  <span>Risk: {formData.riskLevel}</span>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Investment Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1000"
                  step="1000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum investment: ₹1,000</p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Add any notes or preferences..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            {/* Expected Returns */}
            {formData.amount && formData.interestRate && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon name="Calculator" size={18} className="text-green-600" />
                  Expected Returns
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Investment Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{parseInt(formData.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Expected Annual Return</p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{(parseInt(formData.amount || 0) * parseFloat(formData.interestRate) / 100).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name || !formData.amount}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Icon name="Check" size={18} className="inline mr-2" />
              Confirm Investment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm;
