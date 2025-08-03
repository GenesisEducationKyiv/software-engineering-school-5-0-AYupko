import { config } from "@/config";
import pino from "pino";

export const logger = pino({
  level: config.logLevel,
  base: null,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  transport:
    config.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});
