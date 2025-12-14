import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const ChatBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! 👋 I\'m your FinanceTracker AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [useAI, setUseAI] = useState(false); // AI is OFF by default for speed
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { label: 'Check my balance', icon: 'Wallet' },
    { label: 'Recent transactions', icon: 'Receipt' },
    { label: 'Scan receipt', icon: 'ScanLine', action: 'scan' },
    { label: 'Budget tips', icon: 'Lightbulb' },
    { label: 'Investment advice', icon: 'TrendingUp' }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // If AI is disabled, use fast rule-based response with sentiment
    if (!useAI) {
      setTimeout(() => {
        const responseData = getBotResponse(currentInput);
        const botResponse = {
          id: Date.now(),
          type: 'bot',
          text: responseData.text || responseData,
          sentiment: responseData.sentiment,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 500);
      return;
    }

    // Add typing indicator for AI mode
    const typingMessage = {
      id: messages.length + 2,
      type: 'bot',
      text: 'AI is thinking... (this may take 10-20 seconds)',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Call AI backend
      console.log('🤖 Calling AI backend with message:', currentInput);
      console.log('🌐 Fetching from: http://localhost:5000/chat');
      
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          context: {
            income: 60000,
            balance: 125420,
            budgets: [
              { category: 'Food', limit: 10000, spent: 8500 },
              { category: 'Transport', limit: 4000, spent: 3200 },
              { category: 'Entertainment', limit: 3000, spent: 2800 }
            ],
            recent_transactions: [
              { amount: 450, merchant: 'Swiggy', category: 'Food' },
              { amount: 1200, merchant: 'Amazon', category: 'Shopping' },
              { amount: 500, merchant: 'Netflix', category: 'Entertainment' }
            ]
          }
        })
      });

      console.log('📡 Response received, status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error:', errorText);
        throw new Error(`AI service returned status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ AI Response:', data);
      
      // Log sentiment data if available
      if (data.sentiment) {
        console.log('🎭 Sentiment detected:', data.sentiment.detected, data.sentiment.emoji);
        console.log('   Emotions:', data.sentiment.emotions);
      }
      
      // Remove typing indicator and add actual response with sentiment
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, {
          id: Date.now(),
          type: 'bot',
          text: data.response || 'Sorry, I received an empty response.',
          sentiment: data.sentiment,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('❌ Error calling AI:', error.name, error.message);
      console.error('Error details:', error);
      console.log('🔄 Falling back to rule-based response');
      
      // Remove typing indicator and add fallback response with sentiment
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        const responseData = getBotResponse(currentInput);
        return [...filtered, {
          id: Date.now(),
          type: 'bot',
          text: responseData.text || responseData,
          sentiment: responseData.sentiment,
          timestamp: new Date()
        }];
      });
    }
  };

  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Detect sentiment from input
    let sentimentEmoji = '😊';
    let sentimentType = 'neutral';
    let emotions = [];
    
    // Negative keywords
    if (lowerInput.match(/worried|stress|anxious|concern|scared|panic|overwhelm/)) {
      sentimentEmoji = '😟';
      sentimentType = 'negative';
      emotions.push('stressed');
    }
    if (lowerInput.match(/frustrated|annoyed|angry|upset|hate|can't/)) {
      sentimentEmoji = '😟';
      sentimentType = 'negative';
      emotions.push('frustrated');
    }
    if (lowerInput.match(/confused|don't understand|unclear|lost/)) {
      sentimentEmoji = '😐';
      sentimentType = 'neutral';
      emotions.push('confused');
    }
    
    // Positive keywords
    if (lowerInput.match(/thank|appreciate|grateful|excited|great|awesome|love/)) {
      sentimentEmoji = '😊';
      sentimentType = 'positive';
      emotions.push('grateful');
    }
    
    // Empathetic prefix based on sentiment
    let empathyPrefix = '';
    if (emotions.includes('stressed')) {
      empathyPrefix = "I understand this is stressful. Let's work through this together. ";
    } else if (emotions.includes('frustrated')) {
      empathyPrefix = "I can sense your frustration. Let me help you find a solution. ";
    } else if (emotions.includes('confused')) {
      empathyPrefix = "Let me clarify this for you in a simple way. ";
    } else if (emotions.includes('grateful')) {
      empathyPrefix = "You're welcome! I'm happy to help. ";
    }
    
    // Generate response based on keywords
    let response = '';
    if (lowerInput.includes('balance') || lowerInput.includes('money')) {
      response = 'Your current total balance across all accounts is ₹1,25,420. Your savings account has ₹85,000 and your investment portfolio is worth ₹40,420.';
    } else if (lowerInput.includes('transaction') || lowerInput.includes('spent')) {
      response = 'Your last 3 transactions: ₹450 at Swiggy (Food), ₹1,200 at Amazon (Shopping), and ₹500 for Netflix subscription. Would you like to see more?';
    } else if (lowerInput.includes('scan') || lowerInput.includes('receipt')) {
      response = 'You can scan receipts using our AI-powered scanner! Go to Transactions page and click the "AI Scan" button.';
    } else if (lowerInput.includes('budget') || lowerInput.includes('save')) {
      response = 'Based on your spending patterns, I suggest setting aside 20% of your income for savings. You\'ve been spending more on food delivery lately - consider cooking at home to save ₹3,000/month!';
    } else if (lowerInput.includes('invest') || lowerInput.includes('stock') || lowerInput.includes('mutual fund')) {
      response = 'Your portfolio is up 17% this year! For steady growth, I recommend continuing your SIP in index funds. Consider increasing your monthly SIP by ₹500 to accelerate wealth building.';
    } else if (lowerInput.includes('debt') || lowerInput.includes('loan')) {
      response = 'Let\'s create a debt payoff plan. Start by paying off high-interest debts first. Consider the avalanche method: pay minimum on all debts, then put extra money toward the highest interest rate debt.';
    } else if (lowerInput.includes('help')) {
      response = 'I can help you with: checking balances, viewing transactions, scanning receipts, budget tips, investment advice, bill reminders, and financial goal tracking. What would you like to know?';
    } else {
      response = 'I understand you\'re asking about "' + input + '". Could you please provide more details or choose from the quick actions below?';
    }
    
    // Add sentiment data to response
    return {
      text: empathyPrefix + response,
      sentiment: {
        detected: sentimentType,
        emoji: sentimentEmoji,
        emotions: emotions
      }
    };
  };

  const handleQuickAction = async (action) => {
    // Handle scan receipt action - navigate to transactions page
    if (action.action === 'scan') {
      window.location.href = '/transaction-management?openScanner=true';
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: action.label,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add typing indicator
    const typingMessage = {
      id: messages.length + 2,
      type: 'bot',
      text: 'Typing...',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Call AI backend
      console.log('🤖 Calling AI backend (quick action):', action.label);
      
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: action.label,
          context: {
            income: 60000,
            balance: 125420,
            budgets: [
              { category: 'Food', limit: 10000, spent: 8500 },
              { category: 'Transport', limit: 4000, spent: 3200 },
              { category: 'Entertainment', limit: 3000, spent: 2800 }
            ],
            recent_transactions: [
              { amount: 450, merchant: 'Swiggy', category: 'Food' },
              { amount: 1200, merchant: 'Amazon', category: 'Shopping' },
              { amount: 500, merchant: 'Netflix', category: 'Entertainment' }
            ]
          }
        })
      });

      console.log('📡 Response received, status:', response.status);

      if (!response.ok) {
        throw new Error(`AI service returned status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ AI Response received');
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, {
          id: Date.now(),
          type: 'bot',
          text: data.response || 'Sorry, I received an empty response.',
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('❌ Error calling AI:', error.name, error.message);
      console.log('🔄 Falling back to rule-based response');
      
      // Remove typing indicator and add fallback response
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, {
          id: Date.now(),
          type: 'bot',
          text: getBotResponse(action.label),
          timestamp: new Date()
        }];
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 w-[340px] md:w-[380px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="Bot" size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">FinanceTracker AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 ${useAI ? 'bg-emerald-400' : 'bg-yellow-400'} rounded-full animate-pulse`}></span>
                  <span className="text-white/80 text-xs">{useAI ? 'AI Mode' : 'Fast Mode'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseAI(!useAI)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  useAI 
                    ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                title={useAI ? 'Switch to Fast Mode' : 'Switch to AI Mode (slower)'}
              >
                {useAI ? '🤖 AI' : '⚡ Fast'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Icon name="X" size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  } ${message.isTyping ? 'animate-pulse' : ''}`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {!message.isTyping && (
                    <>
                      {message.sentiment && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                          <span className="text-xs text-muted-foreground">
                            Detected: {message.sentiment.emoji} {message.sentiment.detected}
                          </span>
                          {message.sentiment.emotions && message.sentiment.emotions.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              • {message.sentiment.emotions.join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                      <p className={`text-[10px] mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-border bg-card">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-primary/10 text-foreground text-xs font-medium rounded-full whitespace-nowrap transition-colors border border-border hover:border-primary/30"
                >
                  <Icon name={action.icon} size={12} className="text-primary" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              >
                <Icon name="Send" size={18} className={inputValue.trim() ? 'text-white' : 'text-muted-foreground'} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 md:right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-muted hover:bg-muted/80 rotate-0' 
            : 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl hover:scale-110'
        }`}
      >
        {isOpen ? (
          <Icon name="X" size={24} className="text-foreground" />
        ) : (
          <>
            <Icon name="MessageCircle" size={26} className="text-white" />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">1</span>
            </span>
          </>
        )}
      </button>
    </>
  );
};

export default ChatBotButton;
