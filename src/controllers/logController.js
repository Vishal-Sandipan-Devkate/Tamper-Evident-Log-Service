import service from "../services/logService.js";
import { createLogSchema } from "../validators/logValidator.js";
import { generateHash } from "../utils/hash.js";

class LogController {
  async create(req, res, next) {
    try {
      const data = createLogSchema.parse(req.body);

      const log = await service.createLog(data);

      return res.status(201).json({
        id: log.id,
        hash: log.currentHash,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const id = Number(req.params.id);

      const log = await service.getLog(id);

      if (!log) {
        return res.status(404).json({
          success: false,
          message: "Log not found",
        });
      }

      const recalculated = generateHash({
        previousHash: log.previousHash,
        actor: log.actor,
        action: log.action,
        payload: log.payload,
        createdAt: log.createdAt,
      });

      return res.json({
        ...log,
        verified: recalculated === log.currentHash,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LogController();
