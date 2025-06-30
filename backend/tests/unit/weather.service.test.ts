import { InternalServerError } from "@/business/lib/error";
import { createWeatherService } from "@/business/services";
import Redis from "ioredis";
import { createMockRedis } from "tests/mocks/redis";

describe("weatherService", () => {
  const validWeather = {
    temperature: 10,
    humidity: 80,
    description: "Cloudy",
  };

  let mockRedis: jest.Mocked<Redis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
  });

  it("returns weather when provider is successful", async () => {
    const mockProvider = jest.fn().mockResolvedValue({
      success: true,
      data: validWeather,
    });

    const service = createWeatherService({
      weatherProvider: mockProvider,
      redis: mockRedis,
    });
    const result = await service.getWeather({ city: "Lviv" });

    expect(result.weather).toEqual(validWeather);
  });

  it("throws InternalServerError when provider fails", async () => {
    const mockProvider = jest.fn().mockResolvedValue({ success: false });

    const service = createWeatherService({
      weatherProvider: mockProvider,
      redis: mockRedis,
    });

    await expect(service.getWeather({ city: "FailCity" })).rejects.toThrow(
      InternalServerError
    );
  });
});
