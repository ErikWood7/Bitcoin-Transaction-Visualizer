import type { Tx, Vin, Vout } from '@/lib/types/btc';

export interface GraphNode {
  id: string;
  type: 'tx' | 'addr';
  label: string;
  data: {
    txid?: string;
    address?: string;
    value_sats?: number;
    total_in?: number;
    total_out?: number;
    fee_sats?: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'input' | 'output';
  value_sats: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Build a graph from transaction data
 * - tx node id: "tx:<txid>"
 * - addr node id: "addr:<address>"
 * - input edges: addr -> tx
 * - output edges: tx -> addr
 */
export function buildGraph(tx: Tx & { vin: Vin[]; vout: Vout[] }): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const addressNodes = new Map<string, GraphNode>();

  // Create transaction node
  const txNode: GraphNode = {
    id: `tx:${tx.txid}`,
    type: 'tx',
    label: `TX: ${tx.txid.substring(0, 8)}...`,
    data: {
      txid: tx.txid,
      fee_sats: tx.fee_sats,
    },
  };
  nodes.push(txNode);

  // Process inputs (addr -> tx)
  tx.vin.forEach((input, index) => {
    const address = input.prevout.address || `Unknown Input ${index}`;
    const addrId = `addr:${address}`;

    // Create or update address node
    if (!addressNodes.has(addrId)) {
      const addrNode: GraphNode = {
        id: addrId,
        type: 'addr',
        label: address.length > 20 ? `${address.substring(0, 10)}...${address.substring(address.length - 8)}` : address,
        data: {
          address,
          total_out: 0,
          total_in: 0,
        },
      };
      addressNodes.set(addrId, addrNode);
      nodes.push(addrNode);
    }

    const addrNode = addressNodes.get(addrId)!;
    addrNode.data.total_out = (addrNode.data.total_out || 0) + input.prevout.value_sats;

    // Create input edge (addr -> tx)
    edges.push({
      id: `edge-input-${index}`,
      source: addrId,
      target: `tx:${tx.txid}`,
      type: 'input',
      value_sats: input.prevout.value_sats,
    });
  });

  // Process outputs (tx -> addr)
  tx.vout.forEach((output, index) => {
    const address = output.address || `Unknown Output ${index}`;
    const addrId = `addr:${address}`;

    // Create or update address node
    if (!addressNodes.has(addrId)) {
      const addrNode: GraphNode = {
        id: addrId,
        type: 'addr',
        label: address.length > 20 ? `${address.substring(0, 10)}...${address.substring(address.length - 8)}` : address,
        data: {
          address,
          total_out: 0,
          total_in: 0,
        },
      };
      addressNodes.set(addrId, addrNode);
      nodes.push(addrNode);
    }

    const addrNode = addressNodes.get(addrId)!;
    addrNode.data.total_in = (addrNode.data.total_in || 0) + output.value_sats;

    // Create output edge (tx -> addr)
    edges.push({
      id: `edge-output-${index}`,
      source: `tx:${tx.txid}`,
      target: addrId,
      type: 'output',
      value_sats: output.value_sats,
    });
  });

  return { nodes, edges };
}
