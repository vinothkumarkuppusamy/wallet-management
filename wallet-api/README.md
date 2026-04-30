# 🚀 Wallet API (Node.js + TypeScript)

A scalable backend system for **User Authentication, Wallet Management, Transactions, and KYC Verification**, built using **Node.js, Express, TypeScript, and PostgreSQL** following **MVC architecture**.

---

## 📌 Features

* 🔐 OTP-based Authentication (Register/Login)
* 💰 Wallet (Add / Withdraw money)
* 📊 Passbook (Transaction history + aggregates)
* 🪪 KYC Verification (Document upload)
* 🔑 JWT Authentication
* 🚫 Logout with Token Blacklisting
* ✅ Request Validation (Zod)
* ⚡ Optimized SQL Queries (Aggregates, Indexing)

---

## 🧱 Tech Stack

* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL
* **Auth:** JWT
* **Validation:** Zod
* **File Upload:** Multer
* **ORM:** Raw SQL (optimized queries)

---

## 📁 Project Structure

```
src/
│
├── config/
│   └── db.config.ts
│
├── modules/
│   ├── auth/
│   ├── user/
│   ├── wallet/
│   ├── kyc/
│
├── common/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── otp.ts
│
├── routes/
│   └── index.ts
│
├── app.ts
└── server.ts
```

---

## 🧠 System Flow

### 🔐 Authentication Flow

1. User enters mobile number
2. OTP is generated and stored in DB
3. User verifies OTP
4. System:

   * Creates user (if new)
   * Marks verified
   * Creates wallet
   * Generates JWT token

---

### 💰 Wallet Flow

* Add Money → Insert `credit` transaction
* Withdraw → Check balance → Insert `debit`
* Balance → Calculated using SQL aggregate

---

### 📊 Passbook Flow

* Fetch all transactions
* Aggregate:

  * Total Credit
  * Total Debit
  * Transaction count

---

### 🪪 KYC Flow

1. User uploads document
2. File stored (local/cloud)
3. DB updated with:

   * document_url
   * status = PENDING
4. Admin verifies → VERIFIED / REJECTED

---

## 🗄️ Database Design (ER Overview)

```
users
 ├── wallets (1:1)
 │     └── transactions (1:N)
 ├── transactions (1:N)
 ├── otps (1:N)
 ├── sessions (1:N)
 └── kyc (1:1)

token_blacklist (independent)
```

---

## 📊 SQL Highlights

### Wallet Balance (Aggregate)

```sql
SELECT COALESCE(SUM(
  CASE 
    WHEN type = 'credit' THEN amount
    ELSE -amount
  END
), 0) AS balance
FROM transactions
WHERE user_id = $1;
```

---

## 🔐 Authentication APIs

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| POST   | `/api/auth/send-otp`   | Send OTP           |
| POST   | `/api/auth/verify-otp` | Verify OTP & Login |
| POST   | `/api/auth/logout`     | Logout             |

---
## 👤 User Register API

### 📌 Description

Registers a new user or updates an existing user based on mobile number.

- If mobile does **not exist** → creates new user  
- If mobile **already exists** → updates user details  

---

## 📁 Implementation

### 🔹 Validation (`user.validation.ts`)

```ts
import { z } from "zod";

export const registerSchema = {
  body: z.object({
    mobile: z.string().length(10),
    name: z.string().min(2),
  }),
};

-----

## 💰 Wallet APIs

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | `/api/wallet/add`      | Add money        |
| POST   | `/api/wallet/withdraw` | Withdraw money   |
| GET    | `/api/wallet/passbook` | Get transactions |

---

## 🪪 KYC APIs

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| POST   | `/api/kyc/upload` | Upload document  |
| GET    | `/api/kyc/status` | Check KYC status |

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone <repo-url>
cd wallet-api
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Environment Variables

Create `.env`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/db
JWT_SECRET=your_secret
NODE_ENV=development
```

---

### 4. Run DB Schema

```bash
psql -U postgres -d your_db -f schema.sql
```

---

### 5. Start Server

```bash
npm run dev
```

---

## 🛡️ Security Features

* JWT authentication
* Token blacklist (logout)
* Input validation (Zod)
* SQL injection safe queries
* File type validation (KYC)

---

## ⚡ Performance Optimizations

* Connection pooling (pg Pool)
* Reduced DB round trips
* SQL aggregate functions
* Indexed queries
* Avoided redundant queries

---

## 🚀 Future Improvements

* ☁️ AWS S3 for file uploads
* 🔄 Refresh token system
* 📊 Analytics dashboard
* ⚡ Redis caching
* 🔐 Role-based access (RBAC)

---

## 👨‍💻 Author

Developed as part of backend system design (Node.js + TypeScript).

---

## 📄 License

MIT License
