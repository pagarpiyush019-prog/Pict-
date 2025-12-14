import React, { useState } from 'react';
import Icon from '../../components/AppIcon';

const AdvisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalClients: 45,
    activeSessions: 12,
    totalRevenue: 125000,
    avgRating: 4.8,
    upcomingMeetings: 8,
    pendingMessages: 23
  };

  const recentClients = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', lastContact: '2 hours ago', status: 'Active', portfolioValue: 250000 },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', lastContact: '5 hours ago', status: 'Active', portfolioValue: 180000 },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', lastContact: '1 day ago', status: 'Active', portfolioValue: 320000 },
    { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', lastContact: '2 days ago', status: 'Inactive', portfolioValue: 95000 }
  ];

  const upcomingMeetings = [
    { id: 1, client: 'Rajesh Kumar', type: '1-on-1', date: '2024-11-20', time: '10:00 AM', duration: '60 mins' },
    { id: 2, client: 'Group Session', type: 'Group', date: '2024-11-22', time: '3:00 PM', duration: '90 mins', participants: 8 },
    { id: 3, client: 'Priya Sharma', type: '1-on-1', date: '2024-11-21', time: '2:00 PM', duration: '60 mins' }
  ];

  const recentMessages = [
    { id: 1, from: 'Rajesh Kumar', message: 'Need advice on tax planning for FY 2024-25', time: '2 hours ago', unread: true },
    { id: 2, from: 'Priya Sharma', message: 'Thank you for the investment recommendations!', time: '5 hours ago', unread: true },
    { id: 3, from: 'Amit Patel', message: 'Can we schedule a meeting to discuss portfolio rebalancing?', time: '1 day ago', unread: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Icon name="UserCheck" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advisor Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage clients and provide financial guidance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all">
                <Icon name="Plus" size={18} className="inline mr-2" />
                New Client
              </button>
              <a
                href="/user-login"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Switch to User View
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Users" size={24} className="text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Clients</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalClients}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Video" size={24} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active Sessions</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeSessions}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" size={24} className="text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Star" size={24} className="text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Avg Rating</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgRating}★</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-xl mb-6">
          <div className="border-b-2 border-gray-100 dark:border-gray-700">
            <div className="flex gap-2 p-4">
              {[
                { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
                { id: 'clients', label: 'Clients', icon: 'Users' },
                { id: 'meetings', label: 'Meetings', icon: 'Video' },
                { id: 'messages', label: 'Messages', icon: 'MessageCircle' },
                { id: 'analytics', label: 'Analytics', icon: 'BarChart' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Clients */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Clients</h3>
                  <div className="space-y-3">
                    {recentClients.slice(0, 4).map(client => (
                      <div key={client.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{client.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            client.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Last contact: {client.lastContact}</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">Portfolio: ₹{client.portfolioValue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Meetings */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Meetings</h3>
                  <div className="space-y-3">
                    {upcomingMeetings.map(meeting => (
                      <div key={meeting.id} className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border-2 border-violet-200 dark:border-violet-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{meeting.client}</h4>
                          <span className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full font-semibold">
                            {meeting.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {meeting.time}
                          </span>
                          {meeting.participants && (
                            <span className="flex items-center gap-1">
                              <Icon name="Users" size={14} />
                              {meeting.participants} participants
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Clients</h3>
                  <button className="px-4 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all">
                    <Icon name="Plus" size={16} className="inline mr-2" />
                    Add Client
                  </button>
                </div>
                <div className="space-y-3">
                  {recentClients.map(client => (
                    <div key={client.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{client.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{client.portfolioValue.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio Value</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meetings Tab */}
            {activeTab === 'meetings' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Scheduled Meetings</h3>
                <div className="space-y-4">
                  {upcomingMeetings.map(meeting => (
                    <div key={meeting.id} className="p-5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border-2 border-violet-200 dark:border-violet-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{meeting.client}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Icon name="Calendar" size={16} />
                              {meeting.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={16} />
                              {meeting.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Timer" size={16} />
                              {meeting.duration}
                            </span>
                            {meeting.participants && (
                              <span className="flex items-center gap-1">
                                <Icon name="Users" size={16} />
                                {meeting.participants} participants
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all">
                          Join Meeting
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Client Messages</h3>
                <div className="space-y-3">
                  {recentMessages.map(msg => (
                    <div key={msg.id} className={`p-4 rounded-xl border-2 ${
                      msg.unread 
                        ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800' 
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{msg.from}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{msg.message}</p>
                        </div>
                        {msg.unread && (
                          <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</span>
                        <button className="text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border-2 border-violet-200 dark:border-violet-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Client Growth</h4>
                    <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">+12%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This month</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Revenue</h4>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total this month</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;

