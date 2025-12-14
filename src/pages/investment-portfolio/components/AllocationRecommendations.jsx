import React from 'react';
import Icon from '../../../components/AppIcon';

const AllocationRecommendations = ({ recommendations, userProfile, onApplyRebalance }) => {
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'rebalance': return 'Scale';
      case 'diversify': return 'Globe';
      case 'reduce_risk': return 'Shield';
      case 'increase_exposure': return 'TrendingUp';
      default: return 'Lightbulb';
    }
  };

  // Get category tags based on recommendation type
  const getCategoryTags = (type) => {
    switch (type) {
      case 'rebalance': 
        return [{ label: 'Risk Control', color: 'bg-blue-100 text-blue-700' }, { label: 'Stability', color: 'bg-teal-100 text-teal-700' }];
      case 'diversify': 
        return [{ label: 'Diversification', color: 'bg-purple-100 text-purple-700' }, { label: 'Growth', color: 'bg-emerald-100 text-emerald-700' }];
      case 'reduce_risk': 
        return [{ label: 'Risk Control', color: 'bg-blue-100 text-blue-700' }, { label: 'Safety', color: 'bg-amber-100 text-amber-700' }];
      case 'increase_exposure': 
        return [{ label: 'Growth', color: 'bg-emerald-100 text-emerald-700' }, { label: 'Wealth Building', color: 'bg-primary/10 text-primary' }];
      default: 
        return [{ label: 'Optimization', color: 'bg-muted text-muted-foreground' }];
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', btnBg: 'from-red-500 to-rose-600' };
      case 'medium': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', btnBg: 'from-amber-500 to-orange-600' };
      case 'low': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', btnBg: 'from-emerald-500 to-teal-600' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', btnBg: 'from-gray-500 to-gray-600' };
    }
  };

  return (
    <div className="p-5">
      {/* User Profile Summary - Compact */}
      <div className="mb-4 p-3 bg-gradient-to-r from-primary/10 to-violet-50 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name="User" size={14} className="text-primary" />
            <span className="text-xs font-medium text-foreground">Your Profile</span>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {userProfile?.riskTolerance}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-3 text-[11px]">
          <div>
            <p className="text-muted-foreground">Age</p>
            <p className="font-medium text-foreground">{userProfile?.age}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Horizon</p>
            <p className="font-medium text-foreground">{userProfile?.timeHorizon}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Goal</p>
            <p className="font-medium text-foreground truncate">{userProfile?.investmentGoal}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Experience</p>
            <p className="font-medium text-foreground">{userProfile?.experience?.split('/')[0]}</p>
          </div>
        </div>
      </div>

      {/* Recommendations List - With Tags and Prominent Apply */}
      <div className="space-y-3">
        {recommendations?.map((rec) => {
          const priority = getPriorityStyles(rec?.priority);
          const tags = getCategoryTags(rec?.type);
          return (
            <div key={rec?.id} className={`p-4 rounded-xl border-2 ${priority.border} ${priority.bg} hover:shadow-md transition-all`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  rec?.priority === 'high' ? 'bg-red-100' : rec?.priority === 'medium' ? 'bg-amber-100' : 'bg-emerald-100'
                }`}>
                  <Icon name={getRecommendationIcon(rec?.type)} size={20} className={priority.text} />
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Title Row with Priority */}
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{rec?.title}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${priority.text} ${priority.bg} border ${priority.border} uppercase`}>
                      {rec?.priority} priority
                    </span>
                  </div>

                  {/* Category Tags */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {tags.map((tag, idx) => (
                      <span key={idx} className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${tag.color}`}>
                        {tag.label}
                      </span>
                    ))}
                    <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                      <Icon name="Sparkles" size={8} className="text-violet-400" />
                      AI suggested
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">{rec?.description}</p>
                  
                  {/* Impact Stats + Prominent Apply Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[11px]">
                      <div className="flex items-center gap-1 px-2 py-1 bg-card/60 rounded-lg">
                        <Icon name="TrendingUp" size={12} className="text-success" />
                        <span className="text-muted-foreground">Return:</span>
                        <span className="font-bold text-success">+{rec?.expectedImpact?.returnIncrease}%</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-card/60 rounded-lg">
                        <Icon name="Shield" size={12} className="text-primary" />
                        <span className="text-muted-foreground">Risk:</span>
                        <span className="font-bold text-primary">{rec?.expectedImpact?.riskChange}</span>
                      </div>
                    </div>
                    
                    {/* Prominent Apply Button */}
                    <button className={`px-4 py-2 text-xs font-bold text-white bg-gradient-to-r ${priority.btnBg} rounded-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1.5`}>
                      <Icon name="Zap" size={12} />
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Auto-Rebalancing Option */}
      <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Icon name="Cpu" size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">AI Auto-Rebalancing</p>
                <span className="text-[8px] px-1.5 py-0.5 bg-violet-500 text-white rounded font-bold uppercase">Smart</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Let AI maintain your optimal allocation automatically</p>
            </div>
          </div>
          <button 
            onClick={onApplyRebalance}
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg hover:from-violet-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Icon name="Zap" size={14} />
            Apply Now
          </button>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-2">
          <Icon name="Lightbulb" size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700">
            <span className="font-semibold">Pro Tip:</span> Click "Apply AI Rebalance" to see a detailed comparison of your current vs. AI-suggested allocation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllocationRecommendations;