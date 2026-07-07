import { generateHash } from "../../src/utils/hash.js";

describe("Hash Generation", () => {

  test("should generate deterministic hash", () => {

    const input = {
      previousHash: "GENESIS",
      actor: "Alice",
      action: "LOGIN",
      payload: {},
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const hash1 = generateHash(input);

    const hash2 = generateHash(input);

    expect(hash1).toBe(hash2);

  });

});
