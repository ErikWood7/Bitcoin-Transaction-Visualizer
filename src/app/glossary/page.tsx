'use client';

import { useState, useMemo } from 'react';
import { searchGlossary, getGlossary } from '@/lib/glossary';
import { GlossaryTooltip } from '@/components/GlossaryTooltip';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      const glossary = getGlossary();
      return Object.entries(glossary).map(([key, entry]) => ({ key, entry }));
    }
    return searchGlossary(searchQuery);
  }, [searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Glossary</h1>
      <p className="text-lg text-gray-600 mb-8">
        Definitions of Bitcoin and blockchain terms. Click or hover on terms to see definitions.
      </p>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <label htmlFor="glossary-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Terms
          </label>
          <input
            id="glossary-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by term or definition..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No terms found matching your search.</p>
          ) : (
            results.map(({ key, entry }) => (
              <div
                key={key}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    <GlossaryTooltip term={key}>{entry.term}</GlossaryTooltip>
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                    {entry.category}
                  </span>
                </div>
                <p className="text-gray-700">{entry.definition}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
