'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape, { type Core } from 'cytoscape';
import type { GraphData, GraphNode, GraphEdge } from '@/lib/graph/buildGraph';

interface GraphViewProps {
  graphData: GraphData;
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  onNodeClick?: (nodeId: string, nodeData: GraphNode) => void;
  learnMode?: boolean;
}

export function GraphView({
  graphData,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  onNodeClick,
  learnMode = false,
}: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [isFitted, setIsFitted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graphData.nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.label,
            type: node.type,
            ...node.data,
          },
        })),
        ...graphData.edges.map((edge) => ({
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            value_sats: edge.value_sats,
          },
        })),
      ],
      style: [
        {
          selector: 'node[type="tx"]',
          style: {
            'background-color': '#3b82f6',
            'label': 'data(label)',
            'width': 60,
            'height': 60,
            'shape': 'rectangle',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#ffffff',
            'font-size': '12px',
            'font-weight': 'bold',
            'border-width': 2,
            'border-color': '#1e40af',
          },
        },
        {
          selector: 'node[type="addr"]',
          style: {
            'background-color': '#10b981',
            'label': 'data(label)',
            'width': 50,
            'height': 50,
            'shape': 'ellipse',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#ffffff',
            'font-size': '10px',
            'border-width': 2,
            'border-color': '#059669',
          },
        },
        {
          selector: 'edge[type="input"]',
          style: {
            'width': 3,
            'line-color': '#ef4444',
            'target-arrow-color': '#ef4444',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': (ele: any) => {
              const value = ele.data('value_sats');
              return value ? `${(value / 100_000_000).toFixed(4)} BTC` : '';
            },
            'font-size': '10px',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
          },
        },
        {
          selector: 'edge[type="output"]',
          style: {
            'width': 3,
            'line-color': '#3b82f6',
            'target-arrow-color': '#3b82f6',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': (ele: any) => {
              const value = ele.data('value_sats');
              return value ? `${(value / 100_000_000).toFixed(4)} BTC` : '';
            },
            'font-size': '10px',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#fbbf24',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: graphData.nodes.filter((n) => n.type === 'tx').map((n) => n.id),
        spacingFactor: 1.5,
      },
    });

    cyRef.current = cy;

    // Fit to view on initial load
    if (!isFitted) {
      cy.fit(undefined, 50);
      setIsFitted(true);
    }

    // Handle node clicks
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeData = graphData.nodes.find((n) => n.id === node.id());
      if (nodeData && onNodeClick) {
        onNodeClick(node.id(), nodeData);
      }
    });

    // Highlight nodes and edges
    const highlightStyle = {
      'background-color': '#fbbf24',
      'border-color': '#f59e0b',
      'border-width': 4,
    };

    highlightedNodeIds.forEach((nodeId) => {
      const node = cy.getElementById(nodeId);
      if (node.length > 0) {
        node.style(highlightStyle);
      }
    });

    highlightedEdgeIds.forEach((edgeId) => {
      const edge = cy.getElementById(edgeId);
      if (edge.length > 0) {
        edge.style({
          'line-color': '#fbbf24',
          'width': 5,
        });
      }
    });

    return () => {
      cy.destroy();
    };
  }, [graphData, highlightedNodeIds, highlightedEdgeIds, onNodeClick, isFitted]);

  const handleFitToView = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 50);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Transaction Graph</h3>
        <button
          onClick={handleFitToView}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Fit to View
        </button>
      </div>
      <div
        ref={containerRef}
        className="w-full h-96 border border-gray-200 rounded-lg"
        style={{ minHeight: '400px' }}
      />
      <div className="mt-2 text-xs text-gray-500">
        <span className="inline-block w-3 h-3 bg-blue-600 rounded mr-1"></span>
        Transaction
        <span className="inline-block w-3 h-3 bg-green-500 rounded ml-4 mr-1"></span>
        Address
        <span className="inline-block w-3 h-3 bg-red-500 rounded ml-4 mr-1"></span>
        Input (→)
        <span className="inline-block w-3 h-3 bg-blue-500 rounded ml-4 mr-1"></span>
        Output (→)
      </div>
    </div>
  );
}
