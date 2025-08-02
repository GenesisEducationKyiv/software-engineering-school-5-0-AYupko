jest.mock("@/business/lib/observability/logger", () => ({
  logToFile: jest.fn(),
}));

import { BadRequestError, NotFoundError } from "@/business/lib/error";
import { chainedWeatherProviders } from "@/business/lib/weather/chain";

describe("chainedWeatherProviders", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const validResponse = {
    current: {
      temp_c: 12,
      humidity: 80,
      condition: { text: "Sunny" },
    },
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns weather data from the first successful provider", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validResponse,
    });

    const result = await chainedWeatherProviders({ city: "Lviv" });

    expect(result).toEqual({
      success: true,
      data: {
        temperature: 12,
        humidity: 80,
        description: "Sunny",
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("does not call second provider if first provider returns success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current: {
          temp_c: 10,
          humidity: 55,
          condition: { text: "Clear" },
        },
      }),
    });

    const result = await chainedWeatherProviders({ city: "Kyiv" });

    expect(result).toEqual({
      success: true,
      data: {
        temperature: 10,
        humidity: 55,
        description: "Clear",
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to second provider if first one fails", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ current: {} }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 15, humidity: 60 },
          weather: [{ description: "Cloudy" }],
        }),
      });

    const result = await chainedWeatherProviders({ city: "Kyiv" });

    expect(result).toEqual({
      success: true,
      data: {
        temperature: 15,
        humidity: 60,
        description: "Cloudy",
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws BadRequestError from the first provider", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    await expect(chainedWeatherProviders({ city: "!!!" })).rejects.toThrow(
      BadRequestError
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("throws NotFoundError from the first provider", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      chainedWeatherProviders({ city: "UnknownCity" })
    ).rejects.toThrow(NotFoundError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("returns { success: false } if all providers fail", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ current: {} }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ main: {} }),
      });

    const result = await chainedWeatherProviders({ city: "NoDataCity" });

    expect(result).toEqual({ success: false });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
