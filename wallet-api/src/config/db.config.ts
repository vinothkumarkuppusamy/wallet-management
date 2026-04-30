import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.DATABASE_URL as string;

if (!dbUri) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = new Pool({
  connectionString: dbUri,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const connectDB = async () => {
  try {
    const client = await db.connect();

    console.log("Database connected");

    const res = await client.query("SELECT NOW()");
    console.log("DB Time:", res.rows[0].now);

    client.release();
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};