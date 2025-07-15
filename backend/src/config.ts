import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  BASE_API_URL: z.string().min(1, "BASE_API_URL is required"),
  PORT: z.string(),

  RESEND_API_KEY: z.string(),
  RESEND_API_URL: z.string().url(),

  WEATHER_API_KEY: z.string().min(1, "WEATHER_API_KEY is required"),
  WEATHER_API_URL: z.string().min(1, "WEATHER_API_URL is required"),

  OPEN_WEATHER_MAP_API_URL: z
    .string()
    .min(1, "OPEN_WEATHER_MAP_API_URL is required"),

  OPEN_WEATHER_MAP_API_KEY: z
    .string()
    .min(1, "OPEN_WEATHER_MAP_API_KEY is required"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BASE_API_URL: process.env.BASE_API_URL,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_API_URL: process.env.RESEND_API_URL,

  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  WEATHER_API_URL: process.env.WEATHER_API_URL,

  OPEN_WEATHER_MAP_API_URL: process.env.OPEN_WEATHER_MAP_API_URL,
  OPEN_WEATHER_MAP_API_KEY: process.env.OPEN_WEATHER_MAP_API_KEY,
});
