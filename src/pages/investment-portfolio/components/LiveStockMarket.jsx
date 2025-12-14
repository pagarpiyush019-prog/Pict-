import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

// You can replace this with a real API endpoint or use a free public stock API
const STOCK_API_URL = 'https://api.twelvedata.com/quote?symbol=AAPL,MSFT,GOOGL,TSLA,AMZN,NFLX,INFY,RELIANCE,BANKBARODA,BANKINDIA&apikey=demo';

const exampleStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'INFY', name: 'Infosys Ltd.' },
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda' },
  { symbol: 'BANKINDIA', name: 'Bank of India' },
];

const mockHistory = [
  { date: '09:30', price: 100 },
  { date: '10:00', price: 102 },
  { date: '10:30', price: 101 },
  { date: '11:00', price: 104 },
  { date: '11:30', price: 103 },
  { date: '12:00', price: 105 },
];

const LiveStockMarket = ({ renderGraph, enableBuySell, walletBalance }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [tradeMessage, setTradeMessage] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(STOCK_API_URL);
        let data;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
        // If API returns 'PRO FEATURE ONLY' or fails, use mock data
        if (!data || data.status === 200 && data.response === 'PRO FEATURE ONLY') {
          setStocks(exampleStocks.map(stock => ({
            ...stock,
            price: (100 + Math.random() * 100).toFixed(2),
            change: (Math.random() * 4 - 2).toFixed(2),
            percent_change: (Math.random() * 4 - 2).toFixed(2),
            exchange: 'NSE',
            currency: 'INR',
            history: mockHistory,
          })));
        } else {
          const stocksArr = exampleStocks.map(stock => {
            const d = data[stock.symbol];
            return d && d.symbol ? {
              symbol: d.symbol,
              name: stock.name,
              price: d.price,
              change: d.change,
              percent_change: d.percent_change,
              exchange: d.exchange,
              currency: d.currency,
              history: mockHistory, // Replace with real history if available
            } : { ...stock, price: '-', change: '-', percent_change: '-', exchange: '-', currency: '-', history: [] };
          });
          setStocks(stocksArr);
        }
      } catch (err) {
        // On fetch error, use mock data
        setStocks(exampleStocks.map(stock => ({
          ...stock,
          price: (100 + Math.random() * 100).toFixed(2),
          change: (Math.random() * 4 - 2).toFixed(2),
          percent_change: (Math.random() * 4 - 2).toFixed(2),
          exchange: 'NSE',
          currency: 'INR',
          history: mockHistory,
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = () => {
    if (!selectedStock || !tradeAmount || isNaN(tradeAmount) || Number(tradeAmount) <= 0) {
      setTradeMessage('Enter a valid amount.');
      return;
    }
    if (tradeType === 'buy' && walletBalance && Number(tradeAmount) * Number(selectedStock.price) > walletBalance) {
      setTradeMessage('Insufficient wallet balance.');
      return;
    }
    setTradeMessage(`Order placed: ${tradeType.toUpperCase()} ${tradeAmount} of ${selectedStock.symbol}`);
    setTimeout(() => setTradeMessage(''), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 shadow-xl overflow-hidden">
      <div className="px-6 py-5 border-b-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
          <Icon name="BarChart" size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Stock Market</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Major US & India stocks</p>
        </div>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="text-center text-gray-500">Loading live stock data...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700 dark:text-gray-200">
                  <th className="py-2 px-3">Symbol</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3">Change</th>
                  <th className="py-2 px-3">% Change</th>
                  <th className="py-2 px-3">Exchange</th>
                  {enableBuySell && <th className="py-2 px-3">Trade</th>}
                  {renderGraph && <th className="py-2 px-3">Graph</th>}
                </tr>
              </thead>
              <tbody>
                {stocks.map(stock => (
                  <tr key={stock.symbol} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 px-3 font-bold">{stock.symbol}</td>
                    <td className="py-2 px-3">{stock.name}</td>
                    <td className="py-2 px-3">{stock.price}</td>
                    <td className={`py-2 px-3 font-semibold ${parseFloat(stock.change) > 0 ? 'text-green-600' : parseFloat(stock.change) < 0 ? 'text-red-600' : 'text-gray-700'}`}>{stock.change}</td>
                    <td className={`py-2 px-3 font-semibold ${parseFloat(stock.percent_change) > 0 ? 'text-green-600' : parseFloat(stock.percent_change) < 0 ? 'text-red-600' : 'text-gray-700'}`}>{stock.percent_change}</td>
                    <td className="py-2 px-3">{stock.exchange}</td>
                    {enableBuySell && (
                      <td className="py-2 px-3">
                        <button
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded mr-2"
                          onClick={() => { setSelectedStock(stock); setTradeType('buy'); }}
                        >Buy</button>
                        <button
                          className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
                          onClick={() => { setSelectedStock(stock); setTradeType('sell'); }}
                        >Sell</button>
                      </td>
                    )}
                    {renderGraph && (
                      <td className="py-2 px-3 min-w-[180px]">
                        {renderGraph(stock.symbol, stock.history)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {enableBuySell && selectedStock && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={tradeType === 'buy' ? 'ArrowUpCircle' : 'ArrowDownCircle'} size={18} className={tradeType === 'buy' ? 'text-green-600' : 'text-red-600'} />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol}</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    min="1"
                    className="border rounded px-2 py-1 w-24"
                    placeholder="Amount"
                    value={tradeAmount}
                    onChange={e => setTradeAmount(e.target.value)}
                  />
                  <button
                    className={`px-4 py-1 rounded text-white ${tradeType === 'buy' ? 'bg-green-600' : 'bg-red-600'}`}
                    onClick={handleTrade}
                  >{tradeType === 'buy' ? 'Buy' : 'Sell'}</button>
                </div>
                {tradeMessage && <div className="text-xs text-blue-600 mt-1">{tradeMessage}</div>}
                <button className="text-xs text-gray-400 mt-2 underline" onClick={() => setSelectedStock(null)}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStockMarket;
