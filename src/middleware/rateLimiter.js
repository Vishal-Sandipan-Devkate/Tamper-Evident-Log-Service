import rateLimit from "express-rate-limit";

export const logLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many log requests. Try again later.",
  },
});
