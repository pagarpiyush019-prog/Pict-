import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { getUserRole } from '../../utils/roleFilter';

const MoreMenu = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();

  const allMenuItems = [
    { label: 'Paper Trading', path: '/paper-trading', icon: 'PlayCircle', color: 'from-green-500 to-emerald-600', description: 'Practice with virtual money', roles: ['normal_user', 'advisor'] },
    { label: 'Investment Quiz', path: '/investment-quiz', icon: 'Brain', color: 'from-purple-500 to-indigo-600', description: 'Test your knowledge', roles: ['normal_user', 'advisor'] },
    { label: 'Reports', path: '/reports', icon: 'BarChart', color: 'from-blue-500 to-cyan-600', description: 'View financial reports', roles: ['normal_user', 'advisor'] },
    { label: 'Money Tracker', path: '/money-tracker', icon: 'CreditCard', color: 'from-orange-500 to-red-600', description: 'Track all your money', roles: ['normal_user', 'advisor'] },
    { label: 'Savings', path: '/savings', icon: 'PiggyBank', color: 'from-pink-500 to-rose-600', description: 'Monitor savings goals', roles: ['normal_user', 'advisor'] },
    { label: 'Advisor', path: '/advisor', icon: 'UserCheck', color: 'from-teal-500 to-cyan-600', description: 'Get financial advice', roles: ['normal_user', 'advisor'] },
    { label: 'Advisor Dashboard', path: '/advisor-dashboard', icon: 'Users', color: 'from-indigo-500 to-violet-600', description: 'Manage clients', roles: ['advisor'] },
  ];

  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const accountItems = [
    { label: 'My Profile', path: '/profile', icon: 'User' },
    { label: 'Settings', path: '/financial-dashboard', icon: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/user-login');
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
            AS
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Arjun Sharma</h2>
            <p className="text-blue-200 text-sm">arjun.sharma@email.com</p>
            {userRole === 'advisor' && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-xs text-white font-medium">
                Advisor
              </span>
            )}
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 bg-white/20 rounded-full"
          >
            <Icon name="ChevronRight" size={20} color="white" />
          </button>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-slate-900 rounded-xl p-4 text-left border border-slate-800 active:scale-98 transition-transform"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <Icon name={item.icon} size={20} color="white" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-0.5">{item.label}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Account</h3>
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            {accountItems.map((item, index) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full px-4 py-3.5 text-left active:bg-slate-800 transition-colors ${
                  index < accountItems.length - 1 ? 'border-b border-slate-800' : ''
                }`}
              >
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                  <Icon name={item.icon} size={18} className="text-slate-400" />
                </div>
                <span className="flex-1 text-sm font-medium text-white">{item.label}</span>
                <Icon name="ChevronRight" size={18} className="text-slate-600" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-3.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 active:bg-red-500/20 transition-colors"
        >
          <Icon name="LogOut" size={18} />
          <span className="font-medium">Sign Out</span>
        </button>

        <p className="text-center text-xs text-slate-600">
          FinanceTracker v1.0.0
        </p>
      </div>
    </div>
  );
};

export default MoreMenu;
