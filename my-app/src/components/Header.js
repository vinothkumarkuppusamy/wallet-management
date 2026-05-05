import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import './components.css';

const Header = ({ title, showWallet = false, walletBalance = '0.00', onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="header-container">
      <button className="back-btn" onClick={handleBack}>
        <ArrowLeft size={24} />
      </button>
      <div className="header-title">{title}</div>
      {showWallet ? (
        <div className="wallet-chip">
          <Wallet size={16} color="var(--accent-gold)" />
          <span>₹{walletBalance}</span>
        </div>
      ) : (
        <div style={{ width: 24 }}></div> /* Placeholder to balance the flex layout */
      )}
    </div>
  );
};

export default Header;
