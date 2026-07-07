import request from "supertest";
import app from "../../src/app.js";

describe("Health Endpoint", () => {
  test("should return 200", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
  });
});