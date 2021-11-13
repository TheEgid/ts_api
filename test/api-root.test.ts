import request from "supertest";
import { createHttpTerminator } from "http-terminator";
import  server  from "../src";


describe("Test root", () => {
  it("should running /", async () => {
    const res = await request(server).get("/api/status");
    expect(process.env.APP_ENV).toEqual("test");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(JSON.stringify({ status: "OK" }));
  });
});


afterAll(async (done) => {
  const httpTerminator = createHttpTerminator({ server });
  await httpTerminator.terminate();
  done();
});
