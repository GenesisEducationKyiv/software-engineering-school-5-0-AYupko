jest.mock("@/business/lib/redis");

import { InternalServerError } from "@/business/lib/error";
import { createWeatherService } from "@/business/services";
import { redis } from "@/business/lib/redis";

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

describe("weatherService", () => {
  const validWeather = {
    temperature: 10,
    humidity: 80,
    description: "Cloudy",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns weather when provider is successful", async () => {
    const mockProvider = jest.fn().mockResolvedValue({
      success: true,
      data: validWeather,
    });

    const service = createWeatherService({
      weatherProvider: mockProvider,
      redis: redis,
      logger: mockLogger as any,
    });
    const result = await service.getWeather({ city: "Lviv" });

    expect(result.weather).toEqual(validWeather);
  });

  it("throws InternalServerError when provider fails", async () => {
    const mockProvider = jest.fn().mockResolvedValue({ success: false });

    const service = createWeatherService({
      weatherProvider: mockProvider,
      redis: redis,
      logger: mockLogger as any,
    });

    await expect(service.getWeather({ city: "FailCity" })).rejects.toThrow(
      InternalServerError
    );
  });
});
