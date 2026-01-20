'use client';

import type { Tx } from '@/lib/types/btc';
import { formatTimestamp } from '@/lib/format';

interface TxListProps {
  transactions: Tx[];
  limit?: number;
}

export function TxList({ transactions, limit }: TxListProps) {
  const displayTxs = limit ? transactions.slice(0, limit) : transactions;

  if (displayTxs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transactions</h2>
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Recent Transactions ({displayTxs.length}{limit && transactions.length > limit ? ` of ${transactions.length}` : ''})
      </h2>
      <div className="space-y-2">
        {displayTxs.map((tx) => (
          <a
            key={tx.txid}
            href={`/tx/${tx.txid}`}
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-gray-900">
                {tx.txid.substring(0, 16)}...{tx.txid.substring(tx.txid.length - 8)}
              </span>
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                tx.status.confirmed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tx.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Fee: {tx.fee_sats.toLocaleString()} sats</span>
              {tx.status.confirmed && tx.status.block_time ? (
                <span className="text-gray-700 font-medium">{formatTimestamp(tx.status.block_time)}</span>
              ) : (
                <span className="text-yellow-600 font-medium">Pending (Unconfirmed)</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
