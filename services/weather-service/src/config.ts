import { z } from "zod";

const configSchema = z.object({
  port: z.coerce.number().default(3001),
  nodeEnv: z.enum(["development", "production", "test"]),
  redisPort: z.coerce.number().default(6379),
  redisHost: z.string(),
  openWeatherMapApiKey: z.string(),
  openWeatherMapApiUrl: z.string(),
  weatherApiKey: z.string(),
  weatherApiUrl: z.string(),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  openWeatherMapApiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
  openWeatherMapApiUrl: process.env.OPEN_WEATHER_MAP_API_URL,
  weatherApiKey: process.env.WEATHER_API_KEY,
  weatherApiUrl: process.env.WEATHER_API_URL,
});

export type Config = z.infer<typeof configSchema>;
