import logService from "../src/services/logService.js";
import prisma from "../src/config/prisma.js";
import { logger } from "../src/config/logger.js";

try {
  console.log("==================================");
  console.log(" Tamper-Evident Log Verification by Vishal Devkate");
  console.log("==================================\n");

  const result = await logService.verifyChain();

  if (result.pass) {
    const totalEntries = await prisma.logEntry.count();

    logger.info({
      event: "cli-verification",
      pass: true,
    });

    console.log(`Status        : PASS`);
    console.log(`Total Entries : ${totalEntries}`);
    console.log("\n Chain integrity verified.");

    process.exit(0);
  }

  logger.warn({
    event: "cli-verification",
    pass: false,
    brokenEntryId: result.brokenEntryId,
  });

  console.log(`Status        : FAIL`);
  console.log(`Broken Entry  : ${result.brokenEntryId}`);

  process.exit(1);

} catch (error) {

  logger.error({
    event: "cli-verification-error",
    error: error.message,
    stack: error.stack,
  });

  console.error(error);

  process.exit(1);

} finally {

  await prisma.$disconnect();

}