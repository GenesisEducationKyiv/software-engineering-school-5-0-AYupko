import { InternalServerError } from "@/business/lib/error";
import { WeatherProviderFn } from "@/business/lib/weather";
import { chainedWeatherProviders } from "@/business/lib/weather/chain";

export const createWeatherService = ({
  weatherProvider,
}: {
  weatherProvider: WeatherProviderFn;
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
  weatherProvider: chainedWeatherProviders,
});
