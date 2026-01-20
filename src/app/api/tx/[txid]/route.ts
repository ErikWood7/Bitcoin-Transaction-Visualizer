import { NextRequest, NextResponse } from 'next/server';
import { getBTCProvider } from '@/lib/btcProviders';
import { normalizeTransaction } from '@/lib/btcProviders/normalize';
import mockTransactions from '@/content/mockTransactions.json';
import type { Tx, Vin, Vout } from '@/lib/types/btc';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { validateTxid } from '@/lib/validateInput';

type MockTransactions = Record<string, Tx & { vin: Vin[]; vout: Vout[] }>;

// Rate limit: 30 requests per minute per IP
const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txid: string }> }
) {
  const { txid } = await params;
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
  const validation = validateTxid(txid);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || 'Invalid transaction ID' },
      { status: 400 }
    );
  }

  const sanitizedTxid = validation.sanitized!;

  try {
    // Use mock data if enabled
    if (useMock) {
      const mockTxData = mockTransactions as MockTransactions;
      const tx = mockTxData[sanitizedTxid];

      if (!tx) {
        return NextResponse.json(
          { error: 'Transaction not found in mock data' },
          { status: 404 }
        );
      }

      return NextResponse.json(tx, {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      });
    }

    // Fetch from real API
    const provider = getBTCProvider();
    const providerTx = await provider.getTransaction(sanitizedTxid);
    const normalizedTx = normalizeTransaction(providerTx);

    return NextResponse.json(normalizedTx, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}
