import { Logger } from "pino";
import { openWeatherProvider, weatherAPIProvider } from "./providers";
import { WeatherProviderFn } from "./types";
import { logger } from "../logger";

type ProviderWithName = {
  name: string;
  fn: WeatherProviderFn;
};

export const chainProviders = (
  providers: ProviderWithName[],
  logger: Logger
): WeatherProviderFn => {
  return async ({ city }) => {
    for (const { fn } of providers) {
      const result = await fn({ city }, logger);

      if (result.success) return result;
    }

    return { success: false };
  };
};

export const chainedWeatherProviders = chainProviders(
  [
    { name: "weatherapi.com", fn: weatherAPIProvider },
    { name: "openweathermap.org", fn: openWeatherProvider },
  ],
  logger
);
