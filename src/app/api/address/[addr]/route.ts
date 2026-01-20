import { NextRequest, NextResponse } from 'next/server';
import { getBTCProvider } from '@/lib/btcProviders';
import { normalizeAddress } from '@/lib/btcProviders/normalize';
import type { AddressSummary } from '@/lib/types/btc';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { validateAddress } from '@/lib/validateInput';

// Rate limit: 30 requests per minute per IP
const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ addr: string }> }
) {
  const { addr } = await params;
  const useMock = process.env.USE_MOCK_DATA === '1';

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

  // Input validation
  const validation = validateAddress(addr);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || 'Invalid Bitcoin address' },
      { status: 400 }
    );
  }

  const sanitizedAddr = validation.sanitized!;

  try {
    // Mock mode - return placeholder
    if (useMock) {
      const mockAddress: AddressSummary = {
        address: sanitizedAddr,
        balance_sats: 0,
        tx_count: 0,
      };
      return NextResponse.json(mockAddress, {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      });
    }

    // Fetch from real API
    const provider = getBTCProvider();
    const providerAddr = await provider.getAddress(sanitizedAddr);
    const normalizedAddr = normalizeAddress(providerAddr);

    return NextResponse.json(normalizedAddr, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch address' },
      { status: 500 }
    );
  }
}
