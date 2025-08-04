import { Logger } from "pino";
import { z } from "zod";

export const weatherAPIResponseSchema = z.object({
  temp_c: z.number(),
  humidity: z.number(),
  condition: z.object({
    text: z.string(),
  }),
});

export type WeatherAPIResponse = z.infer<typeof weatherAPIResponseSchema>;

export const openWeatherAPIResponseSchema = z.object({
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
  }),
  weather: z
    .array(
      z.object({
        description: z.string(),
      })
    )
    .nonempty(),
});

export type OpenWeatherAPIResponse = z.infer<
  typeof openWeatherAPIResponseSchema
>;

type WeatherSuccess = {
  success: true;
  data: {
    temperature: number;
    humidity: number;
    description: string;
  };
};

type WeatherFailure = {
  success: false;
};

export type WeatherResult = WeatherSuccess | WeatherFailure;

export type WeatherProviderFn = (
  params: {
    city: string;
  },
  logger: Logger
) => Promise<WeatherResult>;
