import { NextRequest, NextResponse } from 'next/server';
import { getBTCPrice } from '@/lib/btcPrice';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

// Rate limit: 60 requests per minute per IP (more lenient for price data)
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
    const price = await getBTCPrice();
    
    if (price === null) {
      return NextResponse.json(
        { error: 'Price unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({ price }, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
