jest.mock("@/business/lib/emails/emails");

import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { prisma } from "@/database/prisma";
import { createApp } from "@/app";
import { randomUUID } from "crypto";

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

describe("GET /unsubscribe/:token", () => {
  it("unsubscribes successfully with valid token", async () => {
    const email = faker.internet.email();
    const city = "Lviv";
    const token = randomUUID();

    await prisma.subscription.create({
      data: {
        email,
        city,
        frequency: "Daily",
        token,
        confirmed: true,
      },
    });

    await supertest(baseUrl).get(`/unsubscribe/${token}`).expect(200);

    const deleted = await prisma.subscription.findFirst({ where: { token } });
    expect(deleted).toBeNull();
  });

  it("returns 404 for non-existent token", async () => {
    const randomToken = randomUUID();

    const response = await supertest(baseUrl)
      .get(`/unsubscribe/${randomToken}`)
      .expect(404);

    expect(response.body.message).toBe("Token not found");
  });
});
