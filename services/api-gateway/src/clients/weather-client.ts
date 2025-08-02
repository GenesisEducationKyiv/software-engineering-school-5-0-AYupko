import axios, { AxiosInstance } from "axios";

export class WeatherClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  async getWeather(city: string) {
    const response = await this.client.get("/api/weather", {
      params: { city },
    });
    return response.data;
  }
}
