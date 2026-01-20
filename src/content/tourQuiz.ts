import type { QuizQuestion } from '@/components/Quiz';

export const tourQuizQuestions: QuizQuestion[] = [
  {
    question: 'What is a UTXO?',
    options: [
      'A type of Bitcoin address',
      'An unspent transaction output - a discrete piece of Bitcoin that can be spent',
      'A transaction fee',
      'A block in the blockchain',
    ],
    correctAnswer: 1,
    explanation: 'A UTXO (Unspent Transaction Output) is a discrete piece of Bitcoin that can be spent. When you receive Bitcoin, you receive a UTXO. When you spend Bitcoin, you consume UTXOs and create new ones.',
  },
  {
    question: 'Why does change happen in Bitcoin transactions?',
    options: [
      'Change is a fee paid to miners',
      'UTXOs must be fully spent, so if you want to send less than a UTXO\'s value, the difference is sent back as change',
      'Change is optional and only happens sometimes',
      'Change is lost Bitcoin',
    ],
    correctAnswer: 1,
    explanation: 'UTXOs must be fully spent - you cannot partially spend a UTXO. If you want to send less than the total value of your inputs, the difference is sent back to you as a change output to an address you control.',
  },
  {
    question: 'What are confirmations?',
    options: [
      'The number of times a transaction is verified',
      'Each time a transaction is included in a block, it gets one confirmation. More confirmations increase security',
      'The number of addresses that approve a transaction',
      'A fee paid to confirm a transaction faster',
    ],
    correctAnswer: 1,
    explanation: 'A confirmation occurs when a transaction is included in a block. Each subsequent block adds another confirmation. More confirmations increase the security and finality of a transaction, making it exponentially less likely to be reversed.',
  },
  {
    question: 'How are Bitcoin transaction fees calculated?',
    options: [
      'As a percentage of the amount being sent',
      'Based on transaction size (in bytes), not the amount being sent',
      'Fixed fee for all transactions',
      'Based on the number of addresses involved',
    ],
    correctAnswer: 1,
    explanation: 'Fees are calculated based on transaction size in virtual bytes (vbytes), not the amount being sent. Sending 0.001 BTC costs the same as sending 100 BTC if the transaction size is the same. Fees are measured in satoshis per virtual byte (sat/vB).',
  },
  {
    question: 'What is the mempool?',
    options: [
      'A type of Bitcoin wallet',
      'The pool of unconfirmed transactions waiting to be included in a block',
      'A storage location for Bitcoin',
      'A type of transaction',
    ],
    correctAnswer: 1,
    explanation: 'The mempool is the pool of unconfirmed transactions waiting to be included in a block. Transactions enter the mempool when broadcast to the network and leave when confirmed in a block. Transactions with higher fees are typically prioritized.',
  },
  {
    question: 'What is the blockchain?',
    options: [
      'A type of cryptocurrency',
      'A distributed ledger that records all Bitcoin transactions in chronological order',
      'A mining pool',
      'A Bitcoin wallet',
    ],
    correctAnswer: 1,
    explanation: 'The blockchain is a distributed ledger maintained by thousands of nodes worldwide. Each block contains transactions and a hash of the previous block, creating an immutable chain. This ensures all transactions are permanently recorded and cannot be altered.',
  },
  {
    question: 'What is mining?',
    options: [
      'Creating new Bitcoin addresses',
      'The process of validating transactions and creating new blocks through proof-of-work',
      'Sending Bitcoin to others',
      'Storing Bitcoin in a wallet',
    ],
    correctAnswer: 1,
    explanation: 'Mining is the process where miners compete to solve cryptographic puzzles to validate transactions and create new blocks. Successful miners receive block rewards (newly created Bitcoin) and transaction fees. This process secures the network.',
  },
];
