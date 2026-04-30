import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { handleResponse, STATUSCODE } from "../utils/response";

type Role = "user" | "admin";

interface AuthPayload {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// Authenticate JWT
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(STATUSCODE.UNAUTHORIZED)
      .json(handleResponse("Unauthorized: No token provided"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(STATUSCODE.UNAUTHORIZED)
      .json(handleResponse("Unauthorized: Invalid token"));
    return;
  }
};

// Authorize Role(s)
export const authorize = (...roles: Role[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(STATUSCODE.FORBIDDEN).json(handleResponse("Access denied"));
      return;
    }
    next();
  };
};
