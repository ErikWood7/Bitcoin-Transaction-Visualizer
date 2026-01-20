import { getAddress, getAddressTransactions } from '@/lib/api/client';
import { AddressPageClient } from '@/components/AddressPageClient';

interface AddressPageProps {
  params: Promise<{
    addr: string;
  }>;
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { addr } = await params;

  try {
    const [addressData, transactions] = await Promise.all([
      getAddress(addr),
      getAddressTransactions(addr, 25), // Get last 25 transactions
    ]);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Address Details
        </h1>
        <AddressPageClient address={addr} addressData={addressData} transactions={transactions} />
      </div>
    );
  } catch (error) {
    console.error('Error loading address:', error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Error Loading Address
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4">
            <strong>Address:</strong> <span className="font-mono text-sm">{addr}</span>
          </p>
          <p className="text-red-800">
            Failed to load address data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
