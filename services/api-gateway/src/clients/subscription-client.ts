import axios, { AxiosInstance } from "axios";
import { FastifyBaseLogger } from "fastify";

export class SubscriptionClient {
  private client: AxiosInstance;
  private logger: FastifyBaseLogger;

  constructor(baseURL: string, logger: FastifyBaseLogger) {
    this.client = axios.create({ baseURL });
    this.logger = logger;
  }

  async createSubscription(email: string, city: string, frequency: string) {
    try {
      const response = await this.client.post("/api/subscribe", {
        email,
        city,
        frequency,
      });
      return response.data;
    } catch (error) {
      this.logger.error(
        { err: error, city },
        `[SubscriptionClient] Error creating subscription`
      );
      throw error;
    }
  }

  async confirmSubscription(token: string) {
    try {
      const response = await this.client.get(`/api/confirm/${token}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        { err: error, token },
        `[SubscriptionClient] Error confirming subscription`
      );
      throw error;
    }
  }

  async unsubscribe(token: string) {
    try {
      const response = await this.client.get(`/api/unsubscribe/${token}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        { err: error, token },
        `[SubscriptionClient] Error unsubscribing`
      );
      throw error;
    }
  }
}
