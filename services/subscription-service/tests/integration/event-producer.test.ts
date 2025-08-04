import { createApp } from "@/app";
import { prisma } from "@/database/prisma";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import amqplib, { Channel, ConsumeMessage, ChannelModel } from "amqplib";
import { outboxService } from "@/business/services/outbox-service";
import { EXCHANGE_NAME } from "@/business/lib/rabbitmq";
import { config } from "@/config";

let app: Awaited<ReturnType<typeof createApp>>;
let baseUrl: string;
let amqpConnection: ChannelModel;
let amqpChannel: Channel;

const waitForMessage = (
  channel: Channel,
  queue: string
): Promise<ConsumeMessage> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Message receive timeout after 5s")),
      5000
    );
    channel.consume(
      queue,
      (msg) => {
        if (msg) {
          clearTimeout(timeout);
          resolve(msg);
        }
      },
      { noAck: true }
    );
  });
};

beforeAll(async () => {
  app = await createApp(config);
  await app.start();
  baseUrl = app.address + "/api";

  try {
    amqpConnection = await amqplib.connect(config.rabbitMqUrl);
    amqpChannel = await amqpConnection.createChannel();

    await amqpChannel.assertExchange(EXCHANGE_NAME, "direct", {
      durable: true,
    });
  } catch (e) {
    console.error("Failed to connect to RabbitMQ for tests", e);
    throw e;
  }
});

afterAll(async () => {
  await app.stop();
  
  if (amqpChannel) await amqpChannel.close();
  if (amqpConnection) await amqpConnection.close();
});

beforeEach(async () => {
  await prisma.outboxEvent.deleteMany();
  await prisma.subscription.deleteMany();
});

describe("Outbox Producer Integration Test", () => {
  it("should publish a SUBSCRIPTION_CREATED event to RabbitMQ", async () => {
    const testQueue = await amqpChannel.assertQueue("", { exclusive: true });
    const routingKey = "subscription.events";
    await amqpChannel.bindQueue(testQueue.queue, EXCHANGE_NAME, routingKey);

    const email = faker.internet.email();
    await supertest(baseUrl)
      .post("/subscribe")
      .send({ email, city: "TestCity", frequency: "Daily" })
      .expect(200);

    const dbEvent = await prisma.outboxEvent.findFirst();
    expect(dbEvent).not.toBeNull();

    await outboxService.processOutboxEvents();

    const receivedMsg = await waitForMessage(amqpChannel, testQueue.queue);

    expect(receivedMsg).toBeDefined();

    const payload = JSON.parse(receivedMsg.content.toString());
    expect(payload.type).toBe("SUBSCRIPTION_CREATED");
    expect(payload.recipientEmail).toBe(email);
    expect(payload.confirmationToken).toEqual(expect.any(String));

    const processedDbEvent = await prisma.outboxEvent.findUnique({
      where: { id: dbEvent!.id },
    });
    expect(processedDbEvent?.processedAt).not.toBeNull();
  });
});
