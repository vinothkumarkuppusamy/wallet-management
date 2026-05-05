import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodTypeAny , ZodError } from "zod";
import { STATUSCODE } from "../utils/response";

export const validate =
  (schema: {
    body?: ZodTypeAny;
    params?: ZodTypeAny;
    query?: ZodTypeAny;
  }): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      //   BODY
      if (schema.body) {
        const parsed = schema.body.parse(req.body);
        req.body = parsed;
      }

      // PARAMS
      if (schema.params) {
        const parsed = schema.params.parse(req.params) as typeof req.params;
        req.params = parsed;
      }

      // QUERY
      if (schema.query) {
         (req as any).validatedQuery = schema.query.parse(req.query);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        res.status(STATUSCODE.BAD_REQUEST).json({
          success: false,
          message: "Validation Error",
          errors,
        });
        return;
      }

      next(err);
    }
  };