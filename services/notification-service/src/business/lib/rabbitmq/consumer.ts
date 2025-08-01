import { brokerManager, BrokerManager } from "./broker";
import { ConsumerOptions } from "./types";
import { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } from "./constants";
import { eventService, EventService } from "@/business/services";

export class Consumer {
  constructor(
    private brokerManager: BrokerManager,
    private options: ConsumerOptions,
    private handleMessage: EventService
  ) {}

  public async start(): Promise<void> {
    const channel = await this.brokerManager.getChannel();

    const { exchangeName, queueName, routingKey } = this.options;

    await channel.assertExchange(exchangeName, "direct", { durable: true });
    const q = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(q.queue, exchangeName, routingKey);

    channel.prefetch(1);

    console.log(`[Consumer] Waiting for messages in queue: ${q.queue}`);

    channel.consume(
      q.queue,
      async (msg) => {
        if (!msg) {
          return;
        }
        try {
          await this.handleMessage(msg);
          channel.ack(msg);
        } catch (error) {
          console.error("[Consumer] Error processing message:", error);
          channel.nack(msg, false, true);
        }
      },
      {
        noAck: false,
      }
    );
  }
}

export const createSubscriptionConsumer = (dependencies: {
  brokerManager: BrokerManager;
  eventService: EventService;
}) => {
  const { brokerManager, eventService } = dependencies;
  return new Consumer(
    brokerManager,
    {
      exchangeName: EXCHANGE_NAME,
      queueName: QUEUE_NAME,
      routingKey: ROUTING_KEY,
    },
    eventService
  );
};
