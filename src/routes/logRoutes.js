import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {logLimiter} from "../middleware/rateLimiter.js";
import { createLogSchema } from "../validators/logValidator.js";
import controller from "../controllers/logController.js";

const router = Router();

router.post(
    "/", 
    logLimiter,
    validate(createLogSchema),
    controller.create);

router.get("/verify", controller.verify);

router.get("/export", controller.export);

router.get("/:id", controller.get);

export default router;
