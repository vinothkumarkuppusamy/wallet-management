import { z } from "zod";

export const addMoneySchema = {
  body: z.object({
    amount: z.number().positive("Amount must be > 0"),
  }),
};

export const withdrawSchema = {
  body: z.object({
    amount: z.number().positive("Amount must be > 0"),
  }),
};

export const passbookQuerySchema = {
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
};