import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../api';
import './screens.css';

const Withdraw = () => {
  const location = useLocation();
  const [view, setView] = useState('withdraw'); // withdraw or passbook view
  const [activeTab, setActiveTab] = useState('passbook');
  const [amount, setAmount] = useState('');
  const [expandedTx, setExpandedTx] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState({ total: 0 });
  const [summary, setSummary] = useState({ total_transactions: 0, total_credit: 0, total_debit: 0 });

  const fetchWallet = async () => {
    try {
      const data = await api.getPassbook();
      if (data && data.transactions) {
        setTransactions(data.transactions);
        setSummary(data.summary || { total_transactions: 0, total_credit: 0, total_debit: 0 });

        let total = 0;
        data.transactions.forEach(t => {
          if (t.type === 'credit') total += Number(t.amount);
          if (t.type === 'debit') total -= Number(t.amount);
        });
        setBalance({ total });
      }
    } catch (error) {
      console.error('Failed to fetch passbook', error);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('view') === 'passbook') {
      setView('passbook');
      setActiveTab('passbook');
    }
  }, [location.search]);

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    try {
      setLoading(true);
      await api.withdrawMoney(Number(amount));
      alert('Money withdrawn successfully!');
      setAmount('');
      fetchWallet();
    } catch (error) {
      alert('Failed to withdraw money: Insufficient balance');
    } finally {
      setLoading(false);
    }
  };

  const groupTransactionsByDate = (items) => {
    return items.reduce((groups, tx) => {
      const dateKey = new Date(tx.created_at).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
      return groups;
    }, {});
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  const getTransactionTitle = (tx) => tx.type === 'credit' ? 'Rummy Winnings' : 'Rummy Winnings';
  const getTransactionSubtitle = (tx) => tx.type === 'credit' ? 'Credited to Wallet' : 'Debited from Wallet';

  return (
    <div className="page-transition">
      <Header
        title={view === 'withdraw' ? 'Withdraw' : 'Passbook'}
        showWallet={view !== 'withdraw'}
        walletBalance={balance.total.toFixed(2)}
      />

      {view === 'withdraw' ? (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>REDEEMABLE BALANCE</span>
            <span style={{ fontWeight: '700', fontSize: '18px' }}>₹{balance.total.toFixed(2)}</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Input
              label="Redeem Amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '-16px' }}>Min redeemable amount is ₹100</p>
          </div>

          <Button onClick={handleWithdraw} disabled={loading}>
            {loading ? 'Processing...' : 'Withdraw Money →'}
          </Button>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <span style={{ color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '14px' }} onClick={() => setView('passbook')}>View Passbook</span>
          </div>
        </div>
      ) : (
        <div className="passbook-page">
          <div className="passbook-top-row">
            <div>
              <div className="passbook-summary-label">Passbook</div>
              <div className="passbook-summary-value">₹{balance.total.toFixed(2)}</div>
            </div>
            <div className="wallet-chip" style={{ cursor: 'pointer' }} onClick={() => setView('withdraw')}>
              <Wallet size={16} color="var(--accent-gold)" />
              <span>₹{balance.total.toFixed(2)}</span>
              <Plus size={16} style={{ marginLeft: '8px' }} />
            </div>
          </div>

          <div className="tabs-header">
            <div className={`tab ${activeTab === 'passbook' ? 'active' : ''}`} onClick={() => setActiveTab('passbook')}>Passbook</div>
            <div className={`tab ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</div>
          </div>

          <div className="transactions-list">
            {activeTab === 'passbook' ? (
              Object.entries(groupedTransactions).map(([date, items]) => (
                <div key={date} className="transaction-group">
                  <div className="transaction-date">{date}</div>
                  {items.map((tx) => (
                    <React.Fragment key={tx.id}>
                      <div className="transaction-item" onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}>
                        <div className="transaction-info">
                          <Wallet size={20} className="transaction-icon" />
                          <div>
                            <div className="transaction-title">{getTransactionTitle(tx)}</div>
                            <div className="transaction-subtitle">{getTransactionSubtitle(tx)}</div>
                          </div>
                        </div>
                        <div className={`transaction-amount ${tx.type === 'debit' ? 'amount-negative' : 'amount-positive'}`}>
                          {tx.type === 'debit' ? '-' : '+'} ₹{tx.amount}
                          <span className="transaction-toggle-icon">
                            {expandedTx === tx.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        </div>
                      </div>

                      {expandedTx === tx.id && (
                        <div className="transaction-details">
                          <div className="detail-row">
                            <div className="detail-label">Transaction ID</div>
                            <div className="detail-value">{tx.id}</div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-label">Date & Time</div>
                            <div className="detail-value">{new Date(tx.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="transaction-item no-expand">
                  <div className="transaction-info">
                    <Wallet size={20} className="transaction-icon" />
                    <div>
                      <div className="transaction-title">{tx.type === 'credit' ? 'Credit' : 'Debit'}</div>
                      <div className="transaction-subtitle">{new Date(tx.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className={`transaction-amount ${tx.type === 'debit' ? 'amount-negative' : 'amount-positive'}`}>
                    {tx.type === 'debit' ? '-' : '+'} ₹{tx.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
