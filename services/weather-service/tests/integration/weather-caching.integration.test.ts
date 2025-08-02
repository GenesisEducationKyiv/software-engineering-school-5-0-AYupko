import { createWeatherService } from "@/business/services";
import { redis } from "@/business/lib/redis";

describe("Redis Integration Tests", () => {
  beforeAll(async () => {
    await redis.ping();
  });

  afterAll(async () => {
    await redis.flushall();
    await redis.quit();
  });

  it("should set and get a value from Redis", async () => {
    const key = "test-key";
    const value = "test-value";

    await redis.set(key, value);
    const result = await redis.get(key);

    expect(result).toBe(value);
  });

  it("should expire a key after the specified time", async () => {
    const key = "temp-key";
    const value = "temp-value";

    await redis.set(key, value, "EX", 1);
    const resultBeforeExpire = await redis.get(key);

    expect(resultBeforeExpire).toBe(value);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const resultAfterExpire = await redis.get(key);

    expect(resultAfterExpire).toBeNull();
  });

  it("should cache weather data and retrieve it from Redis", async () => {
    const city = "Kyiv";
    const cacheKey = `weather:${city.toLowerCase()}`;

    const mockWeatherData = { temperature: 25, condition: "Sunny" };

    const mockWeatherProvider = jest.fn().mockResolvedValue({
      success: true,
      data: mockWeatherData,
    });

    const testService = createWeatherService({
      weatherProvider: mockWeatherProvider,
      redis: redis,
    });

    const firstResponse = await testService.getWeather({ city });
    expect(firstResponse.weather).toEqual(mockWeatherData);

    const cachedData = await redis.get(cacheKey);
    expect(cachedData).not.toBeNull();
    expect(JSON.parse(cachedData!)).toEqual(mockWeatherData);

    const secondResponse = await testService.getWeather({ city });
    expect(secondResponse.weather).toEqual(mockWeatherData);

    expect(mockWeatherProvider).toHaveBeenCalledTimes(1);
  });
});
