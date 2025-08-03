import { config } from "@/config";
import { openWeatherAPIResponseSchema, WeatherProviderFn } from "../types";
import { BadRequestError, NotFoundError } from "../../error";

export const openWeatherProvider: WeatherProviderFn = async (
  { city },
  logger
) => {
  const url = `${
    config.openWeatherMapApiUrl
  }/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${
    config.openWeatherMapApiKey
  }&units=metric`;

  logger.info({ msg: "Fetching weather data from OpenWeather", city, url });

  const response = await fetch(url);

  if (!response.ok) {
    logger.error({
      msg: "OpenWeather API returned an error",
      status: response.status,
      city,
    });

    if (response.status === 400) {
      logger.error(`Bad Request: ${city}`);
      throw new BadRequestError("Invalid request");
    }

    if (response.status === 404) {
      logger.error(`Not Found: ${city}`);
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
