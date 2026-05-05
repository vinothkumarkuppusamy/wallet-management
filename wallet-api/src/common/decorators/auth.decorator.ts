
import { Request, Response, NextFunction, response } from "express";
import { verifyToken } from "../utils/jwt";
import { db } from "../../config/db.config";
import { STATUSCODE } from "../utils/response";

export function Auth() {
  return function (
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
          return res.status(STATUSCODE.UNAUTHORIZED).json({ status: false,message: "Unauthorized" });
        }
        const blacklisted = await db.query(
          "SELECT 1 FROM token_blacklist WHERE token = $1",
          [token]
        );

        if (blacklisted.rowCount) {
          res.status(STATUSCODE.UNAUTHORIZED).json({ status: false, message: "Token expired (logged out)" });
          return;
        }

        const decoded = verifyToken(token);

        (req as any).user = decoded;

        return originalMethod.apply(this, [req, res, next]);
      } catch (err) {
        return res.status(STATUSCODE.UNAUTHORIZED).json({ status: false, message: "Invalid Token" });
      }
    };

    return descriptor;
  };
}