import axios, { AxiosInstance } from "axios";
import { FastifyBaseLogger } from "fastify";

export class WeatherClient {
  private client: AxiosInstance;
  private logger: FastifyBaseLogger;

  constructor(baseURL: string, logger: FastifyBaseLogger) {
    this.client = axios.create({ baseURL });
    this.logger = logger;
  }

  async getWeather(city: string) {
    try {
      const response = await this.client.get("/api/weather", {
        params: { city },
      });
      return response.data;
    } catch (error) {
      this.logger.error(
        { err: error, city },
        `[WeatherClient] Error getting weather`
      );
      throw error;
    }
  }
}
