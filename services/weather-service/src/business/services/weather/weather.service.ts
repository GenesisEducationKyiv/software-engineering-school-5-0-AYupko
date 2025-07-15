import Redis from "ioredis";
import {
  chainedWeatherProviders,
  incrementCacheHit,
  InternalServerError,
  redis,
  WeatherProviderFn,
} from "../../lib";

export const createWeatherService = ({
  weatherProvider,
  redis,
}: {
  weatherProvider: WeatherProviderFn;
  redis: Redis;
}) => ({
  async getWeather({ city }: { city: string }) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      incrementCacheHit(cacheKey);

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
  redis: redis,
});
