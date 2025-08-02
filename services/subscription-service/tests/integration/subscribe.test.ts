import { prisma } from "@/database/prisma";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { createApp } from "@/app";

let app: Awaited<ReturnType<typeof createApp>>;
let baseUrl: string;

beforeAll(async () => {
  app = await createApp();
  await app.start();
  baseUrl = app.address + "/api";
});

afterAll(async () => {
  await app.stop();
});

beforeEach(async () => {
  await prisma.outboxEvent.deleteMany();
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

    const createdSubscription = await prisma.subscription.findFirst({
      where: { email },
    });
    expect(createdSubscription).not.toBeNull();
    expect(createdSubscription?.city).toBe(city);
    expect(createdSubscription?.confirmed).toBe(false);

    const createdOutboxEvent = await prisma.outboxEvent.findFirst({});
    expect(createdOutboxEvent).not.toBeNull();
    expect(createdOutboxEvent?.topic).toBe("subscription.events");

    const payload = createdOutboxEvent?.payload as any;
    expect(payload.type).toBe("SUBSCRIPTION_CREATED");
    expect(payload.recipientEmail).toBe(email);
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
