'use client';

import { useEffect, useMemo } from 'react';
import { useTourState } from '@/lib/tourState';
import { ChapterCard } from './ChapterCard';
import type { Tx, Vin, Vout } from '@/lib/types/btc';
import { buildGraph } from '@/lib/graph/buildGraph';

interface TxLearnPanelProps {
  tx: Tx & { vin: Vin[]; vout: Vout[] };
  onHighlightChange: (highlights: {
    tableRowIndexes: number[];
    tableType?: 'inputs' | 'outputs';
    graphNodeIds: string[];
    graphEdgeIds: string[];
  }) => void;
}

export function TxLearnPanel({ tx, onHighlightChange }: TxLearnPanelProps) {
  const {
    currentChapter,
    currentChapterIndex,
    totalChapters,
    isFirstChapter,
    isLastChapter,
    nextChapter,
    prevChapter,
  } = useTourState();

  // Build graph to get node IDs
  const graphData = useMemo(() => buildGraph(tx), [tx]);

  // Calculate highlights based on current chapter
  useEffect(() => {
    if (!currentChapter?.highlight) {
      onHighlightChange({
        tableRowIndexes: [],
        graphNodeIds: [],
        graphEdgeIds: [],
      });
      return;
    }

    const highlight = currentChapter.highlight;
    const tableRowIndexes: number[] = [];
    let tableType: 'inputs' | 'outputs' | undefined;

    // Handle table highlights
    if (highlight.table && highlight.rowIndexes) {
      tableType = highlight.table;
      tableRowIndexes.push(...highlight.rowIndexes);
    }

    // Handle graph node highlights
    const graphNodeIds: string[] = [];
    if (highlight.graphNodes) {
      // Map special node names to actual node IDs
      highlight.graphNodes.forEach((nodeName) => {
        if (nodeName === 'fee') {
          // Fee is shown in the transaction node
          graphNodeIds.push(`tx:${tx.txid}`);
        } else {
          // Try to find node by name or use as-is if it's already an ID
          const node = graphData.nodes.find((n) => n.id === nodeName || n.label.includes(nodeName));
          if (node) {
            graphNodeIds.push(node.id);
          }
        }
      });
    }

    // Handle graph edge highlights
    const graphEdgeIds: string[] = [];
    if (highlight.graphEdges) {
      highlight.graphEdges.forEach((edgeName) => {
        const edge = graphData.edges.find((e) => e.id === edgeName || e.id.includes(edgeName));
        if (edge) {
          graphEdgeIds.push(edge.id);
        }
      });
    }

    // For inputs chapter, highlight input nodes and edges
    if (currentChapter.id === 'inputs') {
      tx.vin.forEach((_, index) => {
        const inputAddress = tx.vin[index].prevout.address;
        if (inputAddress) {
          const addrNode = graphData.nodes.find((n) => n.data.address === inputAddress);
          if (addrNode) {
            graphNodeIds.push(addrNode.id);
          }
          // Highlight input edges
          const inputEdge = graphData.edges.find(
            (e) => e.type === 'input' && e.source === `addr:${inputAddress}`
          );
          if (inputEdge) {
            graphEdgeIds.push(inputEdge.id);
          }
        }
      });
    }

    // For outputs chapter, highlight output nodes and edges
    if (currentChapter.id === 'outputs') {
      tx.vout.forEach((_, index) => {
        const outputAddress = tx.vout[index].address;
        if (outputAddress) {
          const addrNode = graphData.nodes.find((n) => n.data.address === outputAddress);
          if (addrNode) {
            graphNodeIds.push(addrNode.id);
          }
          // Highlight output edges
          const outputEdge = graphData.edges.find(
            (e) => e.type === 'output' && e.target === `addr:${outputAddress}`
          );
          if (outputEdge) {
            graphEdgeIds.push(outputEdge.id);
          }
        }
      });
    }

    // For change chapter, highlight the change output
    if (currentChapter.id === 'change' && tx.vout.length > 1) {
      const changeIndex = tx.vout.length - 1;
      const changeAddress = tx.vout[changeIndex].address;
      if (changeAddress) {
        const addrNode = graphData.nodes.find((n) => n.data.address === changeAddress);
        if (addrNode) {
          graphNodeIds.push(addrNode.id);
        }
        const outputEdge = graphData.edges.find(
          (e) => e.type === 'output' && e.target === `addr:${changeAddress}`
        );
        if (outputEdge) {
          graphEdgeIds.push(outputEdge.id);
        }
      }
    }

    // For fee chapter, highlight transaction node
    if (currentChapter.id === 'fee') {
      graphNodeIds.push(`tx:${tx.txid}`);
    }

    onHighlightChange({
      tableRowIndexes,
      tableType,
      graphNodeIds,
      graphEdgeIds,
    });
  }, [currentChapter, tx, graphData, onHighlightChange]);

  if (!currentChapter) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Interactive Tour</h2>
        <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
          {currentChapterIndex + 1} / {totalChapters}
        </span>
      </div>

      <ChapterCard
        chapter={currentChapter}
        chapterNumber={currentChapterIndex + 1}
        totalChapters={totalChapters}
      />

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevChapter}
          disabled={isFirstChapter}
          className={
            isFirstChapter
              ? 'px-6 py-3 font-medium rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'px-6 py-3 font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors'
          }
        >
          ← Previous
        </button>

        <button
          onClick={nextChapter}
          disabled={isLastChapter}
          className={
            isLastChapter
              ? 'px-6 py-3 font-medium rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'px-6 py-3 font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
          }
        >
          Next →
        </button>
      </div>
    </div>
  );
}
