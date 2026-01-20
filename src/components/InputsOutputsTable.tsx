'use client';

import type { Vin, Vout } from '@/lib/types/btc';
import { satsToBtcString, satsToUsdString } from '@/lib/format';
import { useBTCPrice } from '@/lib/useBTCPrice';

interface InputsOutputsTableProps {
  inputs: Vin[];
  outputs: Vout[];
  highlightRowIndexes?: number[];
  highlightInputIndexes?: number[];
  highlightOutputIndexes?: number[];
  learnMode?: boolean;
}

export function InputsOutputsTable({
  inputs,
  outputs,
  highlightRowIndexes = [],
  highlightInputIndexes,
  highlightOutputIndexes,
  learnMode = false,
}: InputsOutputsTableProps) {
  const btcPrice = useBTCPrice();
  // Use specific highlight arrays if provided, otherwise fall back to general one
  const inputHighlights = highlightInputIndexes ?? highlightRowIndexes;
  const outputHighlights = highlightOutputIndexes ?? highlightRowIndexes;
  const getAddressLabel = (address: string | undefined, index: number, type: 'input' | 'output') => {
    if (!address) return 'Unknown';
    
    if (learnMode) {
      if (type === 'input') {
        return `Sender ${String.fromCharCode(65 + index)}`; // A, B, C, etc.
      } else {
        // Assume last output is change
        if (index === outputs.length - 1 && outputs.length > 1) {
          return 'Change';
        }
        return index === 0 ? 'Recipient' : `Recipient ${index + 1}`;
      }
    }
    
    return address;
  };

  const isInputHighlighted = (index: number) => inputHighlights.includes(index);
  const isOutputHighlighted = (index: number) => outputHighlights.includes(index);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Inputs ({inputs.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Address</th>
                <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {inputs.map((input, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${
                    isInputHighlighted(index) ? 'bg-yellow-100 border-yellow-300' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs break-all text-gray-900">
                      {getAddressLabel(input.prevout.address, index, 'input')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="font-semibold text-gray-900">
                      {satsToBtcString(input.prevout.value_sats)}
                    </div>
                    {btcPrice && (
                      <div className="text-sm text-gray-600">
                        {satsToUsdString(input.prevout.value_sats, btcPrice)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outputs Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Outputs ({outputs.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Address</th>
                <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {outputs.map((output, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${
                    isOutputHighlighted(index) ? 'bg-yellow-100 border-yellow-300' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs break-all text-gray-900">
                      {getAddressLabel(output.address, index, 'output')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="font-semibold text-gray-900">
                      {satsToBtcString(output.value_sats)}
                    </div>
                    {btcPrice && (
                      <div className="text-sm text-gray-600">
                        {satsToUsdString(output.value_sats, btcPrice)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
