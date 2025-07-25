import { useState, useEffect } from 'react';
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { useNavigate } from 'react-router-dom';
import './WalletPage.css';

function SolanaPage() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState(new Set());
  const [walletsExisted, setWalletsExisted] = useState(false);
  const navigate = useNavigate();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMnemonic = localStorage.getItem('solana-mnemonic');
    const savedWallets = localStorage.getItem('solana-wallets');
    const savedCurrentIndex = localStorage.getItem('solana-currentIndex');
    
    if (savedMnemonic) {
      setMnemonic(savedMnemonic);
    }
    
    if (savedWallets) {
      const parsedWallets = JSON.parse(savedWallets);
      setWallets(parsedWallets);
      if (parsedWallets.length > 0) {
        setWalletsExisted(true);
      }
    }
    
    if (savedCurrentIndex) {
      setCurrentIndex(parseInt(savedCurrentIndex));
    }
  }, []);

  // Track when wallets exist
  useEffect(() => {
    if (wallets.length > 0) {
      setWalletsExisted(true);
    }
  }, [wallets.length]);

  // Auto-redirect when all wallets are deleted
  useEffect(() => {
    let timer;
    // Only redirect if we had wallets before and now have none
    if (walletsExisted && wallets.length === 0 && !isRedirecting) {
      setIsRedirecting(true);
      timer = setTimeout(() => {
        // Reset all states and navigate
        setMnemonic("");
        setCurrentIndex(0);
        setWalletsExisted(false);
        setIsRedirecting(false);
        navigate('/', { replace: true });
      }, 3000);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [walletsExisted, wallets.length, isRedirecting, navigate]);

  const generateWallet = async () => {
    let seedPhrase = mnemonic;
    
    // Generate mnemonic only if it doesn't exist
    if (!seedPhrase) {
      seedPhrase = await generateMnemonic();
      setMnemonic(seedPhrase);
      // Save mnemonic to localStorage
      localStorage.setItem('solana-mnemonic', seedPhrase);
    }
    
    const seed = mnemonicToSeed(seedPhrase);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    
    const newWallet = {
      id: Date.now() + Math.random(), // Unique ID
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
      index: currentIndex
    };
    
    const updatedWallets = [...wallets, newWallet];
    const newCurrentIndex = currentIndex + 1;
    
    setWallets(updatedWallets);
    setCurrentIndex(newCurrentIndex);
    setIsRedirecting(false); // Reset redirecting state when new wallet is added
    
    // Save to localStorage
    localStorage.setItem('solana-wallets', JSON.stringify(updatedWallets));
    localStorage.setItem('solana-currentIndex', newCurrentIndex.toString());
  };

  const deleteWallet = (walletId) => {
    const updatedWallets = wallets.filter(wallet => wallet.id !== walletId);
    setWallets(updatedWallets);
    // Remove from visible private keys set when wallet is deleted
    const newVisibleKeys = new Set(visiblePrivateKeys);
    newVisibleKeys.delete(walletId);
    setVisiblePrivateKeys(newVisibleKeys);
    
    // Update localStorage
    localStorage.setItem('solana-wallets', JSON.stringify(updatedWallets));
    
    // If this was the last wallet, start the redirect process and clean up localStorage
    if (updatedWallets.length === 0 && walletsExisted) {
      setIsRedirecting(true);
      setTimeout(() => {
        // Clean up localStorage
        localStorage.removeItem('solana-mnemonic');
        localStorage.removeItem('solana-wallets');
        localStorage.removeItem('solana-currentIndex');
        
        // Reset state
        setMnemonic("");
        setCurrentIndex(0);
        setWalletsExisted(false);
        setIsRedirecting(false);
        window.location.href = '/';
      }, 3000);
    }
  };

  const togglePrivateKeyVisibility = (walletId) => {
    const newVisibleKeys = new Set(visiblePrivateKeys);
    if (newVisibleKeys.has(walletId)) {
      newVisibleKeys.delete(walletId);
    } else {
      newVisibleKeys.add(walletId);
    }
    setVisiblePrivateKeys(newVisibleKeys);
  };

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Solana Wallet</h1>
      </div>
      
      <div className="wallet-content">
        <div className="mnemonic-section">
          <button 
            className="generate-btn"
            onClick={generateWallet}
          >
            Generate Wallet
          </button>
          
          {mnemonic && (
            <div className="mnemonic-display">
              <label>Your Seed Phrase:</label>
              <input 
                type="text" 
                value={mnemonic} 
                readOnly 
                className="mnemonic-input"
              />
            </div>
          )}
        </div>
        
        {/* Wallets Display */}
        {wallets.length > 0 && (
          <div className="wallets-container">
            <h3>Your Wallets ({wallets.length})</h3>
            {wallets.map((wallet, index) => (
              <div key={wallet.id} className="wallet-item">
                <div className="wallet-info">
                  <div className="wallet-label">Wallet {index + 1}</div>
                  <div className="wallet-address">
                    <strong>Public Key:</strong> {wallet.publicKey}
                  </div>
                  <div className="wallet-private-key">
                    <strong>Private Key:</strong> 
                    <span className="private-key-value">
                      {visiblePrivateKeys.has(wallet.id) 
                        ? wallet.privateKey 
                        : '•'.repeat(40)
                      }
                    </span>
                    <button 
                      className="eye-btn"
                      onClick={() => togglePrivateKeyVisibility(wallet.id)}
                      title={visiblePrivateKeys.has(wallet.id) ? 'Hide private key' : 'Show private key'}
                    >
                      {visiblePrivateKeys.has(wallet.id) ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => deleteWallet(wallet.id)}
                  title="Delete wallet"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Redirect Message */}
        {isRedirecting && (
          <div className="redirect-message">
            <p>All wallets deleted. Redirecting to home page in 3 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SolanaPage;
