describe("Rate Limit", () => {

  test("blocks after limit", async () => {

    for (let i = 0; i < 10; i++) {

      await request(app)
        .post("/log")
        .set("x-api-key", "super-secret-api-key")
        .send({
          actor: "A",
          action: "LOGIN",
          payload: {},
        });

    }

    const response = await request(app)
      .post("/log")
      .set("x-api-key", "super-secret-api-key")
      .send({
        actor: "A",
        action: "LOGIN",
        payload: {},
      });

    expect(response.status).toBe(429);

  });

});
