import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ShieldCheck, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { api } from '../api';
import './screens.css';

const Wallet = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ total: 0, deposit: 0, winnings: 0 });

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await api.getPassbook();
        if (data && data.transactions) {
          let total = 0;
          data.transactions.forEach(t => {
            if (t.type === 'credit') total += Number(t.amount);
            if (t.type === 'debit') total -= Number(t.amount);
          });
          setBalance({ total, deposit: total, winnings: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch passbook', error);
      }
    };
    fetchWallet();
  }, []);

  return (
    <div className="page-transition">
      <Header title="Wallet" />

      <div className="wallet-card" style={{ borderBottom: 'none' }}>
        <div className="wallet-icon-header">
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#2a2a4a', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>👛</span>
          </div>
          <div>
            <div className="wallet-total-label" style={{ marginBottom: '4px' }}>TOTAL WALLET BALANCE</div>
            <div className="wallet-total-amount" style={{ marginBottom: '0' }}>₹{balance.total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div className="wallet-row" style={{ marginTop: '16px' }}>
          <div className="wallet-row-info">
            <h4>DEPOSIT BALANCE</h4>
            <p>₹{balance.deposit.toFixed(2)}</p>
          </div>
          <Button variant="primary" style={{ padding: '8px 16px', width: 'auto', fontSize: '14px' }} onClick={() => navigate('/add-money')}>Add Money</Button>
        </div>
        
        <div className="wallet-row">
          <div className="wallet-row-info">
            <h4>WINNINGS</h4>
            <p>₹{balance.winnings.toFixed(2)}</p>
          </div>
          <Button variant="outline" style={{ padding: '8px 16px', width: 'auto', fontSize: '14px' }} onClick={() => navigate('/withdraw')}>Withdraw</Button>
        </div>
      </div>

      <div className="menu-list" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="menu-item" onClick={() => navigate('/withdraw?view=passbook')}>
          <div className="menu-item-left">
            <Book size={20} className="menu-item-icon" />
            <span className="menu-item-text">Passbook</span>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </div>
        
        <div className="menu-item" style={{ borderBottom: 'none' }} onClick={() => navigate('/kyc')}>
          <div className="menu-item-left">
            <ShieldCheck size={20} className="menu-item-icon" />
            <span className="menu-item-text">KYC Verification</span>
          </div>
          <span className="menu-item-badge">Verified <ChevronRight size={16} color="var(--text-secondary)" style={{ verticalAlign: 'middle' }} /></span>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
