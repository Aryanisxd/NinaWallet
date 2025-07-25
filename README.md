# NinaWallet

NinaWallet is a multi-blockchain wallet web application built with React and Vite. It allows users to generate, view, and manage wallets for both Solana and Ethereum blockchains directly in the browser. The app is non-custodial and stores sensitive data only in the user's local storage.

## Features

- **Multi-Blockchain Support:**
  - Generate and manage wallets for Solana and Ethereum.
- **Mnemonic/Seed Phrase Generation:**
  - Securely generate and display a BIP39 mnemonic for each blockchain.
- **HD Wallets:**
  - Create multiple wallets per blockchain using hierarchical deterministic (HD) derivation paths.
- **Private Key Management:**
  - View (toggle visibility) and delete private keys for each wallet.
- **Local Storage:**
  - All wallet data is stored locally in the browser; nothing is sent to a server.
- **Modern UI:**
  - Responsive, dark-mode friendly, and accessible design.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Ninawallet
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Build for Production
```bash
npm run build
```
The production-ready files will be in the `dist/` directory.

### Linting
```bash
npm run lint
```

## Usage

- On the landing page, select either **Solana** or **Ethereum** to manage wallets for that blockchain.
- Click **Generate Wallet** to create a new wallet. The app will generate a mnemonic (if not already present) and derive a new wallet using the next available index.
- View your wallets, copy addresses, and toggle the visibility of private keys.
- Delete wallets as needed. If all wallets are deleted, the mnemonic and all wallet data for that blockchain are removed from local storage, and you are redirected to the home page.

## Tech Stack
- **Frontend:** React 19, Vite
- **Routing:** react-router-dom v7
- **Solana:** @solana/web3.js, ed25519-hd-key, tweetnacl, bs58
- **Ethereum:** ethers v6, bip39
- **Styling:** Custom CSS (responsive, dark mode support)

## Project Structure

```
Ninawallet/
  ├── public/
  │   └── vite.svg           # Favicon
  ├── src/
  │   ├── App.jsx           # Main app with routing
  │   ├── Landing.jsx       # Landing page
  │   ├── SolanaPage.jsx    # Solana wallet management
  │   ├── EthereumPage.jsx  # Ethereum wallet management
  │   ├── WalletPage.css    # Wallet UI styles
  │   ├── Landing.css       # Landing page styles
  │   ├── App.css           # App-level styles
  │   ├── index.css         # Global styles
  │   └── assets/
  │       └── react.svg     # React logo asset
  ├── index.html            # HTML entry point
  ├── package.json          # Project metadata and dependencies
  ├── vite.config.js        # Vite configuration
  └── eslint.config.js      # ESLint configuration
```

## Security Notice
- **Never share your mnemonic or private keys.**
- All sensitive data is stored only in your browser's local storage. Clearing your browser data will permanently delete your wallets.

## License
MIT
