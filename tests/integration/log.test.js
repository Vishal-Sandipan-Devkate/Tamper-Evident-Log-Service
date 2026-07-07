import request from "supertest";

import app from "../../src/app.js";

describe("POST /log", () => {

  test("creates log entry", async () => {

    const response = await request(app)
      .post("/log")
      .set("x-api-key", "super-secret-api-key")
      .send({
        actor: "Alice",
        action: "LOGIN",
        payload: {},
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.id).toBeDefined();

    expect(response.body.hash).toBeDefined();

  });

});
