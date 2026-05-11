-- ============================================================
-- Wallet API - Normalized MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS wallet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wallet_db;

-- Users table
CREATE TABLE users (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  mobile      VARCHAR(15)  UNIQUE,
  name        VARCHAR(100),
  email       VARCHAR(150) UNIQUE,
  google_id   VARCHAR(100) UNIQUE,
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,
  kyc_status  ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mobile (mobile),
  INDEX idx_email  (email)
) ENGINE=InnoDB;

-- OTPs table
CREATE TABLE otps (
  id         CHAR(36)    NOT NULL PRIMARY KEY,
  mobile     VARCHAR(15) NOT NULL,
  otp_hash   VARCHAR(255) NOT NULL,
  expires_at DATETIME    NOT NULL,
  is_used    TINYINT(1)  NOT NULL DEFAULT 0,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mobile (mobile)
) ENGINE=InnoDB;

-- Wallets table (1:1 with users)
CREATE TABLE wallets (
  id         CHAR(36)        NOT NULL PRIMARY KEY,
  user_id    CHAR(36)        NOT NULL UNIQUE,
  balance    DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  currency   VARCHAR(5)      NOT NULL DEFAULT 'INR',
  is_active  TINYINT(1)      NOT NULL DEFAULT 1,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Transactions table
CREATE TABLE transactions (
  id             CHAR(36)       NOT NULL PRIMARY KEY,
  wallet_id      CHAR(36)       NOT NULL,
  user_id        CHAR(36)       NOT NULL,
  type           ENUM('credit','debit') NOT NULL,
  amount         DECIMAL(12,2)  NOT NULL,
  balance_before DECIMAL(12,2)  NOT NULL,
  balance_after  DECIMAL(12,2)  NOT NULL,
  description    VARCHAR(255),
  reference_id   VARCHAR(100)   NOT NULL UNIQUE,
  status         ENUM('pending','success','failed') NOT NULL DEFAULT 'success',
  created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_txn_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id),
  CONSTRAINT fk_txn_user   FOREIGN KEY (user_id)   REFERENCES users(id),
  INDEX idx_wallet_id  (wallet_id),
  INDEX idx_user_id    (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- Useful Aggregate Queries
-- ============================================================

-- Total credits and debits per user
SELECT
  user_id,
  SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS total_credited,
  SUM(CASE WHEN type = 'debit'  THEN amount ELSE 0 END) AS total_debited,
  COUNT(*) AS total_transactions
FROM transactions
GROUP BY user_id;

-- Monthly passbook summary
SELECT
  DATE_FORMAT(created_at, '%Y-%m') AS month,
  type,
  COUNT(*)                         AS count,
  SUM(amount)                      AS total
FROM transactions
WHERE user_id = :user_id
GROUP BY month, type
ORDER BY month DESC;
