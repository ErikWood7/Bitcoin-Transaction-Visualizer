'use client';

import type { AddressSummary } from '@/lib/types/btc';
import { satsToBtcString, satsToUsdString, formatSats } from '@/lib/format';
import { truncateAddress } from '@/lib/redact';
import { CopyButton } from './CopyButton';
import { useBTCPrice } from '@/lib/useBTCPrice';

interface AddressSummaryCardProps {
  address: string;
  addressData: AddressSummary;
  showRawAddress: boolean;
}

export function AddressSummaryCard({ address, addressData, showRawAddress }: AddressSummaryCardProps) {
  const displayAddress = showRawAddress ? address : truncateAddress(address);
  const btcPrice = useBTCPrice();

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-medium text-gray-500">Bitcoin Address</h2>
          <CopyButton text={address} />
        </div>
        <p className="font-mono text-sm break-all text-gray-900">
          {displayAddress}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addressData.balance_sats !== undefined && (
          <div>
            <span className="text-sm font-medium text-gray-500">Balance:</span>
            <p className="text-lg font-semibold text-gray-900">
              {satsToBtcString(addressData.balance_sats)}
            </p>
            {btcPrice && (
              <p className="text-sm text-gray-600">
                {satsToUsdString(addressData.balance_sats, btcPrice)}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formatSats(addressData.balance_sats)}
            </p>
          </div>
        )}

        {addressData.tx_count !== undefined && (
          <div>
            <span className="text-sm font-medium text-gray-500">Transaction Count:</span>
            <p className="text-lg font-semibold text-gray-900">
              {addressData.tx_count.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
