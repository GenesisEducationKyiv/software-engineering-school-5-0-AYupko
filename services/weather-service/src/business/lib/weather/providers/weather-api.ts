import { config } from "@/config";
import { weatherAPIResponseSchema, WeatherProviderFn } from "../types";
import { BadRequestError, NotFoundError } from "../../error";

export const weatherAPIProvider: WeatherProviderFn = async (
  { city },
  logger
) => {
  const url = `${config.weatherApiUrl}/current.json?key=${
    config.weatherApiKey
  }&q=${encodeURIComponent(city)}`;

  const response = await fetch(url);

  logger.info({ msg: "Fetching weather data from WeatherAPI", city, url });

  if (!response.ok) {
    logger.error({
      msg: "WeatherAPI returned an error",
      status: response.status,
      city,
    });

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
