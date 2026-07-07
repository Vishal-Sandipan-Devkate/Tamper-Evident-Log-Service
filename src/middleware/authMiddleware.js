import { env } from "../config/env.js";

export function authenticate(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key is required",
    });
  }

  if (apiKey !== env.apiKey) {
    req.log.warn({
      endpoint: req.originalUrl,
      ip: req.ip,
      reason: "Invalid API Key",
    });

    return res.status(401).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
}