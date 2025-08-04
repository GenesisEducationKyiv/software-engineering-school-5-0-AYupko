import { z } from "zod";

const configSchema = z.object({
  port: z.coerce.number().default(3002),
  nodeEnv: z.enum(["development", "production", "test"]),
  databaseUrl: z.string(),
  baseApiUrl: z.string(),
  rabbitMqUrl: z.string(),
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  baseApiUrl: process.env.BASE_API_URL,
  rabbitMqUrl: process.env.RABBITMQ_URL,
  logLevel: process.env.LOG_LEVEL,
});

export type Config = z.infer<typeof configSchema>;
