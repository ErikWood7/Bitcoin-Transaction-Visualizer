'use client';

import { AutoLinkGlossary } from './AutoLinkGlossary';

interface PrivacyWarningProps {
  showRawAddress: boolean;
  onToggle: (show: boolean) => void;
}

export function PrivacyWarning({ showRawAddress, onToggle }: PrivacyWarningProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-yellow-600 text-xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-2">Privacy Notice</h3>
          <p className="text-sm text-yellow-800 mb-3">
            <AutoLinkGlossary text="Bitcoin addresses are public on the blockchain. However, addresses are not identities. A single person can have many addresses, and addresses can be shared by multiple people. The blockchain shows transaction flows, but it does not reveal who controls each address." />
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRawAddress}
              onChange={(e) => onToggle(e.target.checked)}
              className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="text-sm text-yellow-800 font-medium">
              Show raw addresses
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
