import { db } from "../../config/db.config";

class userService {
  async register(data: { mobile: string; name?: string | null }) {
    const result = await db.query(
      `
      INSERT INTO users (mobile, name)
      VALUES ($1, $2)
      ON CONFLICT (mobile)
      DO UPDATE SET
        name = COALESCE(EXCLUDED.name, users.name),
        updated_at = NOW()
      RETURNING *;
      `,
      [data.mobile, data.name ?? null]
    );
    return result.rows[0];
  };
}

export default new userService()