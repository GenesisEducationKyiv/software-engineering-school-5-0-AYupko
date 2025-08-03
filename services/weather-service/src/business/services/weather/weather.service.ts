import {
  chainedWeatherProviders,
  incrementCacheHit,
  InternalServerError,
  logger,
  redis,
  WeatherProviderFn,
} from "@/business/lib";
import Redis from "ioredis";
import { Logger } from "pino";

export const createWeatherService = ({
  weatherProvider,
  redis,
  logger,
}: {
  weatherProvider: WeatherProviderFn;
  redis: Redis;
  logger: Logger;
}) => ({
  async getWeather({ city }: { city: string }) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      incrementCacheHit(cacheKey);

      return { weather: JSON.parse(cachedData) };
    }

    const response = await weatherProvider({ city }, logger);

    if (!response.success) {
      throw new InternalServerError("Failed to fetch weather data");
    }

    await redis.set(cacheKey, JSON.stringify(response.data), "EX", 1000);

    return { weather: response.data };
  },
});

export const weatherService = createWeatherService({
  weatherProvider: chainedWeatherProviders,
  redis: redis,
  logger: logger,
});
