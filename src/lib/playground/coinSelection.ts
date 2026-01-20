import type { UTXO } from '@/content/playgroundScenarios';
import type { Sats } from '@/lib/types/btc';

/**
 * Select UTXOs to cover the send amount plus fee
 * Uses a simple "largest first" strategy
 */
export function selectUTXOs(
  utxos: UTXO[],
  sendAmountSats: Sats,
  feeRateSatPerVByte: number,
  estimatedVBytes: number = 250 // Default estimate for a simple transaction
): {
  selected: UTXO[];
  totalSelected: Sats;
  fee: Sats;
  change: Sats;
  canSend: boolean;
  error?: string;
} {
  if (sendAmountSats <= 0) {
    return {
      selected: [],
      totalSelected: 0,
      fee: 0,
      change: 0,
      canSend: false,
      error: 'Send amount must be greater than 0',
    };
  }

  // Sort UTXOs by value (largest first)
  const sortedUTXOs = [...utxos].sort((a, b) => b.value_sats - a.value_sats);

  // Estimate fee based on number of inputs/outputs
  // Rough estimate: ~148 vbytes per input, ~34 vbytes per output
  const estimatedInputs = Math.ceil(sendAmountSats / sortedUTXOs[0]?.value_sats || 1);
  const estimatedVBytesWithInputs = 10 + (estimatedInputs * 148) + (2 * 34); // 2 outputs: recipient + change
  const estimatedFee = Math.ceil(estimatedVBytesWithInputs * feeRateSatPerVByte);

  const targetAmount = sendAmountSats + estimatedFee;
  const selected: UTXO[] = [];
  let totalSelected = 0;

  // Select UTXOs until we have enough
  for (const utxo of sortedUTXOs) {
    selected.push(utxo);
    totalSelected += utxo.value_sats;

    if (totalSelected >= targetAmount) {
      break;
    }
  }

  // Recalculate fee with actual number of inputs
  const actualVBytes = 10 + (selected.length * 148) + (2 * 34);
  const actualFee = Math.ceil(actualVBytes * feeRateSatPerVByte);

  // Check if we have enough
  if (totalSelected < sendAmountSats + actualFee) {
    return {
      selected,
      totalSelected,
      fee: actualFee,
      change: 0,
      canSend: false,
      error: `Insufficient funds. Need ${((sendAmountSats + actualFee) / 100_000_000).toFixed(8)} BTC but only have ${(totalSelected / 100_000_000).toFixed(8)} BTC available.`,
    };
  }

  const change = totalSelected - sendAmountSats - actualFee;

  return {
    selected,
    totalSelected,
    fee: actualFee,
    change,
    canSend: true,
  };
}
