-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- OTP TABLE
-- =========================
CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otps_mobile ON otps(mobile);

-- Ensure single OTP per mobile (for UPSERT)
ALTER TABLE otps
ADD CONSTRAINT IF NOT EXISTS unique_mobile UNIQUE (mobile);

-- =========================
-- WALLET TABLE
-- =========================
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- TRANSACTIONS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  wallet_id INT REFERENCES wallets(id) ON DELETE CASCADE,
  type VARCHAR(10) CHECK (type IN ('credit', 'debit')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);

-- =========================
-- KYC TABLE (UPDATED BASED ON YOUR SCHEMA)
-- =========================
CREATE TABLE IF NOT EXISTS kyc (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  aadhaar VARCHAR(20),

  -- 🔥 Added for upload support
  document_url TEXT,

  status VARCHAR(20) DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),

  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- SESSIONS TABLE (FOR AUTH)
-- =========================
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- =========================
-- TOKEN BLACKLIST (LOGOUT)
-- =========================
CREATE TABLE IF NOT EXISTS token_blacklist (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blacklist_token ON token_blacklist(token);

-- =========================
-- PASSBOOK VIEW
-- =========================
CREATE OR REPLACE VIEW passbook AS
SELECT 
  t.id,
  t.user_id,
  t.type,
  t.amount,
  t.created_at
FROM transactions t;

-- =========================
-- SAMPLE AGGREGATE QUERY (REFERENCE)
-- =========================
-- Wallet Balance
-- SELECT COALESCE(SUM(
--   CASE 
--     WHEN type = 'credit' THEN amount
--     ELSE -amount
--   END
-- ), 0) AS balance
-- FROM transactions
-- WHERE user_id = $1;
