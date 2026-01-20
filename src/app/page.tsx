import { FormatDemo } from '@/components/FormatDemo';
import { SearchBar } from '@/components/SearchBar';
import { AutoLinkGlossary } from '@/components/AutoLinkGlossary';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Bitcoin Transaction Visualizer
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        An educational tool to understand how Bitcoin transactions work.
      </p>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Search Transaction or Address
        </h2>
        <SearchBar />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome
        </h2>
        <p className="text-gray-700 leading-relaxed">
          <AutoLinkGlossary text="This is a learning tool designed to help you understand Bitcoin transactions, UTXOs, fees, and the blockchain. Each transaction consumes inputs (UTXOs) and creates outputs. The difference between inputs and outputs is the fee paid to miners. Transactions wait in the mempool until they are confirmed in a block. Use the navigation above to explore different sections, or toggle Learn Mode for guided explanations." />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About the Blockchain</h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            <AutoLinkGlossary text="The blockchain is a distributed ledger that records all Bitcoin transactions in chronological order. Each block contains a cryptographic hash of the previous block, creating an immutable chain. This chain is maintained by thousands of nodes worldwide, ensuring decentralization and security. Once a transaction is recorded in a block, it becomes part of a permanent, tamper-proof record." />
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About Mining</h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            <AutoLinkGlossary text="Mining is the process of validating transactions and creating new blocks. Miners compete to solve a cryptographic puzzle called proof-of-work. The first miner to solve the puzzle creates the next block and receives newly created Bitcoin (block reward) and transaction fees. This process secures the network and ensures transactions are valid. Mining difficulty adjusts to maintain an average block time of 10 minutes." />
          </p>
        </div>
      </div>

      <FormatDemo />
    </div>
  );
}
