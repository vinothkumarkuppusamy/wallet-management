import { z } from "zod";

export const registerSchema = {
  body: z.object({
    mobile: z
      .string()
      .length(10, "Mobile must be 10 digits")
      .regex(/^[0-9]+$/, "Mobile must be numeric"),
    name: z.string().min(2, "Name is too short"),
  }),
};