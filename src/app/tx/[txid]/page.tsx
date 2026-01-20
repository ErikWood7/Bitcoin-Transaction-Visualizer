import { normalizeTx } from '@/lib/normalizeTx';
import { getTransaction } from '@/lib/api/client';
import type { Tx, Vin, Vout } from '@/lib/types/btc';
import { TxPageClient } from '@/components/TxPageClient';

interface TxPageProps {
  params: Promise<{
    txid: string;
  }>;
}

export default async function TxPage({ params }: TxPageProps) {
  const { txid } = await params;

  try {
    // Fetch transaction data
    const tx = await getTransaction(txid);
    const normalizedTx = normalizeTx(tx);

    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Transaction Details
        </h1>
        
        <TxPageClient tx={tx} normalizedTx={normalizedTx} />
      </div>
    );
  } catch (error) {
    console.error('Error loading transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNotFound = errorMessage.includes('not found') || errorMessage.includes('404');

    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {isNotFound ? 'Transaction Not Found' : 'Error Loading Transaction'}
        </h1>
        <div className={`rounded-lg p-6 ${isNotFound ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`mb-4 ${isNotFound ? 'text-yellow-800' : 'text-red-800'}`}>
            <strong>Transaction ID:</strong> <span className="font-mono text-sm">{txid}</span>
          </p>
          <p className={isNotFound ? 'text-yellow-800' : 'text-red-800'}>
            {isNotFound
              ? 'This transaction was not found. Please verify the transaction ID and try again.'
              : `Failed to load transaction data: ${errorMessage}. Please try again later.`}
          </p>
          {!isNotFound && (
            <div className="mt-4">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Return to homepage
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
