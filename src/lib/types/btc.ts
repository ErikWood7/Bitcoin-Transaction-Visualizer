/**
 * Bitcoin data types
 * All monetary values are in satoshis (sats)
 */

/**
 * Satoshis - the smallest unit of Bitcoin
 * 1 BTC = 100,000,000 sats
 */
export type Sats = number; // Integer representing satoshis

/**
 * Transaction status
 */
export type TxStatus =
  | {
      confirmed: true;
      block_height: number;
      block_time: number; // Unix timestamp in seconds
      confirmations: number;
    }
  | {
      confirmed: false;
      block_height?: never;
      block_time?: never;
      confirmations?: never;
    };

/**
 * Bitcoin Transaction
 */
export interface Tx {
  txid: string; // 64-character hex string
  fee_sats: Sats;
  size_vbytes?: number; // Virtual bytes (size)
  weight?: number; // Transaction weight
  status: TxStatus;
}

/**
 * Transaction Input (Vin)
 * References a previous output (UTXO)
 */
export interface Vin {
  prevout: {
    address?: string; // Bitcoin address that received the output
    value_sats: Sats; // Amount in satoshis
    txid?: string; // Transaction ID of the previous transaction
    vout?: number; // Output index in the previous transaction
  };
}

/**
 * Transaction Output (Vout)
 * Creates a new UTXO
 */
export interface Vout {
  address?: string; // Bitcoin address receiving the output
  value_sats: Sats; // Amount in satoshis
  n: number; // Output index (0-based)
}

/**
 * Address Summary
 */
export interface AddressSummary {
  address: string;
  balance_sats?: Sats; // Current balance (if available)
  tx_count?: number; // Number of transactions (if available)
}

/**
 * Normalized Transaction
 * Pre-computed totals and structured data for display
 */
export interface NormalizedTx {
  inputs_total_sats: Sats;
  outputs_total_sats: Sats;
  fee_sats: Sats;
  outputs: Vout[];
  inputs: Vin[];
}
