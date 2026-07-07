import repository from "../repositories/logRepository.js";
import { generateHash } from "../utils/hash.js";

class LogService {
  async createLog({ actor, action, payload }) {
    const latest = await repository.findLatest();

    const previousHash = latest
      ? latest.currentHash
      : "GENESIS";

    const createdAt = new Date();

    const currentHash = generateHash({
      previousHash,
      actor,
      action,
      payload,
      createdAt,
    });

    return repository.create({
      actor,
      action,
      payload,
      previousHash,
      currentHash,
      createdAt,
    });
  }

  async getLog(id) {
    return repository.findById(id);
  }
}

export default new LogService();
