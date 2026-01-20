'use client';

import { useState } from 'react';
import type { AddressSummary, Tx } from '@/lib/types/btc';
import { AddressSummaryCard } from './AddressSummaryCard';
import { TxList } from './TxList';
import { PrivacyWarning } from './PrivacyWarning';

interface AddressPageClientProps {
  address: string;
  addressData: AddressSummary;
  transactions: Tx[];
}

export function AddressPageClient({ address, addressData, transactions }: AddressPageClientProps) {
  const [showRawAddress, setShowRawAddress] = useState(false);

  return (
    <div className="space-y-6">
      <PrivacyWarning showRawAddress={showRawAddress} onToggle={setShowRawAddress} />

      <AddressSummaryCard
        address={address}
        addressData={addressData}
        showRawAddress={showRawAddress}
      />

      <TxList transactions={transactions} limit={10} />
    </div>
  );
}
