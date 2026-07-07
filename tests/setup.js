import prisma from "../src/config/prisma.js";

beforeEach(async () => {
  await prisma.logEntry.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
