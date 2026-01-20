export interface ChapterHighlight {
  table?: 'inputs' | 'outputs';
  rowIndexes?: number[];
  graphNodes?: string[];
  graphEdges?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  bodyText: string;
  highlight?: ChapterHighlight;
  quizQuestion?: QuizQuestion;
}

export const txChapters: Chapter[] = [
  {
    id: 'intro',
    title: 'Introduction to Bitcoin Transactions',
    bodyText: 'A Bitcoin transaction is a transfer of value from one or more addresses to one or more other addresses. Each transaction consumes inputs (UTXOs) and creates new outputs. The difference between the total inputs and total outputs is the fee paid to miners.',
    highlight: undefined,
  },
  {
    id: 'inputs',
    title: 'Understanding Inputs',
    bodyText: 'Inputs are references to previous transaction outputs (UTXOs) that are being spent. Each input must reference a specific UTXO from a previous transaction. Inputs are consumed entirely - you cannot partially spend a UTXO. This is why change outputs are necessary.',
    highlight: {
      table: 'inputs',
      rowIndexes: [0, 1],
    },
  },
  {
    id: 'outputs',
    title: 'Understanding Outputs',
    bodyText: 'Outputs are new UTXOs created by the transaction. Each output specifies an amount in satoshis and a Bitcoin address. Outputs become spendable after the transaction is confirmed in a block. A transaction can have multiple outputs, allowing you to send to multiple recipients.',
    highlight: {
      table: 'outputs',
      rowIndexes: [0, 1, 2],
    },
  },
  {
    id: 'change',
    title: 'Change Outputs',
    bodyText: 'Since UTXOs must be fully spent, if you want to send less than the total value of your inputs, the difference is sent back to you as a change output. Change is sent to an address you control, typically a new address for privacy reasons.',
    highlight: {
      table: 'outputs',
      rowIndexes: [2], // Assuming change is the last output
    },
  },
  {
    id: 'fee',
    title: 'Transaction Fees',
    bodyText: 'The transaction fee is calculated as: total inputs - total outputs. Fees are paid to miners to include your transaction in a block. Higher fees generally result in faster confirmation times. Fees are measured in satoshis per virtual byte (sat/vB).',
    highlight: {
      graphNodes: ['fee'],
    },
  },
  {
    id: 'mempool',
    title: 'The Mempool',
    bodyText: 'Unconfirmed transactions wait in the mempool until a miner includes them in a block. Transactions with higher fees are typically prioritized. Once included in a block, the transaction is confirmed and leaves the mempool.',
    highlight: {
      graphNodes: ['mempool'],
    },
  },
  {
    id: 'confirmation',
    title: 'Confirmations',
    bodyText: 'A confirmation occurs when a transaction is included in a block. Each subsequent block adds another confirmation. More confirmations increase the security and finality of a transaction. Most services consider 1-6 confirmations sufficient, depending on the transaction value.',
    highlight: undefined,
  },
  {
    id: 'blockchain',
    title: 'The Blockchain',
    bodyText: 'The blockchain is a distributed ledger that records all Bitcoin transactions in chronological order. Each block contains a cryptographic hash of the previous block, creating an immutable chain. This chain is maintained by thousands of nodes worldwide, ensuring no single point of failure. Once a transaction is recorded in a block and added to the blockchain, it becomes part of a permanent, tamper-proof record.',
    highlight: undefined,
  },
  {
    id: 'mining',
    title: 'Mining and Block Creation',
    bodyText: 'Mining is the process of validating transactions and creating new blocks. Miners compete to solve a cryptographic puzzle called proof-of-work. The first miner to solve the puzzle gets to create the next block, receiving newly created Bitcoin (block reward) and transaction fees. This process secures the network and ensures transactions are valid. Mining difficulty adjusts every 2016 blocks to maintain an average block time of 10 minutes.',
    highlight: undefined,
  },
  {
    id: 'mining-rewards',
    title: 'Mining Rewards and Incentives',
    bodyText: 'Miners are incentivized through two types of rewards: block rewards (newly created Bitcoin) and transaction fees. Block rewards started at 50 BTC and halve approximately every 4 years. As block rewards decrease over time, transaction fees will become the primary incentive for miners. This economic model ensures the network remains secure and operational long-term.',
    highlight: undefined,
  },
  {
    id: 'bitcoin-history',
    title: 'Bitcoin History',
    bodyText: 'Bitcoin was created in 2008 by Satoshi Nakamoto (a pseudonym) and launched in 2009 with the mining of the genesis block. The first real-world transaction occurred in 2010 when 10,000 BTC was used to buy two pizzas. Since then, Bitcoin has grown from an experimental digital currency to a global financial asset, proving its resilience and value proposition.',
    highlight: undefined,
  },
  {
    id: 'supply-cap',
    title: 'The 21 Million Supply Cap',
    bodyText: 'Bitcoin has a hard supply cap of 21 million coins, enforced by the protocol. This limit cannot be changed without network-wide consensus. As of 2024, approximately 19.7 million Bitcoin have been mined. The final Bitcoin is expected around 2140. This fixed supply creates predictable scarcity, distinguishing Bitcoin from fiat currencies that can be printed indefinitely.',
    highlight: undefined,
  },
  {
    id: 'halving',
    title: 'Halving Events',
    bodyText: 'Approximately every 4 years (every 210,000 blocks), the block reward halves in an event called "the halving." This reduces the rate at which new Bitcoin enters circulation. Historical halvings: 2012 (50→25 BTC), 2016 (25→12.5 BTC), 2020 (12.5→6.25 BTC), 2024 (6.25→3.125 BTC). The halving creates a predictable, decreasing supply schedule that mimics the extraction of a finite resource.',
    highlight: undefined,
  },
];
