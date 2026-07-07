import service from "../../src/services/logService.js";

describe("Verify Chain", () => {

  test("empty chain should pass", async () => {

    const result = await service.verifyChain();

    expect(result.pass).toBe(true);

  });

});
