# Bitcoin Transaction Visualizer

An educational web application for visualizing and understanding Bitcoin transactions. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Transaction Explorer**: Search and visualize Bitcoin transactions by TXID or address
- 📊 **Interactive Graph**: Visualize transaction flow with a bipartite graph showing inputs, outputs, and relationships
- 📚 **Educational Tour**: Guided tour through Bitcoin transaction concepts
- 🎮 **Playground**: Build and simulate transactions to understand how they work
- 📖 **Glossary**: Comprehensive glossary of Bitcoin terms with tooltips
- 💡 **Myths & Facts**: Common Bitcoin misconceptions explained
- 📈 **Live Price Ticker**: Real-time Bitcoin price with 24-hour chart
- 🔒 **Security**: Rate limiting, input validation, and secure API handling

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Graph Visualization**: Cytoscape.js
- **Data Sources**: Mempool.space API, CoinGecko API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd BTCtransactionVisulaizer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```bash
# Use mock data for development (set to "1" to enable)
USE_MOCK_DATA=0
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/        # React components
├── lib/              # Utilities and helpers
│   ├── api/          # API client
│   ├── btcProviders/ # Bitcoin data providers
│   ├── graph/        # Graph visualization logic
│   └── playground/   # Playground simulation
└── content/          # Static content (glossary, chapters, etc.)
```

## Features Overview

### Transaction Visualization
- View transaction details including inputs, outputs, and fees
- Interactive graph showing transaction flow
- Learn Mode for educational labels
- Math verification showing fee calculations

### Educational Content
- Interactive tour with chapters on Bitcoin concepts
- Auto-linking glossary terms throughout the app
- Quiz system to test knowledge
- Myths page debunking common misconceptions

### Playground
- Build simulated transactions
- Select UTXO scenarios
- Adjust fee rates
- See how transactions are constructed

## API Routes

- `/api/tx/[txid]` - Fetch transaction data
- `/api/address/[addr]` - Fetch address summary
- `/api/address/[addr]/txs` - Fetch address transactions
- `/api/btc-price` - Get current Bitcoin price
- `/api/btc-price-history` - Get price history for chart

## Security

- Rate limiting on all API routes
- Input validation and sanitization
- Protection against SQL injection, XSS, and command injection
- See [SECURITY.md](./SECURITY.md) for more details

## Environment Variables

- `USE_MOCK_DATA`: Set to `"1"` to use mock data instead of real API calls (useful for development/testing)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Bitcoin data provided by [Mempool.space](https://mempool.space)
- Price data provided by [CoinGecko](https://www.coingecko.com)
- Built with [Next.js](https://nextjs.org)
