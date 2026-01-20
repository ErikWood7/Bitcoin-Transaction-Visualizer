import type { Tx, Vin, Vout } from '@/lib/types/btc';

/**
 * Provider response types (raw API responses)
 */
export interface ProviderTxResponse {
  txid: string;
  fee?: number;
  size?: number;
  weight?: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_time?: number;
  };
  vin: Array<{
    prevout?: {
      scriptpubkey_address?: string;
      value?: number;
      txid?: string;
      vout?: number;
    };
  }>;
  vout: Array<{
    scriptpubkey_address?: string;
    value?: number;
    n?: number;
  }>;
}

export interface ProviderAddressResponse {
  address: string;
  chain_stats?: {
    funded_txo_sum?: number;
    spent_txo_sum?: number;
    tx_count?: number;
  };
  mempool_stats?: {
    funded_txo_sum?: number;
    spent_txo_sum?: number;
    tx_count?: number;
  };
}

export interface ProviderAddressTxResponse {
  txid: string;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_time?: number;
  };
  fee?: number;
  vin: Array<{
    prevout?: {
      scriptpubkey_address?: string;
      value?: number;
    };
  }>;
  vout: Array<{
    scriptpubkey_address?: string;
    value?: number;
  }>;
}

/**
 * Provider interface for Bitcoin data sources
 */
export interface BTCProvider {
  /**
   * Fetch a transaction by txid
   */
  getTransaction(txid: string): Promise<ProviderTxResponse>;

  /**
   * Fetch address summary
   */
  getAddress(address: string): Promise<ProviderAddressResponse>;

  /**
   * Fetch address transactions
   */
  getAddressTransactions(address: string, limit?: number): Promise<ProviderAddressTxResponse[]>;
}
