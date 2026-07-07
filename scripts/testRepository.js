import repository from "../src/repositories/logRepository.js";

const latest = await repository.findLatest();

console.log(latest);
