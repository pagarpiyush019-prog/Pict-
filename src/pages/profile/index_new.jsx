import React, { useState } from 'react';
import Icon from '../../components/AppIcon';

const Profile = () => {
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

      <div className="px-4 -mt-4 space-y-4">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-900">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
              <Icon name="IndianRupee" size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Balance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">₹ 0.00</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-900">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-3">
              <Icon name="Coins" size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fincoin Earned</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
          </div>
        </div>

        {/* Financial Key */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Financial Key</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="FileText" size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">Smart Budgeting</span>
            </button>
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="BookOpen" size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">My Passbook</span>
            </button>
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="List" size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">Transaction History</span>
            </button>
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="MessageCircle" size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">Whatsapp Connect</span>
            </button>
          </div>
        </div>

        {/* Remainder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Remainder</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="CalendarCheck" size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">Dues & Reminders</span>
            </button>
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Target" size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">Financial Goals</span>
            </button>
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Gift" size={20} className="text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">Happy Sharing</span>
            </button>
            <button className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Home" size={20} className="text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">Hometronics</span>
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

        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">General Settings</h2>
          <div className="space-y-1">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Help & Support</h2>
          <div className="space-y-1">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Danger Zone</h2>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Careful</span>
          </div>
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Close Account</span>
            </div>
            <Icon name="ChevronRight" size={18} className="text-red-400" />
          </button>
        </div>

        {/* Log Out Button */}
        <button className="w-full py-4 rounded-xl font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2">
          <Icon name="LogOut" size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
