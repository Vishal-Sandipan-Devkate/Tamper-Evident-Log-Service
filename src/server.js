import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { authenticate } from "./middleware/authMiddleware.js";
import { prisma } from "./config/prisma.js";
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
app.use("/log", authenticate, logRoutes);

const swaggerDocument = YAML.load("./src/docs/openapi.yaml");

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "UP",
      database: "CONNECTED",
      environment: env.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "DOWN",
      database: "DISCONNECTED",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  req.log.error(err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      errors: err.issues,
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message:
      env.nodeEnv === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

app.listen(env.port, () => {
  logger.info(`Server started on port ${env.port}`);
});