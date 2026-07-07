import { Router } from "express";
import controller from "../controllers/logController.js";

const router = Router();

router.post("/", controller.create);

router.get("/:id", controller.get);

export default router;
