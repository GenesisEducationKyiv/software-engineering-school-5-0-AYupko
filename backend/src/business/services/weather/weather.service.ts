import { InternalServerError } from "@/business/lib/error";
import { getWeatherByCity } from "@/business/lib/weather/weather";

const getWeather = async ({ city }: { city: string }) => {
  const response = await getWeatherByCity({ city });

  if (!response.success) {
    throw new InternalServerError("Failed to fetch weather data");
  }

  return { weather: response.data };
};

export const weatherService = {
  getWeather,
};
