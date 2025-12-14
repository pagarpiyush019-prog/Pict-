import React from 'react';
import { Line } from 'react-chartjs-2';
import Icon from '../../../components/AppIcon';

const StockGraph = ({ stockHistory, symbol }) => {
  if (!stockHistory || stockHistory.length === 0) {
    return <div className="text-center text-gray-500">No data available for {symbol}.</div>;
  }
  const data = {
    labels: stockHistory.map(d => d.date),
    datasets: [
      {
        label: `${symbol} Price`,
        data: stockHistory.map(d => d.price),
        fill: false,
        borderColor: '#6366f1',
        backgroundColor: '#6366f1',
        tension: 0.2,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { display: true, title: { display: false } },
      y: { display: true, title: { display: false } },
    },
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow">
      <Line data={data} options={options} />
    </div>
  );
};

export default StockGraph;
