import { brokerManager, BrokerManager } from "./broker";
import { ConsumerOptions } from "./types";
import { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } from "./constants";
import { eventService, EventService } from "@/business/services";
import { Logger } from "pino";
import { logger } from "../logger";

export class Consumer {
  private brokerManager: BrokerManager;
  private handleMessage: EventService;
  private logger: Logger;
  private options: ConsumerOptions;

  constructor({
    brokerManager,
    options,
    handleMessage,
    logger,
  }: {
    brokerManager: BrokerManager;
    options: ConsumerOptions;
    handleMessage: EventService;
    logger: Logger;
  }) {
    this.brokerManager = brokerManager;
    this.options = options;
    this.handleMessage = handleMessage;
    this.logger = logger;
  }

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
        if (!msg) return;
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
      { noAck: false }
    );
  }
}

export const eventConsumer = new Consumer({
  brokerManager,
  options: {
    exchangeName: EXCHANGE_NAME,
    queueName: QUEUE_NAME,
    routingKey: ROUTING_KEY,
  },
  handleMessage: eventService,
  logger,
});
