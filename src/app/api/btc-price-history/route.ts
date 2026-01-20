import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

// Fetch 24 hours of price data
// Note: CoinGecko free tier doesn't require API keys, but has rate limits
// For production with higher volume, consider using CoinGecko Pro API with API key
// Using 1 day gives us data points for a smooth chart
// Note: Free tier may not support 'interval' parameter, so we'll sample the data ourselves
const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1';

interface PriceHistoryCache {
  history: Array<{ time: number; price: number }>;
  timestamp: number;
}

let cachedHistory: PriceHistoryCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limit: 60 requests per minute per IP
const RATE_LIMIT = {
  maxRequests: 60,
  windowMs: 60 * 1000, // 1 minute
};

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(clientIP, RATE_LIMIT);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
        }
      }
    );
  }
  try {
    const now = Date.now();
    
    // Return cached history if still valid
    if (cachedHistory && (now - cachedHistory.timestamp) < CACHE_DURATION) {
      return NextResponse.json({ history: cachedHistory.history });
    }

    const response = await fetch(COINGECKO_API, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('CoinGecko API error:', response.status, response.statusText);
      // Return stale cache if available
      if (cachedHistory) {
        console.log('Returning cached price history');
        return NextResponse.json({ history: cachedHistory.history });
      }
      // If no cache, try to generate a simple mock chart based on current price
      // This prevents the 503 from breaking the UI
      const currentPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(r => r.ok ? r.json() : null)
        .catch(() => null);
      
      if (currentPrice?.bitcoin?.usd) {
        // Generate a simple flat/slightly varied chart
        const price = currentPrice.bitcoin.usd;
        const mockHistory = Array.from({ length: 24 }, (_, i) => ({
          time: Date.now() - (24 - i) * 60 * 60 * 1000,
          price: price + (Math.random() - 0.5) * price * 0.02, // ±1% variation
        }));
        return NextResponse.json({ history: mockHistory });
      }
      
      return NextResponse.json(
        { error: 'Price history unavailable' },
        { status: 503 }
      );
    }

    const data = await response.json();
    
    // CoinGecko returns prices array: [[timestamp_ms, price], ...]
    if (data.prices && Array.isArray(data.prices) && data.prices.length > 0) {
      const history = data.prices.map(([timestamp, price]: [number, number]) => ({
        time: timestamp,
        price: price as number,
      }));

      // Return full history for chart display
      // CoinGecko returns data points (could be many), sample down to ~24 points for smooth chart
      const maxPoints = 24; // 24 data points for 24 hours
      let sampledHistory = history;
      
      if (history.length > maxPoints) {
        // Sample evenly across the data
        const step = Math.floor(history.length / maxPoints);
        sampledHistory = history.filter((_, index) => index % step === 0 || index === history.length - 1);
        // Ensure we have exactly maxPoints or close to it
        if (sampledHistory.length > maxPoints) {
          sampledHistory = sampledHistory.slice(0, maxPoints);
        }
      }

      cachedHistory = {
        history: sampledHistory,
        timestamp: now,
      };

      return NextResponse.json({ history: sampledHistory }, {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      });
    }

    // Return stale cache if available
    if (cachedHistory) {
      return NextResponse.json({ history: cachedHistory.history }, {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid price history data' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error fetching BTC price history:', error);
    
    // Return stale cache if available
    if (cachedHistory) {
      return NextResponse.json({ history: cachedHistory.history }, {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}
