import { z } from "zod";

export const sendOtpSchema = {
  body: z.object({
    mobile: z
      .string()
      .length(10, "Mobile must be 10 digits")
      .regex(/^[0-9]+$/),
  }),
};

export const verifyOtpSchema = {
  body: z.object({
    mobile: z.string().length(10),
    otp: z.string().length(6),
    name: z.string().optional(),
  }),
};