'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to fetch and use Bitcoin price in USD
 * Fetches from our API route which uses CoinGecko
 */
export function useBTCPrice(): number | null {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch('/api/btc-price');
        if (response.ok) {
          const data = await response.json();
          if (data.price && typeof data.price === 'number') {
            setPrice(data.price);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch BTC price:', error);
      }
    }

    fetchPrice();
    // Refresh price every minute
    const interval = setInterval(fetchPrice, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return price;
}
