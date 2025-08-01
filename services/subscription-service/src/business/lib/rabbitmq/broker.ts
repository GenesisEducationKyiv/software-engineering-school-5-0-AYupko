import { config } from "@/config";
import amqplib, { Channel, ChannelModel } from "amqplib";
import { EXCHANGE_NAME } from "./constants";

class BrokerManager {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private isConnecting: boolean = false;

  public async getChannel(): Promise<Channel> {
    if (!this.channel) {
      await this.connect();
    }
    if (!this.channel) {
      throw new Error("Could not establish a channel to the message broker.");
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

    try {
      this.connection = await amqplib.connect(config.rabbitMqUrl);

      this.channel = await this.connection.createChannel();

      this.connection.on("error", (err) => {
        console.error("[Broker] Connection error", err);
        this.resetConnection();
      });
      this.connection.on("close", () => {
        console.warn("[Broker] Connection closed.");
        this.resetConnection();
      });

      await this.channel?.assertExchange(EXCHANGE_NAME, "direct", {
        durable: true,
      });
      console.log("[Broker] Successfully connected to RabbitMQ.");
    } catch (error) {
      console.error("[Broker] Failed to connect to RabbitMQ", error);
      this.resetConnection();
      throw error;
    } finally {
      this.isConnecting = false;
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
    console.log("[Broker] Connection closed gracefully.");
  }
}

export { BrokerManager };
export const brokerManager = new BrokerManager();
