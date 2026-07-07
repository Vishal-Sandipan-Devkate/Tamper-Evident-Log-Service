import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import logRoutes from "./routes/logRoutes.js";
const app = express();

app.use(
  pinoHttp({
    logger,
  })
);

app.use(helmet());

app.use(cors());

app.use(express.json());
    
console.log("Registering /log routes");
app.use("/logs", logRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    environment: env.nodeEnv,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  req.log.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(env.port, () => {
  logger.info(`Server started on port ${env.port}`);
});