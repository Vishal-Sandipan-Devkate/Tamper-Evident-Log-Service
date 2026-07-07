import service from "../services/logService.js";
import { createLogSchema } from "../validators/logValidator.js";
import { generateHash } from "../utils/hash.js";

class LogController {
  async create(req, res, next) {
    try {
      const log = await service.createLog(req.bo);

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

  async verify(req, res, next) {
  try {

    const result = await service.verifyChain();

    return res.json(result);

  } catch (error) {
    next(error);
  }
}

async export(req, res, next) {
  try {
    const logs = await service.exportLogs(req.query);

    res.json(logs);
  } catch (error) {
    next(error);
  }
}

}

export default new LogController();
