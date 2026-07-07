import { z } from "zod";

export const createLogSchema = z.object({
  actor: z
    .string()
    .trim()
    .min(1)
    .max(100),

  action: z
    .string()
    .trim()
    .min(1)
    .max(100),

  payload: z.record(z.any()),
});
