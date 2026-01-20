'use client';

import { useState, useMemo } from 'react';
import { useLearnMode } from '@/lib/learnMode';
import type { Tx, Vin, Vout, NormalizedTx } from '@/lib/types/btc';
import { buildGraph, type GraphNode } from '@/lib/graph/buildGraph';
import { TxSummaryCard } from './TxSummaryCard';
import { InputsOutputsTable } from './InputsOutputsTable';
import { VerifyMathCard } from './VerifyMathCard';
import { GraphView } from './GraphView';
import { InspectorPanel } from './InspectorPanel';
import { TxLearnPanel } from './TxLearnPanel';
import { AutoLinkGlossary } from './AutoLinkGlossary';

interface TxPageClientProps {
  tx: Tx & { vin: Vin[]; vout: Vout[] };
  normalizedTx: NormalizedTx;
}

export function TxPageClient({ tx, normalizedTx }: TxPageClientProps) {
  const { isLearnMode } = useLearnMode();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [showRawAddresses, setShowRawAddresses] = useState(false);
  const [highlights, setHighlights] = useState<{
    tableRowIndexes: number[];
    tableType?: 'inputs' | 'outputs';
    graphNodeIds: string[];
    graphEdgeIds: string[];
  }>({
    tableRowIndexes: [],
    graphNodeIds: [],
    graphEdgeIds: [],
  });

  // Build graph from transaction data
  const graphData = useMemo(() => buildGraph(tx), [tx]);

  // Update graph labels for Learn Mode
  const graphDataWithLabels = useMemo(() => {
    if (!isLearnMode || showRawAddresses) {
      return graphData;
    }

    // Replace address labels with friendly names
    const updatedNodes = graphData.nodes.map((node) => {
      if (node.type === 'addr' && node.data.address) {
        // Find which input/output this address corresponds to
        const inputIndex = tx.vin.findIndex(
          (input) => input.prevout.address === node.data.address
        );
        const outputIndex = tx.vout.findIndex(
          (output) => output.address === node.data.address
        );

        let label = node.label;
        if (inputIndex >= 0) {
          label = `Sender ${String.fromCharCode(65 + inputIndex)}`;
        } else if (outputIndex >= 0) {
          if (outputIndex === tx.vout.length - 1 && tx.vout.length > 1) {
            label = 'Change';
          } else {
            label = outputIndex === 0 ? 'Recipient' : `Recipient ${outputIndex + 1}`;
          }
        }

        return {
          ...node,
          label,
        };
      }
      return node;
    });

    return {
      ...graphData,
      nodes: updatedNodes,
    };
  }, [graphData, isLearnMode, showRawAddresses, tx]);

  const handleNodeClick = (nodeId: string, nodeData: GraphNode) => {
    setSelectedNode(nodeData);
  };

  // Get highlight row indexes for inputs and outputs separately
  const inputHighlightIndexes = useMemo(() => {
    if (highlights.tableType === 'inputs') {
      return highlights.tableRowIndexes;
    }
    return [];
  }, [highlights]);

  const outputHighlightIndexes = useMemo(() => {
    if (highlights.tableType === 'outputs') {
      return highlights.tableRowIndexes;
    }
    return [];
  }, [highlights]);

  return (
    <div className="space-y-6">
      {isLearnMode && (
        <>
          <TxLearnPanel tx={tx} onHighlightChange={setHighlights} />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm mb-2">
              <AutoLinkGlossary text="Learn Mode is ON. Addresses are shown as labels (Sender A, Recipient, Change) to help you understand the transaction structure. The fee is calculated as the difference between total inputs and total outputs." />
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRawAddresses}
                onChange={(e) => setShowRawAddresses(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-blue-800">Show raw addresses</span>
            </label>
          </div>
        </>
      )}

      <TxSummaryCard tx={tx} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraphView
          graphData={graphDataWithLabels}
          highlightedNodeIds={highlights.graphNodeIds}
          highlightedEdgeIds={highlights.graphEdgeIds}
          onNodeClick={handleNodeClick}
          learnMode={isLearnMode && !showRawAddresses}
        />
        <InspectorPanel selectedNode={selectedNode} learnMode={isLearnMode && !showRawAddresses} />
      </div>

      <InputsOutputsTable
        inputs={normalizedTx.inputs}
        outputs={normalizedTx.outputs}
        highlightInputIndexes={inputHighlightIndexes}
        highlightOutputIndexes={outputHighlightIndexes}
        learnMode={isLearnMode}
      />

      <VerifyMathCard normalizedTx={normalizedTx} />
    </div>
  );
}
