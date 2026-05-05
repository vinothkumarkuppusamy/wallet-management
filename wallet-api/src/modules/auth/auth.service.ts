import { db } from "../../config/db.config";
import { generateOTP } from "../../common/utils/otp";
import { generateToken } from "../../common/utils/jwt";
import jwt from "jsonwebtoken";
import { Auth } from "../../common/decorators/auth.decorator";

class authService {
// Send OTP
  async sendOtp (mobile: string) {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 72 * 60 * 1000);

    //   1. Create user if not exists
    await db.query(
      `
      INSERT INTO users (mobile)
      VALUES ($1)
      ON CONFLICT (mobile) DO NOTHING
      `,
      [mobile]
    );

    //   2. Upsert OTP (latest OTP per mobile)
    await db.query(
      `
      INSERT INTO otps (mobile, otp, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (mobile)
      DO UPDATE SET 
        otp = EXCLUDED.otp,
        expires_at = EXCLUDED.expires_at,
        created_at = NOW(),
        used = FALSE
      `,
      [mobile, otp, expiresAt]
    );

    // 🔥 In real app → send SMS
    console.log("OTP:", otp);

    return { message: "OTP sent successfully" };
  };

  // Verify OTP + Login/Register
  async verifyOtp (mobile: string, otp: string, name?: string) {
    //   1. Get OTP
    const otpRes = await db.query(
      `SELECT * FROM otps WHERE mobile = $1 AND used = false`,
      [mobile]
    );

    const otpRecord = otpRes.rows[0];

    if (!otpRecord || otpRecord.otp !== otp) {
      throw { status: 400, message: "Invalid OTP" };
    }

    if (new Date() > otpRecord.expires_at) {
      throw { status: 400, message: "OTP expired" };
    }

    //   2. Mark used
    await db.query(
      `UPDATE otps SET used = true WHERE mobile = $1`,
      [mobile]
    );

    //   3. Upsert user (single query)
    const userRes = await db.query(
      `
      INSERT INTO users (mobile, name, is_verified)
      VALUES ($1, $2, true)
      ON CONFLICT (mobile)
      DO UPDATE SET is_verified = true
      RETURNING *
      `,
      [mobile, name || null]
    );

    const user = userRes.rows[0];

    //   4. Generate token
    const token = generateToken({
      id: user.id,
      mobile: user.mobile,
    });

    return {
      message: "OTP verified successfully",
      data: { token, user },
    };
  };

  async logout (token: string) {
    const decoded: any = jwt.decode(token);

    if (!decoded) {
      throw { status: false, message: "Invalid token" };
    }

    const expiresAt = new Date(decoded.exp * 1000);

    await db.query(
      `INSERT INTO token_blacklist (token, expires_at)
      VALUES ($1, $2)`,
      [token, expiresAt]
    );

    return { message: "Logged out successfully" };
  };
}

export default new authService();