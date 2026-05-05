import { db } from "../../config/db.config";

class kycService {
  async uploadKyc(userId: number, filePath: string) {
    const result = await db.query(
      `
      INSERT INTO kyc (user_id, document_url)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        document_url = EXCLUDED.document_url,
        status = 'VERIFIED',
        updated_at = NOW()
      RETURNING *
      `,
      [userId, filePath]
    );

    return result.rows[0];
  }

  async getKycStatus(userId: number) {
    const result = await db.query(
      `SELECT * FROM kyc WHERE user_id = $1`,
      [userId]
    );

    return !result.rows[0] ? { status: 'PENDING' } : result.rows[0];
  }
}

export default new kycService();