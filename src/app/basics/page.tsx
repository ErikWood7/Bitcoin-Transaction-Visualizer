'use client';

import { AutoLinkGlossary } from '@/components/AutoLinkGlossary';

export default function BasicsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Bitcoin Basics</h1>
      <p className="text-lg text-gray-600 mb-8">
        Essential information about Bitcoin's history, structure, and fundamentals.
      </p>

      {/* History Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">History of Bitcoin</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2008 - The Whitepaper</h3>
            <p className="leading-relaxed">
              On October 31, 2008, a person or group using the pseudonym <strong>Satoshi Nakamoto</strong> published 
              the Bitcoin whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System." This document outlined 
              a solution to the double-spending problem without requiring a trusted third party.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2009 - Genesis Block</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="On January 3, 2009, the genesis block (block 0) was mined, marking the birth of Bitcoin. The genesis block contained a hidden message referencing a financial crisis headline, establishing Bitcoin's purpose as an alternative to traditional banking systems." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2010 - First Real-World Transaction</h3>
            <p className="leading-relaxed">
              On May 22, 2010, Laszlo Hanyecz paid 10,000 BTC for two pizzas, marking the first documented real-world 
              Bitcoin transaction. This day is now celebrated as "Bitcoin Pizza Day."
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2010-2011 - Early Growth</h3>
            <p className="leading-relaxed">
              Bitcoin gained attention from cryptography enthusiasts and early adopters. Satoshi Nakamoto remained active 
              in the community until 2011, then disappeared, leaving Bitcoin to develop organically.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2012-Present - Mainstream Adoption</h3>
            <p className="leading-relaxed">
              Bitcoin has grown from a niche experiment to a global financial asset. Major institutions, corporations, and 
              countries have adopted or recognized Bitcoin. The network has processed billions of dollars in transactions 
              and proven its resilience through various challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Supply and Economics */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bitcoin Supply and Economics</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">21 Million Supply Cap</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="Bitcoin has a hard supply cap of 21 million coins. This limit is enforced by the protocol and cannot be changed without network-wide consensus. As of 2024, approximately 19.7 million Bitcoin have been mined. The final Bitcoin is expected to be mined around the year 2140." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Halving Events</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="Approximately every 4 years (every 210,000 blocks), the block reward halves. This event is called 'the halving.' Historical halvings occurred in 2012 (50→25 BTC), 2016 (25→12.5 BTC), 2020 (12.5→6.25 BTC), and 2024 (6.25→3.125 BTC). This creates a predictable, decreasing supply schedule that mimics the extraction of a finite resource." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Current Supply Statistics</h3>
            <div className="bg-gray-50 rounded-lg p-4 mt-2">
              <ul className="space-y-2 text-sm">
                <li><strong>Total Supply Cap:</strong> 21,000,000 BTC</li>
                <li><strong>Currently Mined:</strong> ~19,700,000 BTC (as of 2024)</li>
                <li><strong>Remaining to Mine:</strong> ~1,300,000 BTC</li>
                <li><strong>Current Block Reward:</strong> 3.125 BTC per block</li>
                <li><strong>Next Halving:</strong> ~2028 (estimated)</li>
                <li><strong>Final Bitcoin:</strong> ~2140 (estimated)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rigid Structure */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bitcoin's Rigid Structure</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Fixed Protocol Rules</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="Bitcoin operates on a fixed set of protocol rules that are extremely difficult to change. These rules include: 21 million supply cap, 10-minute average block time, 1 MB base block size (with SegWit increasing effective capacity), difficulty adjustment every 2016 blocks, and halving every 210,000 blocks. Changes require overwhelming network consensus, making Bitcoin resistant to arbitrary modifications." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Why Rigidity Matters</h3>
            <p className="leading-relaxed">
              Bitcoin's rigid structure provides predictability and security. Users can trust that the rules won't change 
              arbitrarily, and the fixed supply creates scarcity. This rigidity is a feature, not a bug - it ensures 
              Bitcoin remains decentralized and resistant to manipulation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Consensus Mechanism</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="Changes to Bitcoin's protocol require consensus from nodes, miners, and users. This makes the network resistant to capture by any single entity. The consensus mechanism ensures that Bitcoin remains decentralized and that no one can unilaterally change the rules." />
            </p>
          </div>
        </div>
      </div>

      {/* Wallets Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bitcoin Wallets</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What is a Wallet?</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="A Bitcoin wallet is a tool that stores your private keys and allows you to interact with the Bitcoin network. Important: wallets don't store Bitcoin itself - Bitcoin exists only on the blockchain. Your wallet stores the private keys needed to access and spend your Bitcoin. Think of it like a keychain that holds the keys to your Bitcoin addresses." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How Wallets Work</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="Wallets generate and manage private keys, which are used to create digital signatures for transactions. When you receive Bitcoin, it's recorded on the blockchain at an address derived from your public key. Your wallet uses your private key to prove ownership and authorize spending. The wallet also tracks your balance by scanning the blockchain for transactions involving your addresses." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Types of Wallets</h3>
            <div className="space-y-3 mt-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Hardware Wallets</h4>
                <p className="text-blue-800 text-sm">
                  <AutoLinkGlossary text="Physical devices that store private keys offline. Examples: Ledger, Trezor, Coldcard. Best for: Long-term storage, large amounts. Security: Highest - keys never exposed to internet-connected devices." />
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Software Wallets</h4>
                <p className="text-green-800 text-sm">
                  <AutoLinkGlossary text="Applications installed on computers or mobile devices. Examples: Electrum, BlueWallet, Exodus. Best for: Regular use, smaller amounts. Security: Medium - keys stored on internet-connected device." />
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Mobile Wallets</h4>
                <p className="text-purple-800 text-sm">
                  <AutoLinkGlossary text="Smartphone apps for Bitcoin. Examples: BlueWallet, Breez, Muun. Best for: Daily transactions, small amounts. Security: Medium - convenient but keys on mobile device." />
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Paper Wallets</h4>
                <p className="text-orange-800 text-sm">
                  <AutoLinkGlossary text="Physical printouts of private keys and addresses. Best for: Long-term cold storage. Security: High if generated offline, but vulnerable to physical damage or loss. Not recommended for beginners." />
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Seed Phrases and Recovery</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="Most modern wallets generate a seed phrase (also called a recovery phrase or mnemonic) - typically 12 or 24 words. This seed phrase can regenerate all your private keys. If you lose your wallet but have your seed phrase, you can recover access to your Bitcoin. Never share your seed phrase with anyone - it gives complete control over your Bitcoin." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Wallet Security Best Practices</h3>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Backup your seed phrase:</strong> Write it down and store it securely offline</li>
              <li><strong>Never share private keys or seed phrases:</strong> Anyone with these can steal your Bitcoin</li>
              <li><strong>Use hardware wallets for large amounts:</strong> They provide the best security</li>
              <li><strong>Verify addresses:</strong> Always double-check addresses before sending</li>
              <li><strong>Keep software updated:</strong> Wallet updates often include security improvements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exchanges Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bitcoin Exchanges</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What is an Exchange?</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="A Bitcoin exchange is a platform that allows you to buy, sell, or trade Bitcoin for fiat currency (like USD) or other cryptocurrencies. Exchanges act as intermediaries, matching buyers and sellers and facilitating transactions. Popular examples include Coinbase, Kraken, and Binance." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How Exchanges Work</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="When you deposit Bitcoin or fiat currency to an exchange, the exchange holds it in their custody. You trade within the exchange's system, and the exchange manages the actual Bitcoin transfers. Exchanges maintain order books showing buy and sell orders, and they match trades based on price and volume. When you withdraw, the exchange sends Bitcoin from their wallet to your address." />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Custodial vs Non-Custodial</h3>
            <div className="space-y-3 mt-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Custodial Exchanges (Most Common)</h4>
                <p className="text-yellow-800 text-sm mb-2">
                  The exchange holds your Bitcoin in their wallets. You don't control the private keys.
                </p>
                <p className="text-yellow-800 text-sm">
                  <strong>Pros:</strong> Easy to use, instant trading, customer support<br/>
                  <strong>Cons:</strong> "Not your keys, not your coins" - exchange controls your Bitcoin, risk of hacks or closure
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Non-Custodial Exchanges</h4>
                <p className="text-green-800 text-sm mb-2">
                  You maintain control of your private keys. Trades happen peer-to-peer or through smart contracts.
                </p>
                <p className="text-green-800 text-sm">
                  <strong>Pros:</strong> You control your Bitcoin, more decentralized<br/>
                  <strong>Cons:</strong> More complex, less liquidity, you're responsible for security
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Exchange vs Wallet</h3>
            <p className="leading-relaxed">
              <AutoLinkGlossary text="Exchanges are for trading Bitcoin, while wallets are for storing and managing your Bitcoin. When you buy Bitcoin on an exchange, it's stored in the exchange's wallet. For security, many users transfer Bitcoin from exchanges to their own wallets (especially hardware wallets) for long-term storage. This follows the principle: 'Not your keys, not your coins.'" />
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Risks and Considerations</h3>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Exchange hacks:</strong> Exchanges can be hacked, resulting in loss of user funds</li>
              <li><strong>Regulatory risk:</strong> Exchanges can be shut down or restricted by governments</li>
              <li><strong>Counterparty risk:</strong> You're trusting the exchange to honor withdrawals</li>
              <li><strong>KYC/AML:</strong> Most exchanges require identity verification</li>
              <li><strong>Fees:</strong> Exchanges charge trading fees and withdrawal fees</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices for Using Exchanges</h3>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Use reputable exchanges:</strong> Research security history and regulatory compliance</li>
              <li><strong>Enable two-factor authentication:</strong> Add an extra layer of security</li>
              <li><strong>Don't store large amounts:</strong> Only keep what you need for trading on exchanges</li>
              <li><strong>Withdraw to your wallet:</strong> Transfer Bitcoin to your own wallet for long-term storage</li>
              <li><strong>Understand fees:</strong> Be aware of trading fees, withdrawal fees, and spread</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Characteristics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Characteristics of Bitcoin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Decentralized</h3>
            <p className="text-blue-800 text-sm">
              No central authority controls Bitcoin. The network is maintained by thousands of independent nodes worldwide.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Fixed Supply</h3>
            <p className="text-green-800 text-sm">
              Maximum of 21 million Bitcoin will ever exist. This creates predictable scarcity.
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">Immutable</h3>
            <p className="text-purple-800 text-sm">
              Once confirmed, transactions cannot be reversed or altered. The blockchain is permanent.
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">Transparent</h3>
            <p className="text-orange-800 text-sm">
              All transactions are public on the blockchain. Anyone can verify the network's state.
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">Censorship Resistant</h3>
            <p className="text-red-800 text-sm">
              No one can prevent you from sending or receiving Bitcoin. Transactions cannot be blocked.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Programmable</h3>
            <p className="text-yellow-800 text-sm">
              Bitcoin supports smart contracts and programmable money through its scripting language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
