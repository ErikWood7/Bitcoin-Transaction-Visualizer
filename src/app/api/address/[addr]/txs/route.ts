import { NextRequest, NextResponse } from 'next/server';
import { getBTCProvider } from '@/lib/btcProviders';
import { normalizeAddressTransaction } from '@/lib/btcProviders/normalize';
import type { Tx, Vin, Vout } from '@/lib/types/btc';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { validateAddress, validateStringInput } from '@/lib/validateInput';

// Rate limit: 30 requests per minute per IP
const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
};

const MAX_LIMIT = 100; // Maximum number of transactions to return

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ addr: string }> }
) {
  const { addr } = await params;
  const useMock = process.env.USE_MOCK_DATA === '1';
  const searchParams = request.nextUrl.searchParams;
  
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

  // Input validation - address
  const addressValidation = validateAddress(addr);
  if (!addressValidation.valid) {
    return NextResponse.json(
      { error: addressValidation.error || 'Invalid Bitcoin address' },
      { status: 400 }
    );
  }

  const sanitizedAddr = addressValidation.sanitized!;

  // Input validation - limit parameter
  const limitParam = searchParams.get('limit');
  let limit = 25; // Default
  
  if (limitParam) {
    const limitValidation = validateStringInput(limitParam, 10);
    if (!limitValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid limit parameter' },
        { status: 400 }
      );
    }
    
    const parsedLimit = parseInt(limitValidation.sanitized!, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT) {
      return NextResponse.json(
        { error: `Limit must be between 1 and ${MAX_LIMIT}` },
        { status: 400 }
      );
    }
    limit = parsedLimit;
  }

  try {
    // Mock mode - return empty array
    if (useMock) {
      return NextResponse.json([], {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      });
    }

    // Fetch from real API
    const provider = getBTCProvider();
    const providerTxs = await provider.getAddressTransactions(sanitizedAddr, limit);
    const normalizedTxs = providerTxs.map(normalizeAddressTransaction);

    return NextResponse.json(normalizedTxs, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });
  } catch (error) {
    console.error('Error fetching address transactions:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json([]);
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch address transactions' },
      { status: 500 }
    );
  }
}
