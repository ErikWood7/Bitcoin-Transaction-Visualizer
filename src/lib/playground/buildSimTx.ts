import type { UTXO } from '@/content/playgroundScenarios';
import type { Tx, Vin, Vout, Sats } from '@/lib/types/btc';
import { selectUTXOs } from './coinSelection';

export interface SimTxParams {
  utxos: UTXO[];
  sendAmountSats: Sats;
  recipientAddress: string;
  changeAddress: string;
  feeRateSatPerVByte: number;
}

export interface SimTxResult {
  tx: Tx & { vin: Vin[]; vout: Vout[] };
  selectedUTXOs: UTXO[];
  fee: Sats;
  change: Sats;
  canSend: boolean;
  error?: string;
}

/**
 * Build a simulated transaction
 */
export function buildSimTx(params: SimTxParams): SimTxResult {
  const { utxos, sendAmountSats, recipientAddress, changeAddress, feeRateSatPerVByte } = params;

  // Select UTXOs
  const selection = selectUTXOs(utxos, sendAmountSats, feeRateSatPerVByte);

  if (!selection.canSend) {
    return {
      tx: {
        txid: 'simulated-tx-pending',
        fee_sats: selection.fee,
        status: { confirmed: false },
        vin: [],
        vout: [],
      },
      selectedUTXOs: selection.selected,
      fee: selection.fee,
      change: 0,
      canSend: false,
      error: selection.error,
    };
  }

  // Build inputs
  const vin: Vin[] = selection.selected.map((utxo) => ({
    prevout: {
      address: utxo.address,
      value_sats: utxo.value_sats,
      txid: utxo.txid,
      vout: utxo.vout,
    },
  }));

  // Build outputs
  const vout: Vout[] = [
    {
      address: recipientAddress,
      value_sats: sendAmountSats,
      n: 0,
    },
  ];

  // Add change output if there's change
  if (selection.change > 0) {
    vout.push({
      address: changeAddress,
      value_sats: selection.change,
      n: 1,
    });
  }

  // Generate a simulated txid
  const simulatedTxid = `sim-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  const tx: Tx & { vin: Vin[]; vout: Vout[] } = {
    txid: simulatedTxid,
    fee_sats: selection.fee,
    size_vbytes: 10 + (vin.length * 148) + (vout.length * 34),
    weight: (10 + (vin.length * 148) + (vout.length * 34)) * 4,
    status: {
      confirmed: false,
    },
    vin,
    vout,
  };

  return {
    tx,
    selectedUTXOs: selection.selected,
    fee: selection.fee,
    change: selection.change,
    canSend: true,
  };
}
