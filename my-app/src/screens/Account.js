import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, LogOut, MessageSquare, Book, ShieldCheck, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../api';
import './screens.css';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [balance, setBalance] = useState({ total: 0, deposit: 0, winnings: 0 });
  const [kycStatus, setKycStatus] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editMobile, setEditMobile] = useState(user.mobile || '');
  
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await api.getPassbook();
        if (data && data.transactions) {
          const transactions = data.transactions;
          let total = 0;
          transactions.forEach(t => {
            if (t.type === 'credit') total += Number(t.amount);
            if (t.type === 'debit') total -= Number(t.amount);
          });
          setBalance({ total, deposit: total, winnings: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch passbook', error);
      }
    };

    const fetchKycStatus = async () => {
      try {
        const res = await api.getKycStatus();
        setKycStatus(res?.status);
      } catch (error) {
        console.error("Failed to fetch KYC status", error);
      }
    };

    fetchWallet();
    fetchKycStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      const updatedUser = { ...user, name: editName, mobile: editMobile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      setEditName(user.name || '');
      setEditMobile(user.mobile || '');
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(user.name || '');
    setEditMobile(user.mobile || '');
  };

  const handleCallUs = () => {
    alert("Thank you for contacting us. Our team will get in touch with you shortly.");
  };

  const handleMessage = () => {
    alert("Message sent successfully");
  };

  return (
    <div className="page-transition">
      <div className="account-header">
        <button className="back-btn" onClick={() => navigate(-1)} style={{ marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <span style={{ fontSize: '18px', fontWeight: '600' }}>My Account</span>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div className="account-info">
          <div className="account-avatar">
            <div className="account-avatar-edit">
              <Edit2 size={12} color="#fff" />
            </div>
          </div>
          <div style={{ flexGrow: 1 }}>
            {isEditing ? (
              <>
                <Input
                  label="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ marginBottom: '8px' }}
                />
                <Input
                  label="Mobile"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="account-name">{user.name || 'User Name'}</div>
                <div className="account-phone">{user.mobile || '+91 0000000000'}</div>
              </>
            )}
          </div>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="primary" onClick={handleEditToggle} style={{ padding: '8px 16px', fontSize: '14px' }}>
                <Check size={16} />
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} style={{ padding: '8px 16px', fontSize: '14px' }}>
                <X size={16} />
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleEditToggle} style={{ padding: '8px 16px', width: 'auto', fontSize: '14px' }}>
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="wallet-card" onClick={() => navigate('/wallet')}>
        <div className="wallet-total-label">TOTAL WALLET BALANCE</div>
        <div className="wallet-total-amount">₹{balance.total.toFixed(2)}</div>
        
        <div className="wallet-row">
          <div className="wallet-row-info">
            <h4>DEPOSIT BALANCE</h4>
            <p>₹{balance.deposit.toFixed(2)}</p>
          </div>
          <Button variant="primary" style={{ padding: '8px 16px', width: 'auto', fontSize: '14px' }} onClick={(e) => { e.stopPropagation(); navigate('/add-money'); }}>Add Money</Button>
        </div>
        
        <div className="wallet-row">
          <div className="wallet-row-info">
            <h4>WINNINGS</h4>
            <p>₹{balance.winnings.toFixed(2)}</p>
          </div>
          <Button variant="outline" style={{ padding: '8px 16px', width: 'auto', fontSize: '14px' }} onClick={(e) => { e.stopPropagation(); navigate('/withdraw'); }}>Withdraw</Button>
        </div>
      </div>

      <div className="menu-list">
        <div className="menu-item" onClick={() => navigate('/withdraw?view=passbook')}>
          <div className="menu-item-left">
            <Book size={20} className="menu-item-icon" />
            <span className="menu-item-text">Passbook</span>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </div>
        
        <div className="menu-item" onClick={() => navigate('/kyc')}>
          <div className="menu-item-left">
            <ShieldCheck size={20} className="menu-item-icon" />
            <span className="menu-item-text">KYC Verification</span>
          </div>
          <span className="menu-item-badge">
            {kycStatus === 'PENDING' ? 'Pending' : 'Verified'}{" "}
            <ChevronRight size={16} color="var(--text-secondary)" style={{ verticalAlign: 'middle' }} />
          </span>
        </div>
        
        <div className="menu-item" style={{ borderBottom: 'none' }}>
          <div className="menu-item-left">
            <MessageSquare size={20} className="menu-item-icon" />
            <span className="menu-item-text">Customer Care</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={handleMessage} style={{ padding: '8px 16px', width: 'auto', fontSize: '12px', border: '1px solid var(--border-color)' }}>Message</Button>
            <Button variant="secondary" onClick={handleCallUs} style={{ padding: '8px 16px', width: 'auto', fontSize: '12px', border: '1px solid var(--border-color)' }}>Call Us</Button>
          </div>
        </div>
      </div>

      <div className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </div>
    </div>
  );
};

export default Account;
