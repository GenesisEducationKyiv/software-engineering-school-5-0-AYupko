import { z } from "zod";

const getWeatherQuerySchema = z.object({
  city: z.string().min(1),
});

type GetWeatherQuery = z.infer<typeof getWeatherQuerySchema>;

const weatherResponseSchema = z.object({
  temperature: z.number().describe("Current temperature"),
  humidity: z.number().describe("Current humidity percentage"),
  description: z.string().describe("Weather description"),
});

type GetWeatherResponse = z.infer<typeof weatherResponseSchema>;

export { getWeatherQuerySchema, weatherResponseSchema };

export type { GetWeatherQuery, GetWeatherResponse };
