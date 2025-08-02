import Fastify from "fastify";
import cors from "@fastify/cors";

import { errorHandler } from "./plugins/error-handler";
import { Config } from "./config";

export const createApp = async (config: Config) => {
  const app = Fastify({
    logger: {
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
    },
  });

  await app.register(cors, { origin: true, credentials: true });

  app.setErrorHandler(errorHandler);

  return {
    start: () => app.listen({ port: config.port, host: "0.0.0.0" }),
    stop: () => app.close(),
    instance: app,
    address: `http://localhost:${config.port}`,
  };
};
