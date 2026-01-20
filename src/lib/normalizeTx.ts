import type { Tx, Vin, Vout, NormalizedTx, Sats } from './types/btc';

/**
 * Normalize a transaction by computing totals and structuring data
 */
export function normalizeTx(tx: Tx & { vin: Vin[]; vout: Vout[] }): NormalizedTx {
  const inputs_total_sats: Sats = tx.vin.reduce(
    (sum, input) => sum + input.prevout.value_sats,
    0
  );

  const outputs_total_sats: Sats = tx.vout.reduce(
    (sum, output) => sum + output.value_sats,
    0
  );

  // Fee is the difference between inputs and outputs
  const fee_sats: Sats = inputs_total_sats - outputs_total_sats;

  return {
    inputs_total_sats,
    outputs_total_sats,
    fee_sats,
    outputs: tx.vout,
    inputs: tx.vin,
  };
}

/**
 * Calculate confirmations from block height
 * Note: This is a simplified calculation. In production, you'd use current block height.
 */
export function calculateConfirmations(
  blockHeight: number | undefined,
  currentBlockHeight?: number
): number | undefined {
  if (blockHeight === undefined) {
    return undefined;
  }
  
  // If current block height not provided, assume it's confirmed
  if (currentBlockHeight === undefined) {
    return 1; // At least 1 confirmation
  }
  
  return Math.max(0, currentBlockHeight - blockHeight + 1);
}
