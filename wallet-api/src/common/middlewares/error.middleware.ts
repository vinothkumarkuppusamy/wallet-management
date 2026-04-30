import { Request, Response, NextFunction } from "express";
import { STATUSCODE, handleResponse } from "../utils/response";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Global Error: ", err);

  const statusCode = err.status || STATUSCODE.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";

  res.status(statusCode).send(handleResponse(message));
};
