import { BadRequestError, NotFoundError } from "../../error";
import { openWeatherAPIResponseSchema, WeatherProviderFn } from "../types";
import { env } from "@/config";

export const openWeatherProvider: WeatherProviderFn = async ({ city }) => {
  const url = `${
    env.OPEN_WEATHER_MAP_API_URL
  }/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${
    env.OPEN_WEATHER_MAP_API_KEY
  }&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 400) {
      throw new BadRequestError("Invalid request");
    }

    if (response.status === 404) {
      throw new NotFoundError("City not found");
    }

    return { success: false };
  }

  const raw = await response.json();

  try {
    const data = openWeatherAPIResponseSchema.parse(raw);

    return {
      success: true,
      data: {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
      },
    };
  } catch {
    return { success: false };
  }
};
