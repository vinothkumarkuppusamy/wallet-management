import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET ||  "wrutkthtwa6586845343qteghfjsgzdnczbczzbcnzgddaghnnhzh";

export const generateToken = (payload: any) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};