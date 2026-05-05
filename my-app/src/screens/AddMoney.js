import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../api';
import './screens.css';

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);

  const amounts = [30, 50, 75, 100, 150];

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    try {
      setLoading(true);
      await api.addMoney(Number(amount));
      alert('Money added successfully!');
      setAmount('');
    } catch (error) {
      alert('Failed to add money: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition">
      <Header title="Add Money" showWallet={true} walletBalance="5.90" />

      <div className="add-money-container">
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>SELECT AMOUNT</div>
        
        <div className="amount-grid">
          {amounts.map((amt) => (
            <div 
              key={amt} 
              className="amount-btn" 
              onClick={() => setAmount(amt.toString())}
            >
              ₹{amt}
            </div>
          ))}
        </div>

        <Input 
          placeholder="Enter amount" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginBottom: '24px' }}
        />

        <Button onClick={handleAddMoney} disabled={loading}>
          {loading ? 'Processing...' : 'Proceed to Pay →'}
        </Button>

        <div className="promo-section">
          <div className="promo-title">Apply Promo Code</div>
          
          <div className="promo-input-group">
            <input 
              type="text" 
              placeholder="Enter promo code here" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button variant="secondary" style={{ padding: '6px 12px', width: 'auto', fontSize: '12px', border: 'none' }}>Apply</Button>
          </div>

          <div className="promo-card">
            <div className="promo-card-header">
              <span className="promo-tag">JEETBONUS</span>
              <Button variant="primary" style={{ padding: '6px 16px', width: 'auto', fontSize: '12px' }}>Apply</Button>
            </div>
            
            <div className="promo-desc">
              <Tag size={16} />
              <span>Get 100% Cashback upto ₹5000 in Bonus wallet.</span>
            </div>
            
            <div className="promo-footer">
              <span>Min Deposit : ₹5000</span>
              <span>Valid: 2 times per user.</span>
            </div>
          </div>

          <div className="promo-card">
            <div className="promo-card-header">
              <span className="promo-tag">JEETBONUS</span>
              <Button variant="primary" style={{ padding: '6px 16px', width: 'auto', fontSize: '12px' }}>Apply</Button>
            </div>
            
            <div className="promo-desc">
              <Tag size={16} />
              <span>Get 100% Cashback upto ₹5000 in Bonus wallet.</span>
            </div>
            
            <div className="promo-footer">
              <span>Min Deposit : ₹5000</span>
              <span>Valid: 2 times per user.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoney;
