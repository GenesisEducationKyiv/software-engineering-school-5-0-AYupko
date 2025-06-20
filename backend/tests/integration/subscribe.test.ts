jest.mock("@/business/lib/emails/emails");

import { prisma } from "@/database/prisma";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { createApp } from "@/app";


let app: Awaited<ReturnType<typeof createApp>>;
let baseUrl: string;

beforeEach(async () => {
  app = await createApp();
  await app.start();
  baseUrl = app.address + "/api";
});

afterEach(async () => {
  await app.stop();
  await prisma.subscription.deleteMany();
});

describe("POST /subscribe", () => {
  it("creates subscription for new email", async () => {
    const email = faker.internet.email();
    const city = "Lviv";

    const response = await supertest(baseUrl)
      .post("/subscribe")
      .send({ email, city, frequency: "Daily" })
      .expect(200);

    expect(response.body.message).toBe(
      "Subscription successful. Confirmation email sent."
    );

    const created = await prisma.subscription.findFirst({ where: { email } });
    expect(created).not.toBeNull();
    expect(created?.city).toBe(city);
    expect(created?.confirmed).toBe(false);
  });

  it("fails when subscribing twice with same email and city", async () => {
    const email = faker.internet.email();
    const city = "Kyiv";

    await supertest(baseUrl)
      .post("/subscribe")
      .send({ email, city, frequency: "Daily" });

    const response = await supertest(baseUrl)
      .post("/subscribe")
      .send({ email, city, frequency: "Daily" })
      .expect(409);

    expect(response.body.message).toBe("Email already subscribed");
  });
});
