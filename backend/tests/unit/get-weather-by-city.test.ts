import { getWeatherByCity } from "@/business/lib/weather";
import { BadRequestError, NotFoundError } from "@/business/lib/error";

describe("getWeatherByCity", () => {
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

  it("returns parsed weather data on successful response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validResponse,
    });

    const result = await getWeatherByCity({ city: "Lviv" });

    expect(result).toEqual({
      success: true,
      data: {
        temperature: 12,
        humidity: 80,
        description: "Sunny",
      },
    });
  });

  it("throws BadRequestError on 400 response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    await expect(getWeatherByCity({ city: "!!!" })).rejects.toThrow(
      BadRequestError
    );
  });

  it("throws NotFoundError on 404 response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(getWeatherByCity({ city: "UnknownCity" })).rejects.toThrow(
      NotFoundError
    );
  });

  it("returns success: false when schema parsing fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current: {},
      }),
    });

    const result = await getWeatherByCity({ city: "InvalidData" });

    expect(result.success).toBe(false);
  });
});
