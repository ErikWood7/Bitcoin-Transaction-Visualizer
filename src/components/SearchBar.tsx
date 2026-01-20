'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { detectInputType } from '@/lib/validate';

export function SearchBar() {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a transaction ID or address');
      return;
    }

    const inputType = detectInputType(trimmed);
    
    if (inputType === 'txid') {
      router.push(`/tx/${trimmed}`);
    } else if (inputType === 'address') {
      router.push(`/address/${trimmed}`);
    } else {
      setError('Invalid input. Please enter a valid transaction ID (64 hex characters) or Bitcoin address.');
    }
  };

  const handleExampleTx = () => {
    // Example transaction ID (64 hex characters)
    // This is one of the mock transactions available
    const exampleTxid = 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d21d';
    setInput(exampleTxid);
    setError('');
    router.push(`/tx/${exampleTxid}`);
  };

  const handleExampleAddress = () => {
    // Example Bech32 address
    const exampleAddr = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    setInput(exampleAddr);
    setError('');
    router.push(`/address/${exampleAddr}`);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder="Enter transaction ID or Bitcoin address..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Search
          </button>
        </div>
        
        {error && (
          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExampleTx}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Try Example Transaction
          </button>
          <button
            type="button"
            onClick={handleExampleAddress}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Try Example Address
          </button>
        </div>
      </form>
    </div>
  );
}
