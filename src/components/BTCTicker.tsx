'use client';

import { useState, useEffect } from 'react';
import { useBTCPrice } from '@/lib/useBTCPrice';

interface PricePoint {
  time: number;
  price: number;
}

export function BTCTicker() {
  const currentPrice = useBTCPrice();
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);

  // Fetch price history for chart
  useEffect(() => {
    async function fetchPriceHistory() {
      try {
        const response = await fetch('/api/btc-price-history');
        if (response.ok) {
          const data = await response.json();
          if (data.history && Array.isArray(data.history) && data.history.length > 0) {
            setPriceHistory(data.history);
          } else {
            console.warn('Price history data is empty or invalid');
          }
        } else {
          console.warn('Failed to fetch price history:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching price history:', error);
      }
    }

    fetchPriceHistory();
    // Refresh every minute
    const interval = setInterval(fetchPriceHistory, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Render price chart
  const renderPriceChart = () => {
    if (priceHistory.length < 2) {
      // Show a simple placeholder or flat line if no data
      return (
        <svg width={80} height={32} className="overflow-visible">
          <line
            x1={2}
            y1={16}
            x2={78}
            y2={16}
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    const width = 80;
    const height = 32;
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find min and max prices for scaling
    const prices = priceHistory.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Generate path points
    const points = priceHistory.map((point, index) => {
      const x = padding + (index / (priceHistory.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
      return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    // Determine color based on trend (first vs last price)
    const firstPrice = priceHistory[0].price;
    const lastPrice = priceHistory[priceHistory.length - 1].price;
    const isUp = lastPrice >= firstPrice;
    const lineColor = isUp ? '#10b981' : '#ef4444';

    // Use unique ID to avoid conflicts if multiple tickers exist
    const gradientId = `tickerGradient-${Date.now()}`;

    return (
      <svg width={width} height={height} className="overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path
          d={`${pathData} L ${padding + chartWidth},${height - padding} L ${padding},${height - padding} Z`}
          fill={`url(#${gradientId})`}
        />
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={lineColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  if (currentPrice === null) {
    return null; // Don't show ticker if price unavailable
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
      <span className="text-base font-bold text-orange-600">₿</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
        <div className="flex items-center">
          {renderPriceChart()}
        </div>
      </div>
    </div>
  );
}
