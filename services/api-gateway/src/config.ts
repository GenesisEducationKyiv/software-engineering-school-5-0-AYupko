import { z } from "zod";

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  nodeEnv: z.enum(["development", "production", "test"]),
  weatherServiceUrl: z.string(),
  subscriptionServiceUrl: z.string(),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  weatherServiceUrl: process.env.WEATHER_SERVICE_URL,
  subscriptionServiceUrl: process.env.SUBSCRIPTION_SERVICE_URL,
});

export type Config = z.infer<typeof configSchema>;
