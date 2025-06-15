import {
  weatherAPIResponseSchema,
  WeatherFailure,
  WeatherSuccess,
} from "./types";
import { BadRequestError, NotFoundError } from "../error";

const BASE_URL = "http://api.weatherapi.com/v1";

export const getWeatherByCity = async ({
  city,
}: {
  city: string;
}): Promise<WeatherSuccess | WeatherFailure> => {
  const url = `${BASE_URL}/current.json?key=${
    process.env.WEATHER_API_KEY
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
