import { BrokerManager } from "./broker";
import { ConsumerOptions } from "./types";
import { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } from "./constants";
import { EventService } from "@/business/services";
import { FastifyBaseLogger } from "fastify";

export class Consumer {
  constructor(
    private brokerManager: BrokerManager,
    private options: ConsumerOptions,
    private handleMessage: EventService,
    private logger: FastifyBaseLogger
  ) {}

  public async start(): Promise<void> {
    const channel = await this.brokerManager.getChannel();

    const { exchangeName, queueName, routingKey } = this.options;

    await channel.assertExchange(exchangeName, "direct", { durable: true });
    const q = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(q.queue, exchangeName, routingKey);

    channel.prefetch(1);

    channel.consume(
      q.queue,
      async (msg) => {
        if (!msg) {
          return;
        }
        try {
          await this.handleMessage.processEvent(msg, this.logger);
          channel.ack(msg);
        } catch (error) {
          this.logger.error(
            { err: error },
            "[Consumer] Error processing message"
          );
          channel.nack(msg, false, true);
        }
      },
      {
        noAck: false,
      }
    );
  }
}

export const createSubscriptionConsumer = (
  {
    brokerManager,
    eventService,
  }: {
    brokerManager: BrokerManager;
    eventService: EventService;
  },
  logger: FastifyBaseLogger
) => {
  return new Consumer(
    brokerManager,
    {
      exchangeName: EXCHANGE_NAME,
      queueName: QUEUE_NAME,
      routingKey: ROUTING_KEY,
    },
    eventService,
    logger
  );
};
