import { config } from "../../../../config";
import { openWeatherAPIResponseSchema, WeatherProviderFn } from "../types";
import { BadRequestError, NotFoundError } from "../../error";

export const openWeatherProvider: WeatherProviderFn = async ({ city }) => {
  const url = `${
    config.openWeatherMapApiUrl
  }/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${
    config.openWeatherMapApiKey
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
