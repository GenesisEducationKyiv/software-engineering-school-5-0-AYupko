import { openWeatherProvider, weatherAPIProvider } from "./providers";
import { WeatherProviderFn } from "./types";

type ProviderWithName = {
  name: string;
  fn: WeatherProviderFn;
};

export const chainProviders = (
  providers: ProviderWithName[]
): WeatherProviderFn => {
  return async ({ city }) => {
    for (const { fn } of providers) {
      const result = await fn({ city });

      // await logToFile(name, result);

      if (result.success) return result;
    }

    return { success: false };
  };
};

export const chainedWeatherProviders = chainProviders([
  { name: "weatherapi.com", fn: weatherAPIProvider },
  { name: "openweathermap.org", fn: openWeatherProvider },
]);
