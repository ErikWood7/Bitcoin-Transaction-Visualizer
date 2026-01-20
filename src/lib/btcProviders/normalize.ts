import type { ProviderTxResponse, ProviderAddressResponse, ProviderAddressTxResponse } from './provider';
import type { Tx, Vin, Vout, AddressSummary } from '@/lib/types/btc';

/**
 * Normalize provider transaction response to our Tx type
 */
export function normalizeTransaction(providerTx: ProviderTxResponse): Tx & { vin: Vin[]; vout: Vout[] } {
  const vin: Vin[] = (providerTx.vin || []).map((input) => ({
    prevout: {
      address: input.prevout?.scriptpubkey_address,
      // Mempool.space API returns values in satoshis, not BTC
      value_sats: Math.round(input.prevout?.value || 0),
      txid: input.prevout?.txid,
      vout: input.prevout?.vout,
    },
  }));

  const vout: Vout[] = (providerTx.vout || []).map((output, index) => ({
    address: output.scriptpubkey_address,
    // Mempool.space API returns values in satoshis, not BTC
    value_sats: Math.round(output.value || 0),
    n: output.n ?? index,
  }));

  // Calculate fee if not provided
  const inputsTotal = vin.reduce((sum, input) => sum + input.prevout.value_sats, 0);
  const outputsTotal = vout.reduce((sum, output) => sum + output.value_sats, 0);
  const calculatedFee = inputsTotal - outputsTotal;
  const fee_sats = providerTx.fee ? Math.round(providerTx.fee) : calculatedFee;

  const status = providerTx.status.confirmed
    ? {
        confirmed: true as const,
        block_height: providerTx.status.block_height!,
        block_time: providerTx.status.block_time!,
        confirmations: 0, // Will be calculated if we have current block height
      }
    : {
        confirmed: false as const,
      };

  return {
    txid: providerTx.txid,
    fee_sats,
    size_vbytes: providerTx.size,
    weight: providerTx.weight,
    status,
    vin,
    vout,
  };
}

/**
 * Normalize provider address response to our AddressSummary type
 */
export function normalizeAddress(providerAddr: ProviderAddressResponse): AddressSummary {
  const chainStats = providerAddr.chain_stats || {};
  const mempoolStats = providerAddr.mempool_stats || {};

  const funded = (chainStats.funded_txo_sum || 0) + (mempoolStats.funded_txo_sum || 0);
  const spent = (chainStats.spent_txo_sum || 0) + (mempoolStats.spent_txo_sum || 0);
  // Mempool.space API returns values in satoshis, not BTC
  const balance_sats = Math.round(funded - spent);

  const tx_count = (chainStats.tx_count || 0) + (mempoolStats.tx_count || 0);

  return {
    address: providerAddr.address,
    balance_sats,
    tx_count,
  };
}

/**
 * Normalize provider address transaction response
 */
export function normalizeAddressTransaction(providerTx: ProviderAddressTxResponse): Tx & { vin: Vin[]; vout: Vout[] } {
  return normalizeTransaction(providerTx as ProviderTxResponse);
}
