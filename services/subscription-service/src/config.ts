import { z } from "zod";

const configSchema = z.object({
  port: z.coerce.number().default(3002),
  nodeEnv: z.enum(["development", "production", "test"]),
  databaseUrl: z.string(),
  resendApiKey: z.string(),
  resendApiUrl: z.string(),
  baseApiUrl: z.string(),
  rabbitMqUrl: z.string(),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  resendApiKey: process.env.RESEND_API_KEY,
  resendApiUrl: process.env.RESEND_API_URL,
  baseApiUrl: process.env.BASE_API_URL,
  rabbitMqUrl: process.env.RABBITMQ_URL,
});

export type Config = z.infer<typeof configSchema>;
