import { InternalServerError } from "@/business/lib/error";
import { createWeatherService } from "@/business/services";

describe("weatherService", () => {
  const validWeather = {
    temperature: 10,
    humidity: 80,
    description: "Cloudy",
  };

  it("returns weather when provider is successful", async () => {
    const mockProvider = jest.fn().mockResolvedValue({
      success: true,
      data: validWeather,
    });

    const service = createWeatherService({ weatherProvider: mockProvider });
    const result = await service.getWeather({ city: "Lviv" });

    expect(result.weather).toEqual(validWeather);
  });

  it("throws InternalServerError when provider fails", async () => {
    const mockProvider = jest.fn().mockResolvedValue({ success: false });

    const service = createWeatherService({ weatherProvider: mockProvider });

    await expect(service.getWeather({ city: "FailCity" })).rejects.toThrow(
      InternalServerError
    );
  });
});
