'use client';

import { useState } from 'react';
import mythsData from '@/content/myths.json';
import { AutoLinkGlossary } from '@/components/AutoLinkGlossary';

interface Myth {
  id: string;
  title: string;
  myth: string;
  reality: string;
  category: string;
}

export default function MythsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const myths = mythsData.myths as Myth[];

  const categories = ['all', ...Array.from(new Set(myths.map((m) => m.category)))];
  const filteredMyths = selectedCategory === 'all' 
    ? myths 
    : myths.filter((m) => m.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Bitcoin Myths Debunked</h1>
      <p className="text-lg text-gray-600 mb-8">
        Common misconceptions about Bitcoin, transactions, privacy, and the blockchain.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredMyths.map((myth) => (
          <div key={myth.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{myth.title}</h2>
            
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
              <p className="text-sm font-semibold text-red-800 mb-1">❌ The Myth:</p>
              <p className="text-red-900">
                <AutoLinkGlossary text={myth.myth} />
              </p>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <p className="text-sm font-semibold text-green-800 mb-1">✅ The Reality:</p>
              <p className="text-green-900">
                <AutoLinkGlossary text={myth.reality} />
              </p>
            </div>

            <div className="mt-3">
              <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                {myth.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
