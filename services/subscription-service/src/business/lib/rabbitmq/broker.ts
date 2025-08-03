import { config } from "@/config";
import amqplib, { Channel, ChannelModel } from "amqplib";
import { EXCHANGE_NAME, MAX_RETRIES, RETRY_DELAY_MS } from "./constants";
import { delay } from "../utils";
import { Logger } from "pino";
import { logger } from "../logger";
import { InternalServerError } from "../error";

class BrokerManager {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private isConnecting: boolean = false;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public async getChannel(): Promise<Channel> {
    if (!this.channel) {
      await this.connect();
    }
    if (!this.channel) {
      throw new InternalServerError(
        "Could not establish a channel to the message broker."
      );
    }
    return this.channel;
  }

  private async connect(): Promise<void> {
    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = () => {
          if (!this.isConnecting) {
            resolve();
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    for (let i = 1; i <= MAX_RETRIES; i++) {
      try {
        this.logger.debug(
          `[Broker] Attempting to connect to RabbitMQ (Attempt ${i}/${MAX_RETRIES})...`
        );
        this.connection = await amqplib.connect(config.rabbitMqUrl);
        this.channel = await this.connection.createChannel();

        this.connection.on("error", (err) => {
          this.logger.error({ err }, "[Broker] Connection error");
          this.resetConnection();
        });
        this.connection.on("close", () => {
          this.logger.warn("[Broker] Connection closed.");
          this.resetConnection();
        });

        await this.channel.assertExchange(EXCHANGE_NAME, "direct", {
          durable: true,
        });
        this.isConnecting = false;
        return;
      } catch (error) {
        if (i === MAX_RETRIES) {
          this.isConnecting = false;
          throw error;
        }
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  private resetConnection() {
    this.connection = null;
    this.channel = null;
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.resetConnection();
    this.logger.info("[Broker] Connection closed gracefully.");
  }
}

export { BrokerManager };
export const brokerManager = new BrokerManager(logger);
