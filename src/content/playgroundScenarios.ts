import type { Vin } from '@/lib/types/btc';

export interface UTXO {
  txid: string;
  vout: number;
  address: string;
  value_sats: number;
}

export interface PlaygroundScenario {
  id: string;
  name: string;
  description: string;
  utxos: UTXO[];
}

export const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: 'small',
    name: 'Small Wallet',
    description: 'A wallet with a few small UTXOs. Good for learning basic transactions.',
    utxos: [
      {
        txid: 'abc123...',
        vout: 0,
        address: 'bc1qwallet1',
        value_sats: 10_000_000, // 0.1 BTC
      },
      {
        txid: 'def456...',
        vout: 1,
        address: 'bc1qwallet1',
        value_sats: 5_000_000, // 0.05 BTC
      },
      {
        txid: 'ghi789...',
        vout: 0,
        address: 'bc1qwallet1',
        value_sats: 2_500_000, // 0.025 BTC
      },
    ],
  },
  {
    id: 'medium',
    name: 'Medium Wallet',
    description: 'A wallet with medium-sized UTXOs. Common for regular users.',
    utxos: [
      {
        txid: 'jkl012...',
        vout: 0,
        address: 'bc1qwallet2',
        value_sats: 50_000_000, // 0.5 BTC
      },
      {
        txid: 'mno345...',
        vout: 1,
        address: 'bc1qwallet2',
        value_sats: 25_000_000, // 0.25 BTC
      },
      {
        txid: 'pqr678...',
        vout: 0,
        address: 'bc1qwallet2',
        value_sats: 10_000_000, // 0.1 BTC
      },
      {
        txid: 'stu901...',
        vout: 2,
        address: 'bc1qwallet2',
        value_sats: 5_000_000, // 0.05 BTC
      },
    ],
  },
  {
    id: 'large',
    name: 'Large Wallet',
    description: 'A wallet with larger UTXOs. Demonstrates how to handle bigger amounts.',
    utxos: [
      {
        txid: 'vwx234...',
        vout: 0,
        address: 'bc1qwallet3',
        value_sats: 100_000_000, // 1 BTC
      },
      {
        txid: 'yza567...',
        vout: 1,
        address: 'bc1qwallet3',
        value_sats: 50_000_000, // 0.5 BTC
      },
    ],
  },
  {
    id: 'many-small',
    name: 'Many Small UTXOs',
    description: 'A wallet with many small UTXOs. Shows the importance of UTXO consolidation.',
    utxos: Array.from({ length: 10 }, (_, i) => ({
      txid: `many${i}...`,
      vout: i,
      address: 'bc1qwallet4',
      value_sats: 1_000_000, // 0.01 BTC each
    })),
  },
];
