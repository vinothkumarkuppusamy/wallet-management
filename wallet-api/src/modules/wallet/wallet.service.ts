import { db } from "../../config/db.config";

class walletService {
  //   Add Money
 async addMoney(userId: number, amount: number) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    //   1. Get or create wallet
    let walletRes = await client.query(
      `SELECT id FROM wallets WHERE user_id = $1`,
      [userId]
    );

    let walletId;

    if (walletRes.rows.length === 0) {
      // Create wallet for first-time user
      const newWallet = await client.query(
        `INSERT INTO wallets (user_id)
         VALUES ($1)
         RETURNING id`,
        [userId]
      );

      walletId = newWallet.rows[0].id;
    } else {
      walletId = walletRes.rows[0].id;
    }

    //   2. Insert transaction
    await client.query(
      `INSERT INTO transactions (user_id, wallet_id, type, amount)
       VALUES ($1, $2, 'credit', $3)`,
      [userId, walletId, amount]
    );

    await client.query("COMMIT");

    return { message: "Money added successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

  //   Withdraw Money
  async withdrawMoney(userId: number, amount: number) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const walletRes = await client.query(
        `SELECT id FROM wallets WHERE user_id = $1`,
        [userId]
      );

      if (walletRes.rows.length === 0) {
        throw { status: 404, message: "Wallet not found" };
      }

      const walletId = walletRes.rows[0].id;

      // Get balance using aggregate
      const balanceRes = await client.query(
        `
        SELECT COALESCE(SUM(
          CASE 
            WHEN type = 'credit' THEN amount
            ELSE -amount
          END
        ), 0) AS balance
        FROM transactions
        WHERE user_id = $1
        `,
        [userId]
      );

      const balance = Number(balanceRes.rows[0].balance);

      if (balance < amount) {
        throw { status: 400, message: "Insufficient balance" };
      }

      await client.query(
        `INSERT INTO transactions (user_id, wallet_id, type, amount)
         VALUES ($1, $2, 'debit', $3)`,
        [userId, walletId, amount]
      );

      await client.query("COMMIT");

      return { message: "Money withdrawn successfully" };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  //   Passbook (history + aggregate)
  async getPassbook(userId: number) {
    // Transactions
    const txRes = await db.query(
      `
      SELECT id, type, amount, created_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    // Aggregate summary
    const summaryRes = await db.query(
      `
      SELECT 
        COUNT(*) AS total_transactions,
        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS total_credit,
        SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) AS total_debit
      FROM transactions
      WHERE user_id = $1
      `,
      [userId]
    );

    return {
      transactions: txRes.rows,
      summary: summaryRes.rows[0],
    };
  }
}

export default new walletService();