import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockTradingPanel = ({ stocks, walletBalance, onTrade }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market'); // market, limit, stop
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState('day'); // day, gtc, ioc, fok

  // Generate detailed price history for selected stock
  const generatePriceHistory = (stock) => {
    if (!stock) return [];
    const basePrice = parseFloat(stock.price) || 100;
    const history = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      history.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: basePrice * (1 + variation),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        high: basePrice * (1 + Math.abs(variation) + 0.02),
        low: basePrice * (1 - Math.abs(variation) - 0.02),
        open: basePrice * (1 + variation * 0.5),
        close: basePrice * (1 + variation)
      });
    }
    return history;
  };

  const priceHistory = selectedStock ? generatePriceHistory(selectedStock) : [];

  const calculateTradeDetails = () => {
    if (!selectedStock || !quantity || isNaN(quantity) || Number(quantity) <= 0) {
      return null;
    }

    const qty = Number(quantity);
    const currentPrice = parseFloat(selectedStock.price) || 0;
    const price = orderType === 'market' ? currentPrice : parseFloat(limitPrice || stopPrice) || currentPrice;
    const totalValue = qty * price;
    
    // 1. Brokerage: Delivery (CNC) = ₹0 (Zerodha/Upstox style), Intraday = ₹20 max
    // Assuming delivery trading for now (can be made configurable)
    const isDelivery = true; // Delivery trading
    const brokerage = isDelivery ? 0 : Math.min(20, totalValue * 0.001); // Intraday: max ₹20
    
    // 2. STT: Only on SELL side, 0.1% of sell value for delivery
    const stt = tradeType === 'sell' && isDelivery ? totalValue * 0.001 : 0; // 0.1% on delivery sell
    
    // 3. Exchange Transaction Charges: NSE equity delivery = 0.00345%
    const transactionCharges = totalValue * 0.0000345;
    
    // 4. SEBI Charges: Very tiny (₹10 per ₹10 crore turnover)
    const sebiCharges = Math.max(0.01, totalValue * 0.0000001); // Minimum ₹0.01
    
    // 5. GST: 18% on (Brokerage + Exchange Charges + SEBI Charges)
    const gst = (brokerage + transactionCharges + sebiCharges) * 0.18;
    
    // 6. Stamp Duty: Only on BUY side, 0.015% on delivery buys
    const stampDuty = tradeType === 'buy' && isDelivery ? totalValue * 0.00015 : 0; // 0.015% on buy
    
    // 7. DP Charges: Only on SELL side, ₹13.5-₹18 per sell day (flat)
    const dpCharges = tradeType === 'sell' && isDelivery ? 15.75 : 0; // Average of ₹13.5-₹18 = ₹15.75
    
    const totalCharges = brokerage + stt + stampDuty + transactionCharges + gst + sebiCharges + dpCharges;
    const netAmount = totalValue + (tradeType === 'buy' ? totalCharges : -totalCharges);

    return {
      quantity: qty,
      price,
      totalValue,
      brokerage,
      stt,
      stampDuty,
      transactionCharges,
      gst,
      sebiCharges,
      dpCharges,
      totalCharges,
      netAmount
    };
  };

  const tradeDetails = calculateTradeDetails();

  const handleTrade = () => {
    if (!tradeDetails) {
      return;
    }

    if (tradeType === 'buy' && tradeDetails.netAmount > walletBalance) {
      alert('Insufficient wallet balance');
      return;
    }

    if (onTrade) {
      onTrade({
        stock: selectedStock,
        type: tradeType,
        quantity: tradeDetails.quantity,
        price: tradeDetails.price,
        orderType,
        timeInForce,
        totalAmount: tradeDetails.netAmount
      });
    }

    // Reset form
    setQuantity('');
    setLimitPrice('');
    setStopPrice('');
    setSelectedStock(null);
  };

  const chartData = {
    labels: priceHistory.map(d => d.date),
    datasets: [
      {
        label: 'Price',
        data: priceHistory.map(d => d.price),
        borderColor: tradeType === 'buy' ? '#10B981' : '#EF4444',
        backgroundColor: tradeType === 'buy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false }
      },
      y: {
        display: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0);
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stock Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <Icon name="TrendingUp" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Stock Trading</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Buy and sell stocks with detailed analysis</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stock List */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Stock</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedStock?.symbol === stock.symbol
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white">{stock.symbol}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stock.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{stock.price}</span>
                      <span className={`text-xs font-semibold ${
                        parseFloat(stock.percent_change) > 0 ? 'text-emerald-600' : 
                        parseFloat(stock.percent_change) < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {parseFloat(stock.percent_change) > 0 ? '+' : ''}{stock.percent_change}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedStock && (
            <div className="space-y-6">
              {/* Price Chart */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedStock.symbol}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedStock.price}</p>
                    <p className={`text-sm font-semibold ${
                      parseFloat(selectedStock.percent_change) > 0 ? 'text-emerald-600' : 
                      parseFloat(selectedStock.percent_change) < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {parseFloat(selectedStock.change) > 0 ? '+' : ''}₹{selectedStock.change} ({selectedStock.percent_change}%)
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Trading Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Order Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Order Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTradeType('buy')}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                          tradeType === 'buy'
                            ? 'bg-emerald-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon name="ArrowUpCircle" size={18} className="inline mr-2" />
                        Buy
                      </button>
                      <button
                        onClick={() => setTradeType('sell')}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                          tradeType === 'sell'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon name="ArrowDownCircle" size={18} className="inline mr-2" />
                        Sell
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Order Type</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="market">Market Order</option>
                      <option value="limit">Limit Order</option>
                      <option value="stop">Stop Loss Order</option>
                    </select>
                  </div>

                  {orderType === 'limit' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Limit Price (₹)</label>
                      <input
                        type="number"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        placeholder={selectedStock.price}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}

                  {orderType === 'stop' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Stop Price (₹)</label>
                      <input
                        type="number"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                        placeholder={selectedStock.price}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      min="1"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time in Force</label>
                    <select
                      value={timeInForce}
                      onChange={(e) => setTimeInForce(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="day">Day Order (Valid till EOD)</option>
                      <option value="gtc">Good Till Cancelled</option>
                      <option value="ioc">Immediate or Cancel</option>
                      <option value="fok">Fill or Kill</option>
                    </select>
                  </div>
                </div>

                {/* Right Column - Trade Summary */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trade Summary</h3>
                    
                    {tradeDetails ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Quantity</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{tradeDetails.quantity} shares</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Price per Share</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{tradeDetails.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{tradeDetails.totalValue.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Brokerage</span>
                            <span className="text-gray-700 dark:text-gray-300">₹{tradeDetails.brokerage.toFixed(2)}</span>
                          </div>
                          {tradeDetails.stt > 0 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">STT</span>
                              <span className="text-gray-700 dark:text-gray-300">₹{tradeDetails.stt.toFixed(2)}</span>
                            </div>
                          )}
                          {tradeDetails.stampDuty > 0 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Stamp Duty</span>
                              <span className="text-gray-700 dark:text-gray-300">₹{tradeDetails.stampDuty.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Transaction Charges</span>
                            <span className="text-gray-700 dark:text-gray-300">₹{tradeDetails.transactionCharges.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">GST (18%)</span>
                            <span className="text-gray-700 dark:text-gray-300">₹{tradeDetails.gst.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">SEBI Charges</span>
                            <span className="text-gray-700 dark:text-gray-300">₹{tradeDetails.sebiCharges.toFixed(2)}</span>
                          </div>
                          {tradeDetails.dpCharges > 0 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">DP Charges</span>
                              <span className="text-gray-700 dark:text-gray-300">₹{tradeDetails.dpCharges.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Charges</span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">₹{tradeDetails.totalCharges.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {tradeType === 'buy' ? 'Total Amount' : 'Net Proceeds'}
                            </span>
                            <span className={`text-lg font-bold ${
                              tradeType === 'buy' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              ₹{tradeDetails.netAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {tradeType === 'buy' && walletBalance && tradeDetails.netAmount > walletBalance && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Insufficient balance. Available: ₹{walletBalance.toLocaleString('en-IN')}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enter quantity to see trade details</p>
                    )}
                  </div>

                  <button
                    onClick={handleTrade}
                    disabled={!tradeDetails || (tradeType === 'buy' && tradeDetails.netAmount > walletBalance)}
                    className={`w-full px-6 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${
                      tradeType === 'buy'
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockTradingPanel;

