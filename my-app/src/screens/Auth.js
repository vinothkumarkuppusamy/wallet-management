import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../api';
import './screens.css';

const Auth = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [certified, setCertified] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (mobile && certified) {
      try {
        setLoading(true);
        await api.sendOtp(mobile);
        setStep(2);
      } catch (error) {
        alert('Failed to send OTP: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = () => {
    if (otp && certified) setStep(3);
  };

  const handleSaveName = async () => {
    if (name) {
      try {
        setLoading(true);
        const data = await api.verifyOtp(mobile, otp, name);
        const token = data?.data?.token;
        const user = data?.data?.user;
        if (data && token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/account');
        }
      } catch (error) {
        alert('Failed to verify OTP & save name: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container page-transition">
      <div className="auth-content">
        <div className="auth-logo-placeholder"></div>
        
        {step === 1 && (
          <div className="auth-step page-transition">
            <h1 className="auth-title">Just Verify & Play</h1>
            <p className="auth-subtitle">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
            </p>
            
            <Input 
              label="Mobile Number" 
              placeholder="+91 9874563210" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)} 
            />
            <p className="auth-hint">You will receive an OTP for Verification</p>
            
            <div className="auth-checkbox">
              <input 
                type="checkbox" 
                id="certify1" 
                checked={certified} 
                onChange={(e) => setCertified(e.target.checked)} 
              />
              <label htmlFor="certify1">I certify that I am 18 years years old</label>
            </div>
            
            <Button onClick={handleRegister}>Register</Button>
          </div>
        )}

        {step === 2 && (
          <div className="auth-step page-transition">
            <h1 className="auth-title">Enter your OTP</h1>
            <p className="auth-subtitle">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
            </p>
            
            <Input
              label="Enter Your OTP"
              placeholder="******"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // only digits
                if (value.length <= 6) {
                  setOtp(value);
                }
              }}
              keyboardType="numeric" 
              maxLength={6}
            />
            <p className="auth-hint">Enter the 6 digit OTP you received in your phone</p>
            
            <div className="auth-checkbox">
              <input 
                type="checkbox" 
                id="certify2" 
                checked={certified} 
                onChange={(e) => setCertified(e.target.checked)} 
              />
              <label htmlFor="certify2">I certify that I am 18 years years old</label>
            </div>
            
            <Button onClick={handleVerifyOTP}>Submit</Button>
          </div>
        )}

        {step === 3 && (
          <div className="auth-step page-transition">
            <h1 className="auth-title">You're all set to Play!</h1>
            <p className="auth-subtitle">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
            </p>
            
            <Input 
              label="Enter Your Name" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            
            <div style={{ marginTop: '40px' }}>
              <Button onClick={handleSaveName}>Save Name</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
