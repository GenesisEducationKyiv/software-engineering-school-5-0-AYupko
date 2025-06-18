import { InternalServerError } from "@/business/lib/error";
import { getWeatherByCity, WeatherProvider } from "@/business/lib/weather";

export const createWeatherService = ({
  weatherProvider,
}: {
  weatherProvider: WeatherProvider;
}) => ({
  async getWeather({ city }: { city: string }) {
    const response = await weatherProvider({ city });

    if (!response.success) {
      throw new InternalServerError("Failed to fetch weather data");
    }

    return { weather: response.data };
  },
});

export const weatherService = createWeatherService({
  weatherProvider: getWeatherByCity,
});
