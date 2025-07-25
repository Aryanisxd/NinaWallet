import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import SolanaPage from './SolanaPage';
import EthereumPage from './EthereumPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/solana" element={<SolanaPage />} />
        <Route path="/ethereum" element={<EthereumPage />} />
      </Routes>
    </Router>
  );
}

export default App
