import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const Profile = () => {
  const navigate = useNavigate();
  const [userData] = useState({
    name: 'Piyush',
    email: 'pagarpiyush019@gmail.com',
    phone: '9175479452',
    joinDate: 'December 2025'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Profile Header */}
      <div className="relative px-4 pt-6 pb-8" style={{ backgroundColor: '#9277DC' }}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg">
              <span className="text-3xl font-bold" style={{ color: '#9277DC' }}>P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{userData.name}</h1>
              <p className="text-sm text-white/80">{userData.phone}</p>
              <p className="text-sm text-white/80">{userData.email}</p>
              <p className="text-xs text-white/70 mt-1">Member since {userData.joinDate}</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs font-medium text-white">Trial period</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-purple-100 dark:border-purple-900/50">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#9277DC' }}>
              <Icon name="IndianRupee" size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹ 0.00</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-amber-100 dark:border-amber-900/50">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Icon name="Coins" size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Fincoin Earned</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
        </div>

        {/* Financial Key */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Financial Key</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="FileText" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Smart Budgeting</span>
            </button>
            <button className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="BookOpen" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">My Passbook</span>
            </button>
            <button className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="List" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Transaction History</span>
            </button>
            <button className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="MessageCircle" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Whatsapp Connect</span>
            </button>
          </div>
        </div>

        {/* Remainder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Remainder</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: '#9277DC' }}>
                <Icon name="CalendarCheck" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Dues & Reminders</span>
            </button>
            <button className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="Target" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Financial Goals</span>
            </button>
            <button className="bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="Gift" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Happy Sharing</span>
            </button>
            <button className="bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="Home" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Hometronics</span>
            </button>
          </div>
        </div>

        {/* Explore More Button */}
        <div className="flex items-center justify-center py-2">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span>💎</span>
            <span>EXPLORE MORE</span>
            <span>💎</span>
          </button>
        </div>

        {/* Additional Features from More Menu */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">More Features</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/paper-trading')} className="bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="PlayCircle" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Paper Trading</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">Practice with virtual money</span>
            </button>
            <button onClick={() => navigate('/investment-quiz')} className="bg-gradient-to-br from-purple-50 to-indigo-100/50 dark:from-purple-900/20 dark:to-indigo-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="Brain" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Investment Quiz</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">Test your knowledge</span>
            </button>
            <button onClick={() => navigate('/reports')} className="bg-gradient-to-br from-blue-50 to-cyan-100/50 dark:from-blue-900/20 dark:to-cyan-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="BarChart" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Reports</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">View financial reports</span>
            </button>
            <button onClick={() => navigate('/money-tracker')} className="bg-gradient-to-br from-orange-50 to-red-100/50 dark:from-orange-900/20 dark:to-red-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="CreditCard" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Money Tracker</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">Track all your money</span>
            </button>
            <button onClick={() => navigate('/savings')} className="bg-gradient-to-br from-pink-50 to-rose-100/50 dark:from-pink-900/20 dark:to-rose-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="PiggyBank" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Savings</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">Monitor savings goals</span>
            </button>
            <button onClick={() => navigate('/advisor')} className="bg-gradient-to-br from-teal-50 to-cyan-100/50 dark:from-teal-900/20 dark:to-cyan-900/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="UserCheck" size={22} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Advisor</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">Get financial advice</span>
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General Settings</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="User" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Profile info</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            <div className="w-full flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Lock" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">App lock</span>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </div>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Star" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Rate App</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Sparkles" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Subscription</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Users" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Invite Friend & Family</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Info" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">About Us</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Terms & Conditions</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Shield" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Privacy Policy</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Help & Support</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="MessageCircle" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Financial Support</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Eye" size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">What's New</span>
              </div>
              <Icon name="ExternalLink" size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-red-100 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Danger Zone</h2>
            <span className="text-xs font-bold px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">Careful</span>
          </div>
          <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-200 dark:border-red-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">Close Account</span>
            </div>
            <Icon name="ChevronRight" size={20} className="text-red-400" />
          </button>
        </div>

        {/* Log Out Button */}
        <button className="w-full py-4 rounded-2xl font-bold text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm flex items-center justify-center gap-2.5 border border-red-200 dark:border-red-900/50">
          <Icon name="LogOut" size={22} strokeWidth={2.5} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
