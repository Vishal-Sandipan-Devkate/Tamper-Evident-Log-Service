describe("Authentication", () => {

  test("rejects missing API key", async () => {

    const response = await request(app)
      .get("/log/1");

    expect(response.status).toBe(401);

  });

});
