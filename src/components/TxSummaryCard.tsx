'use client';

import type { Tx } from '@/lib/types/btc';
import { satsToBtcString, satsToUsdString, formatTimestamp } from '@/lib/format';
import { CopyButton } from './CopyButton';
import { useBTCPrice } from '@/lib/useBTCPrice';

interface TxSummaryCardProps {
  tx: Tx;
}

export function TxSummaryCard({ tx }: TxSummaryCardProps) {
  const isConfirmed = tx.status.confirmed;
  const blockTime = tx.status.confirmed ? tx.status.block_time : undefined;
  const confirmations = tx.status.confirmed ? tx.status.confirmations : undefined;
  const btcPrice = useBTCPrice();

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction Summary</h2>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
            <CopyButton text={tx.txid} />
          </div>
          <p className="font-mono text-sm break-all text-gray-900">{tx.txid}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Fee:</span>
            <p className="text-lg font-semibold text-gray-900">
              {satsToBtcString(tx.fee_sats)}
            </p>
            {btcPrice && (
              <p className="text-sm text-gray-600">
                {satsToUsdString(tx.fee_sats, btcPrice)}
              </p>
            )}
          </div>

          {tx.size_vbytes && (
            <div>
              <span className="text-sm font-medium text-gray-500">Size:</span>
              <p className="text-lg font-semibold text-gray-900">
                {tx.size_vbytes.toLocaleString()} vbytes
              </p>
            </div>
          )}

          {tx.weight && (
            <div>
              <span className="text-sm font-medium text-gray-500">Weight:</span>
              <p className="text-lg font-semibold text-gray-900">
                {tx.weight.toLocaleString()} WU
              </p>
            </div>
          )}

          <div>
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <p className="text-lg font-semibold">
              {isConfirmed ? (
                <span className="text-green-600">Confirmed</span>
              ) : (
                <span className="text-yellow-600">Unconfirmed (Mempool)</span>
              )}
            </p>
          </div>

          {isConfirmed && blockTime && (
            <>
              <div>
                <span className="text-sm font-medium text-gray-500">Date & Time:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {formatTimestamp(blockTime)}
                </p>
              </div>

              {tx.status.block_height && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Block Height:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {tx.status.block_height.toLocaleString()}
                  </p>
                </div>
              )}

              {confirmations !== undefined && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Confirmations:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {confirmations.toLocaleString()}
                  </p>
                </div>
              )}
            </>
          )}
          {!isConfirmed && (
            <div>
              <span className="text-sm font-medium text-gray-500">Date & Time:</span>
              <p className="text-lg font-semibold text-yellow-600">
                Pending (Unconfirmed)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Transaction is in the mempool waiting to be confirmed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
