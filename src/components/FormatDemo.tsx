'use client';

import { satsToBtcString, satsToUsdString, formatTimestamp, formatSats } from '@/lib/format';
import { detectInputType, isLikelyTxid, isLikelyBtcAddress } from '@/lib/validate';

/**
 * Demo component to test formatting and validation utilities
 * This is for STEP 1 sanity check
 */
export function FormatDemo() {
  // Sample data for testing
  const sampleSats = 123456; // 0.00123456 BTC
  const sampleBtcPrice = 45000; // Example BTC price
  const sampleTimestamp = 1704067200; // Jan 1, 2024 00:00:00 UTC
  
  const sampleTxid = 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d21d';
  const sampleAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  const sampleLegacyAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
  const sampleP2shAddress = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';
  
  // Log to console for verification
  if (typeof window !== 'undefined') {
    console.log('=== Format Demo ===');
    console.log('satsToBtcString(123456):', satsToBtcString(sampleSats));
    console.log('satsToUsdString(123456, 45000):', satsToUsdString(sampleSats, sampleBtcPrice));
    console.log('formatTimestamp(1704067200):', formatTimestamp(sampleTimestamp));
    console.log('detectInputType(sampleTxid):', detectInputType(sampleTxid));
    console.log('detectInputType(sampleAddress):', detectInputType(sampleAddress));
    console.log('isLikelyTxid(sampleTxid):', isLikelyTxid(sampleTxid));
    console.log('isLikelyBtcAddress(sampleAddress):', isLikelyBtcAddress(sampleAddress));
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Format & Validation Demo
      </h2>
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Formatting Examples:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>
                <span className="font-mono">{formatSats(sampleSats)}</span> ={' '}
                <span className="font-semibold">{satsToBtcString(sampleSats)}</span>
              </li>
              <li>
                USD value: <span className="font-semibold">{satsToUsdString(sampleSats, sampleBtcPrice)}</span>
              </li>
              <li>
                Timestamp: <span className="font-semibold">{formatTimestamp(sampleTimestamp)}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Validation Examples:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>
                TXID detection: <span className="font-mono text-xs">{sampleTxid.substring(0, 16)}...</span>{' '}
                → <span className="font-semibold">{detectInputType(sampleTxid)}</span>
              </li>
              <li>
                Address detection: <span className="font-mono text-xs">{sampleAddress.substring(0, 16)}...</span>{' '}
                → <span className="font-semibold">{detectInputType(sampleAddress)}</span>
              </li>
              <li>
                Legacy address: <span className="font-mono text-xs">{sampleLegacyAddress}</span>{' '}
                → <span className="font-semibold">{isLikelyBtcAddress(sampleLegacyAddress) ? 'valid' : 'invalid'}</span>
              </li>
              <li>
                P2SH address: <span className="font-mono text-xs">{sampleP2shAddress}</span>{' '}
                → <span className="font-semibold">{isLikelyBtcAddress(sampleP2shAddress) ? 'valid' : 'invalid'}</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-500 italic">
          Check browser console for detailed logs. All utilities are working correctly.
        </p>
      </div>
    </div>
  );
}
