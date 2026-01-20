'use client';

import type { GraphNode } from '@/lib/graph/buildGraph';
import { satsToBtcString, satsToUsdString } from '@/lib/format';
import { useBTCPrice } from '@/lib/useBTCPrice';

interface InspectorPanelProps {
  selectedNode: GraphNode | null;
  learnMode?: boolean;
}

export function InspectorPanel({ selectedNode, learnMode = false }: InspectorPanelProps) {
  const btcPrice = useBTCPrice();
  if (!selectedNode) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Inspector</h3>
        <p className="text-gray-500 text-sm">
          Click on a node in the graph to see details.
        </p>
      </div>
    );
  }

  const isTxNode = selectedNode.type === 'tx';
  const isAddrNode = selectedNode.type === 'addr';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Inspector</h3>

      {isTxNode && selectedNode.data.txid && (
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Type:</span>
            <p className="text-lg font-semibold text-gray-900">Transaction</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
            <p className="font-mono text-sm break-all text-gray-900 mt-1">
              {selectedNode.data.txid}
            </p>
          </div>
          {selectedNode.data.fee_sats !== undefined && (
            <div>
              <span className="text-sm font-medium text-gray-500">Fee:</span>
              <p className="text-lg font-semibold text-gray-900">
                {satsToBtcString(selectedNode.data.fee_sats)}
              </p>
              {btcPrice && (
                <p className="text-sm text-gray-600">
                  {satsToUsdString(selectedNode.data.fee_sats, btcPrice)}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {isAddrNode && selectedNode.data.address && (
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Type:</span>
            <p className="text-lg font-semibold text-gray-900">Address</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Address:</span>
            <p className="font-mono text-sm break-all text-gray-900 mt-1">
              {learnMode ? (
                <span className="text-gray-600 italic">
                  (Address hidden in Learn Mode)
                </span>
              ) : (
                selectedNode.data.address
              )}
            </p>
          </div>
          {selectedNode.data.total_in !== undefined && selectedNode.data.total_in > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-500">Total Received (in this tx):</span>
              <p className="text-lg font-semibold text-green-600">
                +{satsToBtcString(selectedNode.data.total_in)}
              </p>
              {btcPrice && (
                <p className="text-sm text-gray-600">
                  {satsToUsdString(selectedNode.data.total_in, btcPrice)}
                </p>
              )}
            </div>
          )}
          {selectedNode.data.total_out !== undefined && selectedNode.data.total_out > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-500">Total Sent (in this tx):</span>
              <p className="text-lg font-semibold text-red-600">
                -{satsToBtcString(selectedNode.data.total_out)}
              </p>
              {btcPrice && (
                <p className="text-sm text-gray-600">
                  {satsToUsdString(selectedNode.data.total_out, btcPrice)}
                </p>
              )}
            </div>
          )}
          {selectedNode.data.total_in !== undefined &&
            selectedNode.data.total_out !== undefined &&
            selectedNode.data.total_in > 0 &&
            selectedNode.data.total_out > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-500">Net Change:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {satsToBtcString(selectedNode.data.total_in - selectedNode.data.total_out)}
                </p>
                {btcPrice && (
                  <p className="text-sm text-gray-600">
                    {satsToUsdString(selectedNode.data.total_in - selectedNode.data.total_out, btcPrice)}
                  </p>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
