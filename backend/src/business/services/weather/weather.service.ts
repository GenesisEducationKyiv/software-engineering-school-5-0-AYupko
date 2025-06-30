import { InternalServerError } from "@/business/lib/error";
import {
  chainedWeatherProviders,
  WeatherProviderFn,
} from "@/business/lib/weather";
import { redis } from "@/plugins/redis";

export const createWeatherService = ({
  weatherProvider,
}: {
  weatherProvider: WeatherProviderFn;
}) => ({
  async getWeather({ city }: { city: string }) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return { weather: JSON.parse(cachedData) };
    }

    const response = await weatherProvider({ city });

    if (!response.success) {
      throw new InternalServerError("Failed to fetch weather data");
    }

    await redis.set(cacheKey, JSON.stringify(response.data), "EX", 1000);

    return { weather: response.data };
  },
});

export const weatherService = createWeatherService({
  weatherProvider: chainedWeatherProviders,
});
