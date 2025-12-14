
// This file defines the data models for the investment portfolio feature.

// Represents a user of the application
export const User = {
  id: String,
  name: String,
  email: String,
  profile: {
    age: String,
    riskTolerance: String,
    timeHorizon: String,
    investmentGoal: String,
    experience: String,
  },
};

// Represents a single asset in the user's portfolio
export const Asset = {
  id: String,
  symbol: String,
  name: String,
  shares: Number,
  currentPrice: Number,
  marketValue: Number,
  gainLoss: Number,
  changePercentage: Number,
  type: String, // "Stock", "Mutual Fund", "ETF", "Gold"
};

// Represents the user's investment portfolio
export const Portfolio = {
  id: String,
  userId: String,
  totalValue: Number,
  dailyChange: {
    amount: Number,
    percentage: Number,
  },
  overallReturn: {
    amount: Number,
    percentage: Number,
  },
  allocation: [
    {
      name: String,
      percentage: Number,
      color: String,
    },
  ],
  assets: [Asset],
};

// Represents the performance of the portfolio over time
export const Performance = {
  id: String,
  portfolioId: String,
  data: {
    '1D': [{ date: String, portfolio: Number, benchmark: Number }],
    '1W': [{ date: String, portfolio: Number, benchmark: Number }],
    '1M': [{ date: String, portfolio: Number, benchmark: Number }],
    '3M': [{ date: String, portfolio: Number, benchmark: Number }],
    '6M': [{ date: String, portfolio: Number, benchmark: Number }],
    '1Y': [{ date: String, portfolio: Number, benchmark: Number }],
    'ALL': [{ date: String, portfolio: Number, benchmark: Number }],
  },
};

// Represents a single news article
export const News = {
  id: String,
  title: String,
  summary: String,
  source: String,
  category: String,
  sentiment: String,
  timestamp: Date,
  image: String,
  imageAlt: String,
};

// Represents a stock in the user's watchlist
export const WatchlistItem = {
  id: String,
  symbol: String,
  name: String,
  currentPrice: Number,
  changeAmount: Number,
  changePercentage: Number,
  hasAlert: Boolean,
  priceTarget: Number,
  alertPrice: Number,
};

// Represents the user's watchlist
export const Watchlist = {
  id: String,
  userId: String,
  items: [WatchlistItem],
};

// Represents a recommendation from the AI Portfolio Coach
export const Recommendation = {
  id: String,
  type: String, // "increase_exposure", "diversify", "rebalance"
  title: String,
  description: String,
  priority: String, // "high", "medium", "low"
  status: String, // "pending", "applied"
  allocation: {
    current: Number,
    recommended: Number,
  },
  expectedImpact: {
    returnIncrease: Number,
    riskChange: String,
  },
  lastUpdated: String,
};
