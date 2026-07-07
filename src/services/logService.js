import repository from "../repositories/logRepository.js";
import { generateHash } from "../utils/hash.js";
import { logger } from "../config/logger.js";

class LogService {
  async createLog({ actor, action, payload }) {
    const latest = await repository.findLatest();

    const previousHash = latest ? latest.currentHash : "GENESIS";

    const createdAt = new Date();

    const currentHash = generateHash({
      previousHash,
      actor,
      action,
      payload,
      createdAt,
    });

    const log = await repository.create({
      actor,
      action,
      payload,
      previousHash,
      currentHash,
      createdAt,
    });

    logger.info({
      event: "log-created",
      actor,
      action,
      id: log.id,
    });

    return log;
  }

  async getLog(id) {
    return repository.findById(id);
  }

  async verifyChain() {
    const logs = await repository.findAll();

    if (logs.length === 0) {
      return {
        pass: true,
        brokenEntryId: null,
      };
    }

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      const expectedHash = generateHash({
        previousHash: log.previousHash,
        actor: log.actor,
        action: log.action,
        payload: log.payload,
        createdAt: log.createdAt,
      });

      if (expectedHash !== log.currentHash) {
        return {
          pass: false,
          brokenEntryId: log.id,
        };
      }

      if (i === 0) {
        if (log.previousHash !== "GENESIS") {
          return {
            pass: false,
            brokenEntryId: log.id,
          };
        }
      } else {
        if (log.previousHash !== logs[i - 1].currentHash) {
          return {
            pass: false,
            brokenEntryId: log.id,
          };
        }
      }
    }

    logger.info({
      event: "verification",
      pass: true,
    });

    return {
      pass: true,
      brokenEntryId: null,
    };
  }

  async exportLogs(query) {
    const {
      actor,
      from,
      to,
      page = 1,
      limit = 10,
    } = query;

    const where = {};

    if (actor) {
      where.actor = actor;
    }

    if (from || to) {
      where.createdAt = {};

      if (from) {
        where.createdAt.gte = new Date(from);
      }

      if (to) {
        where.createdAt.lte = new Date(to);
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await repository.count(where);

    const logs = await repository.exportLogs(
      where,
      skip,
      Number(limit)
    );

    logger.info({
      event: "export",
      actor,
      page: Number(page),
      limit: Number(limit),
    });

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data: logs,
    };
  }
}

export default new LogService();