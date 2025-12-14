import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NEWS_API_KEY = 'demo'; // Replace with your NewsAPI key for production
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=in&category=business&pageSize=8&apiKey=' + NEWS_API_KEY;

const MarketNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { label: 'All News', value: 'all' },
    { label: 'Markets', value: 'markets' },
    { label: 'Stocks', value: 'stocks' },
    { label: 'Economy', value: 'economy' }
  ];

  // Fetch news from NewsAPI
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = NEWS_API_URL;
      if (selectedCategory !== 'all') {
        url += `&q=${selectedCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) {
        setNewsData(data.articles.map((article, idx) => ({
          id: idx,
          title: article.title,
          summary: article.description,
          source: article.source.name,
          category: selectedCategory,
          sentiment: 'neutral',
          timestamp: article.publishedAt,
          image: article.urlToImage,
          imageAlt: article.title
        })));
      } else {
        setNewsData([]);
      }
    } catch (err) {
      setError('Failed to fetch news.');
      setNewsData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const newsTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - newsTime) / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Icon name="TrendingUp" size={14} className="text-success" />;
      case 'negative':
        return <Icon name="TrendingDown" size={14} className="text-error" />;
      default:
        return <Icon name="Minus" size={14} className="text-muted-foreground" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div>
      {/* Category Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 overflow-x-auto">
        {categories?.map((category) => (
          <button
            key={category?.value}
            onClick={() => setSelectedCategory(category?.value)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${
              selectedCategory === category?.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {category?.label}
          </button>
        ))}
        </div>
        <Button variant="outline" size="sm" iconName="ExternalLink" onClick={() => window.open('https://newsapi.org/', '_blank')}>
          View All
        </Button>
      </div>
      {/* News List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Icon name="Loader" size={32} className="animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-error py-8">{error}</div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {newsData?.map((news) => (
            <div key={news?.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer border border-gray-200 dark:border-gray-600">
              <div className="flex items-start space-x-3">
                {/* News Image */}
                <div className="w-16 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={news?.image}
                    alt={news?.imageAlt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                {/* News Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {news?.category?.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(news?.sentiment)}
                      <span className={`text-xs font-medium ${getSentimentColor(news?.sentiment)}`}>
                        {news?.sentiment?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {news?.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {news?.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{news?.source}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(news?.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Bookmark" className="h-6 w-6 p-0" />
                      <Button variant="ghost" size="sm" iconName="Share" className="h-6 w-6 p-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="outline" size="sm" iconName="ChevronDown" onClick={fetchNews}>
          Refresh News
        </Button>
      </div>
    </div>
  );
};

export default MarketNews;