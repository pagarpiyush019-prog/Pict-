import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelector = ({ value, onChange, error, disabled = false }) => {
  const roleOptions = [
    {
      value: 'student',
      label: 'Student',
      icon: 'GraduationCap',
      color: 'blue',
      description: 'Loans, scholarships & budgeting'
    },
    {
      value: 'gig_worker',
      label: 'Gig Worker',
      icon: 'Car',
      color: 'green',
      description: 'Multi-income tracking'
    },
    {
      value: 'professional',
      label: 'Professional',
      icon: 'Briefcase',
      color: 'purple',
      description: 'Investment & portfolio'
    },
    {
      value: 'entrepreneur',
      label: 'Entrepreneur',
      icon: 'Building',
      color: 'orange',
      description: 'Business finances'
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: {
        bg: isSelected ? 'bg-blue-500/20' : 'bg-white/5',
        border: isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400',
        text: isSelected ? 'text-blue-300' : 'text-slate-300'
      },
      green: {
        bg: isSelected ? 'bg-green-500/20' : 'bg-white/5',
        border: isSelected ? 'border-green-500 ring-2 ring-green-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-400',
        text: isSelected ? 'text-green-300' : 'text-slate-300'
      },
      purple: {
        bg: isSelected ? 'bg-purple-500/20' : 'bg-white/5',
        border: isSelected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-400',
        text: isSelected ? 'text-purple-300' : 'text-slate-300'
      },
      orange: {
        bg: isSelected ? 'bg-orange-500/20' : 'bg-white/5',
        border: isSelected ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-orange-500 text-white' : 'bg-orange-500/20 text-orange-400',
        text: isSelected ? 'text-orange-300' : 'text-slate-300'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-300 block">
        Choose Your Profile <span className="text-red-400">*</span>
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {roleOptions.map((role) => {
          const isSelected = value === role.value;
          const colors = getColorClasses(role.color, isSelected);
          
          return (
            <button
              key={role.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(role.value)}
              className={`
                relative flex flex-col items-center p-4 rounded-xl border transition-all duration-200
                ${colors.bg} ${colors.border}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/10 hover:-translate-y-0.5'}
                ${isSelected ? 'shadow-lg' : 'hover:border-white/20'}
              `}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                </div>
              )}
              
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${colors.icon}`}>
                <Icon name={role.icon} size={22} />
              </div>
              
              {/* Label */}
              <span className={`font-semibold text-sm ${colors.text}`}>
                {role.label}
              </span>
              
              {/* Description */}
              <span className="text-[11px] text-slate-500 mt-1 text-center leading-tight">
                {role.description}
              </span>
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default RoleSelector;