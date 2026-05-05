import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Auth from './screens/Auth';
import Account from './screens/Account';
import Wallet from './screens/Wallet';
import AddMoney from './screens/AddMoney';
import Withdraw from './screens/Withdraw';
import KYC from './screens/KYC';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect them to the / login page, but save the current location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/account" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div id="root">
        <Routes>
          <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/add-money" element={<ProtectedRoute><AddMoney /></ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
