const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};;;

export const api = {
  // Auth Endpoints
  sendOtp: async (mobile) => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile }),
    });
    if (!response.ok) throw new Error('Failed to send OTP');
    return response.json();
  },

  verifyOtp: async (mobile, otp, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile, otp, name }),
    });
    if (!response.ok) throw new Error('Failed to verify OTP');
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    localStorage.removeItem('token');
    if (!response.ok) throw new Error('Failed to logout');
    return response.json();
  },

  // User Endpoints
  registerUser: async (mobile, name) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile, name }),
    });
    if (!response.ok) throw new Error('Failed to register user');
    return response.json();
  },

  // Wallet Endpoints
  addMoney: async (amount) => {
    const response = await fetch(`${API_BASE_URL}/wallet/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error('Failed to add money');
    return response.json();
  },

  withdrawMoney: async (amount) => {
    const response = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error('Failed to withdraw money');
    return response.json();
  },

  getPassbook: async () => {
    const response = await fetch(`${API_BASE_URL}/wallet/passbook`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error('Failed to get passbook');
    return json.data || json;
  },

  // KYC Endpoints
  uploadKyc: async (formData) => {
    const token = localStorage.getItem('token') || '';
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Note: Do not set Content-Type for FormData, browser sets it automatically with boundary
    const response = await fetch(`${API_BASE_URL}/kyc/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload KYC');
    return response.json();
  },

  getKycStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/kyc/status`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error('Failed to get KYC status');
    return json.data || json;
  },
};
