import type { BTCProvider, ProviderTxResponse, ProviderAddressResponse, ProviderAddressTxResponse } from './provider';

const MEMPOOL_API_BASE = 'https://mempool.space/api';

/**
 * Mempool.space API provider
 * Documentation: https://mempool.space/docs/api
 */
export class MempoolProvider implements BTCProvider {
  private baseUrl: string;

  constructor(baseUrl: string = MEMPOOL_API_BASE) {
    this.baseUrl = baseUrl;
  }

  async getTransaction(txid: string): Promise<ProviderTxResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/tx/${txid}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Transaction ${txid} not found`);
        }
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        txid: data.txid,
        fee: data.fee,
        size: data.size,
        weight: data.weight,
        status: {
          confirmed: data.status.confirmed,
          block_height: data.status.block_height,
          block_time: data.status.block_time,
        },
        vin: data.vin || [],
        vout: data.vout || [],
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error fetching transaction');
    }
  }

  async getAddress(address: string): Promise<ProviderAddressResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/address/${address}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Address ${address} not found`);
        }
        throw new Error(`Failed to fetch address: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        address: data.address,
        chain_stats: data.chain_stats,
        mempool_stats: data.mempool_stats,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error fetching address');
    }
  }

  async getAddressTransactions(address: string, limit: number = 25): Promise<ProviderAddressTxResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/address/${address}/txs?limit=${limit}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Failed to fetch address transactions: ${response.statusText}`);
      }

      const data = await response.json();

      return (Array.isArray(data) ? data : []).map((tx: any) => ({
        txid: tx.txid,
        status: {
          confirmed: tx.status?.confirmed ?? false,
          block_height: tx.status?.block_height,
          block_time: tx.status?.block_time,
        },
        fee: tx.fee,
        vin: tx.vin || [],
        vout: tx.vout || [],
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error fetching address transactions');
    }
  }
}
