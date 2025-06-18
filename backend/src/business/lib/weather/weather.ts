import { weatherAPIResponseSchema, WeatherProvider } from "./types";
import { BadRequestError, NotFoundError } from "../error";
import { env } from "@/config";

export const getWeatherByCity: WeatherProvider = async ({ city }) => {
  const url = `${env.WEATHER_API_URL}/current.json?key=${
    env.WEATHER_API_KEY
  }&q=${encodeURIComponent(city)}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 400) {
      throw new BadRequestError("Invalid request");
    }

    if (response.status === 404) {
      throw new NotFoundError("City not found");
    }
  }

  const raw = await response.json();
  const current = raw?.current;

  try {
    const data = weatherAPIResponseSchema.parse(current);

    return {
      success: true,
      data: {
        temperature: data.temp_c,
        humidity: data.humidity,
        description: data.condition.text,
      },
    };
  } catch {
    return { success: false };
  }
};
