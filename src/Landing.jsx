import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Header with logo */}
        <div className="header">
          <div className="logo-section">
            <div className="logo-icon">⬢</div>
            <span className="logo-text">Nina</span>
            <span className="version-badge">v1.2</span>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <h1 className="main-title">Nina supports multiple blockchains</h1>
          <p className="subtitle">Choose a blockchain to get started.</p>
          
          <div className="blockchain-buttons">
            <button 
              className="blockchain-btn solana-btn"
              onClick={() => navigate('/solana')}
            >
              Solana
            </button>
            <button 
              className="blockchain-btn ethereum-btn"
              onClick={() => navigate('/ethereum')}
            >
              Ethereum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
