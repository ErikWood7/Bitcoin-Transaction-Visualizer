/**
 * Server-side API client for internal API routes
 * This allows server components to call API routes without HTTP overhead
 */

import { getBTCProvider } from '@/lib/btcProviders';
import { normalizeTransaction, normalizeAddress, normalizeAddressTransaction } from '@/lib/btcProviders/normalize';
import mockTransactions from '@/content/mockTransactions.json';
import type { Tx, Vin, Vout, AddressSummary } from '@/lib/types/btc';

type MockTransactions = Record<string, Tx & { vin: Vin[]; vout: Vout[] }>;

const useMock = process.env.USE_MOCK_DATA === '1';
const mockTxData = mockTransactions as MockTransactions;

/**
 * Check if a txid is in our mock data
 */
function isMockTransaction(txid: string): boolean {
  return txid in mockTxData;
}

/**
 * Get transaction by txid
 */
export async function getTransaction(txid: string): Promise<Tx & { vin: Vin[]; vout: Vout[] }> {
  // Always check mock data first for example transactions
  if (useMock || isMockTransaction(txid)) {
    const tx = mockTxData[txid];
    if (tx) {
      return tx;
    }
    if (useMock) {
      throw new Error(`Transaction ${txid} not found in mock data`);
    }
  }

  // Try real API, but fall back to mock if it's a known example transaction
  try {
    const provider = getBTCProvider();
    const providerTx = await provider.getTransaction(txid);
    return normalizeTransaction(providerTx);
  } catch (error) {
    // If real API fails and this is a mock transaction, use mock data
    if (isMockTransaction(txid)) {
      const tx = mockTxData[txid];
      if (tx) {
        return tx;
      }
    }
    throw error;
  }
}

/**
 * Get address summary
 */
export async function getAddress(address: string): Promise<AddressSummary> {
  if (useMock) {
    return {
      address,
      balance_sats: 0,
      tx_count: 0,
    };
  }

  const provider = getBTCProvider();
  const providerAddr = await provider.getAddress(address);
  return normalizeAddress(providerAddr);
}

/**
 * Get address transactions
 */
export async function getAddressTransactions(address: string, limit: number = 25): Promise<Array<Tx & { vin: Vin[]; vout: Vout[] }>> {
  if (useMock) {
    return [];
  }

  const provider = getBTCProvider();
  const providerTxs = await provider.getAddressTransactions(address, limit);
  return providerTxs.map(normalizeAddressTransaction);
}
