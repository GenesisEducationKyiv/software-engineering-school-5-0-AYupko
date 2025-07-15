import axios, { AxiosInstance } from "axios";

export class SubscriptionClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  async createSubscription(email: string, city: string) {
    const response = await this.client.post("/api/subscribe", { email, city });
    return response.data;
  }

  async confirmSubscription(token: string) {
    const response = await this.client.get(`/api/confirm/${token}`);
    return response.data;
  }

  async unsubscribe(token: string) {
    const response = await this.client.get(`/api/unsubscribe/${token}`);
    return response.data;
  }
}
