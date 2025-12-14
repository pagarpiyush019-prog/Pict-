import React, { useState } from 'react';
import Icon from '../../components/AppIcon';

const Advisor = () => {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [activeTab, setActiveTab] = useState('advisors'); // 'advisors', 'messages', 'meetings', 'groups'

  // Mock expert advisors data
  const expertAdvisors = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      title: 'Certified Financial Planner',
      experience: '15+ years',
      rating: 4.9,
      reviews: 234,
      specialties: ['Retirement Planning', 'Tax Optimization', 'Portfolio Management'],
      availability: 'Available Now',
      avatar: 'RK',
      price: '₹2,500/hr',
      languages: ['English', 'Hindi'],
      responseTime: 'Usually responds in 2 hours',
      verified: true
    },
    {
      id: 2,
      name: 'Priya Sharma',
      title: 'Investment Advisor',
      experience: '12+ years',
      rating: 4.8,
      reviews: 189,
      specialties: ['Stock Market', 'Mutual Funds', 'SIP Planning'],
      availability: 'Available Today',
      avatar: 'PS',
      price: '₹2,000/hr',
      languages: ['English', 'Hindi', 'Marathi'],
      responseTime: 'Usually responds in 1 hour',
      verified: true
    },
    {
      id: 3,
      name: 'Amit Patel',
      title: 'Wealth Management Expert',
      experience: '18+ years',
      rating: 4.95,
      reviews: 312,
      specialties: ['High Net Worth', 'Estate Planning', 'Risk Management'],
      availability: 'Available Tomorrow',
      avatar: 'AP',
      price: '₹3,500/hr',
      languages: ['English', 'Hindi', 'Gujarati'],
      responseTime: 'Usually responds in 3 hours',
      verified: true
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      title: 'Personal Finance Coach',
      experience: '8+ years',
      rating: 4.7,
      reviews: 156,
      specialties: ['Budgeting', 'Debt Management', 'Savings Strategies'],
      availability: 'Available Now',
      avatar: 'SR',
      price: '₹1,800/hr',
      languages: ['English', 'Hindi', 'Telugu'],
      responseTime: 'Usually responds in 30 mins',
      verified: true
    },
    {
      id: 5,
      name: 'Vikram Singh',
      title: 'SEBI Registered Advisor',
      experience: '10+ years',
      rating: 4.85,
      reviews: 278,
      specialties: ['Compliance', 'Regulatory', 'Investment Advisory'],
      availability: 'Available Today',
      avatar: 'VS',
      price: '₹2,200/hr',
      languages: ['English', 'Hindi'],
      responseTime: 'Usually responds in 2 hours',
      verified: true
    },
    {
      id: 6,
      name: 'Anjali Mehta',
      title: 'Retirement Planning Specialist',
      experience: '14+ years',
      rating: 4.9,
      reviews: 201,
      specialties: ['Retirement Planning', 'Pension Plans', 'Long-term Investing'],
      availability: 'Available Tomorrow',
      avatar: 'AM',
      price: '₹2,800/hr',
      languages: ['English', 'Hindi', 'Marathi'],
      responseTime: 'Usually responds in 4 hours',
      verified: true
    }
  ];

  const [messages, setMessages] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([
    {
      id: 1,
      advisor: 'Rajesh Kumar',
      type: '1-on-1',
      date: '2024-11-20',
      time: '10:00 AM',
      duration: '60 mins',
      status: 'Confirmed'
    },
    {
      id: 2,
      advisor: 'Priya Sharma',
      type: 'Group Session',
      date: '2024-11-22',
      time: '3:00 PM',
      duration: '90 mins',
      status: 'Scheduled',
      participants: 8
    }
  ]);

  const [groupSessions, setGroupSessions] = useState([
    {
      id: 1,
      title: 'Investment Basics for Beginners',
      advisor: 'Priya Sharma',
      date: '2024-11-22',
      time: '3:00 PM',
      duration: '90 mins',
      participants: 8,
      maxParticipants: 15,
      price: '₹500',
      topic: 'Stock Market Fundamentals'
    },
    {
      id: 2,
      title: 'Tax Planning Strategies 2024',
      advisor: 'Rajesh Kumar',
      date: '2024-11-25',
      time: '11:00 AM',
      duration: '60 mins',
      participants: 12,
      maxParticipants: 20,
      price: '₹400',
      topic: 'Tax Optimization'
    },
    {
      id: 3,
      title: 'Retirement Planning Workshop',
      advisor: 'Anjali Mehta',
      date: '2024-11-28',
      time: '2:00 PM',
      duration: '120 mins',
      participants: 5,
      maxParticipants: 12,
      price: '₹600',
      topic: 'Retirement Planning'
    }
  ]);

  const handleMessageAdvisor = (advisor) => {
    setSelectedAdvisor(advisor);
    setActiveTab('messages');
  };

  const handleBookMeeting = (advisor) => {
    setSelectedAdvisor(advisor);
    setActiveTab('meetings');
  };

  const handleJoinGroup = (session) => {
    alert(`Joining group session: ${session.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-6 border-2 border-purple-100 dark:border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <Icon name="Users" size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expert Finance Advisors</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Connect with certified financial experts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-bold uppercase tracking-wider shadow-md">
            Verified Experts
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {[
              { id: 'advisors', label: 'Advisors', icon: 'Users' },
              { id: 'messages', label: 'Messages', icon: 'MessageCircle' },
              { id: 'meetings', label: 'Meetings', icon: 'Video' },
              { id: 'groups', label: 'Group Sessions', icon: 'Users' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
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
          {/* Advisors Tab */}
          {activeTab === 'advisors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertAdvisors.map(advisor => (
                <div
                  key={advisor.id}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {advisor.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{advisor.name}</h3>
                          {advisor.verified && (
                            <Icon name="CheckCircle" size={18} className="text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{advisor.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-amber-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{advisor.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({advisor.reviews} reviews)</span>
                    <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold">
                      {advisor.availability}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {advisor.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Experience:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{advisor.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Rate:</span>
                      <span className="font-bold text-violet-600 dark:text-violet-400">{advisor.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Response Time:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{advisor.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMessageAdvisor(advisor)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Icon name="MessageCircle" size={16} />
                      Message
                    </button>
                    <button
                      onClick={() => handleBookMeeting(advisor)}
                      className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-violet-600 text-violet-600 dark:text-violet-400 rounded-xl font-semibold text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Icon name="Video" size={16} />
                      Book Meeting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {selectedAdvisor ? (
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {selectedAdvisor.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{selectedAdvisor.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAdvisor.title}</p>
                    </div>
                    <button
                      onClick={() => setSelectedAdvisor(null)}
                      className="ml-auto text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Icon name="X" size={20} />
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="MessageCircle" size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">Start a conversation with {selectedAdvisor.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white"
                    />
                    <button className="px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all">
                      <Icon name="Send" size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="MessageCircle" size={64} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No active conversations</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Select an advisor to start messaging</p>
                </div>
              )}
            </div>
          )}

          {/* Meetings Tab */}
          {activeTab === 'meetings' && (
            <div className="space-y-4">
              {selectedAdvisor ? (
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {selectedAdvisor.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Book Meeting with {selectedAdvisor.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAdvisor.title}</p>
                    </div>
                    <button
                      onClick={() => setSelectedAdvisor(null)}
                      className="ml-auto text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Icon name="X" size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Select Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Select Time</label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Duration</label>
                        <select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white">
                          <option>30 minutes</option>
                          <option>60 minutes</option>
                          <option>90 minutes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Meeting Type</label>
                        <select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white">
                          <option>Video Call</option>
                          <option>Audio Call</option>
                          <option>In-Person</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Meeting Purpose</label>
                      <textarea
                        rows={6}
                        placeholder="Describe what you'd like to discuss..."
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white"
                      />
                      <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Rate:</span>
                          <span className="font-bold text-violet-600 dark:text-violet-400">{selectedAdvisor.price}</span>
                        </div>
                        <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all">
                          Book Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Meetings</h3>
                  {upcomingMeetings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingMeetings.map(meeting => (
                        <div
                          key={meeting.id}
                          className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-violet-200 dark:border-violet-800"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{meeting.advisor}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{meeting.type} • {meeting.date} at {meeting.time}</p>
                              {meeting.participants && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{meeting.participants} participants</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                meeting.status === 'Confirmed' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {meeting.status}
                              </span>
                              <button className="mt-2 text-sm text-violet-600 dark:text-violet-400 hover:underline">
                                Join Meeting
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Video" size={64} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No upcoming meetings</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Group Sessions Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Available Group Sessions</h3>
              {groupSessions.map(session => (
                <div
                  key={session.id}
                  className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{session.title}</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{session.advisor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{session.date} at {session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{session.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{session.price}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full font-semibold">
                      {session.topic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {session.participants}/{session.maxParticipants} participants
                      </span>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-purple-600"
                          style={{ width: `${(session.participants / session.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinGroup(session)}
                      className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all"
                    >
                      Join Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advisor;
