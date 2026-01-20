'use client';

import type { NormalizedTx } from '@/lib/types/btc';
import { satsToBtcString, satsToUsdString } from '@/lib/format';
import { useBTCPrice } from '@/lib/useBTCPrice';

interface VerifyMathCardProps {
  normalizedTx: NormalizedTx;
}

export function VerifyMathCard({ normalizedTx }: VerifyMathCardProps) {
  const { inputs_total_sats, outputs_total_sats, fee_sats } = normalizedTx;
  const btcPrice = useBTCPrice();
  
  // Verify the math: inputs - outputs = fee
  const calculatedFee = inputs_total_sats - outputs_total_sats;
  const mathIsCorrect = calculatedFee === fee_sats;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify the Math</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-3">
            <strong>Transaction Fee Formula:</strong> Total Inputs - Total Outputs = Fee
          </p>
          
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Inputs:</span>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {satsToBtcString(inputs_total_sats)}
                </div>
                {btcPrice && (
                  <div className="text-xs text-gray-600">
                    {satsToUsdString(inputs_total_sats, btcPrice)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Outputs:</span>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {satsToBtcString(outputs_total_sats)}
                </div>
                {btcPrice && (
                  <div className="text-xs text-gray-600">
                    {satsToUsdString(outputs_total_sats, btcPrice)}
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-blue-300 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fee:</span>
                <div className="text-right">
                  <div className="font-bold text-blue-900">
                    {satsToBtcString(fee_sats)}
                  </div>
                  {btcPrice && (
                    <div className="text-xs text-gray-600">
                      {satsToUsdString(fee_sats, btcPrice)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mathIsCorrect ? (
            <>
              <span className="text-green-600 text-2xl">✓</span>
              <span className="text-green-700 font-medium">Math is correct!</span>
            </>
          ) : (
            <>
              <span className="text-red-600 text-2xl">✗</span>
              <span className="text-red-700 font-medium">
                Math error: Calculated fee ({satsToBtcString(calculatedFee)}) doesn't match reported fee ({satsToBtcString(fee_sats)})
              </span>
            </>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <p className="text-sm text-gray-700">
            <strong>Explanation:</strong> When you spend Bitcoin, you must spend entire UTXOs. 
            The difference between what you're spending (inputs) and what you're sending (outputs) 
            is the transaction fee paid to miners.
          </p>
        </div>
      </div>
    </div>
  );
}
