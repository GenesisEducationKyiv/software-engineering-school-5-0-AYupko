import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { errorHandler } from "./plugins/error-handler";
import { configureRoutes } from "./routes";
import { scheduleMessageRelay } from "./business/crons/message-relay.cron";
import { Config } from "./config";
import { brokerManager } from "./business/lib/rabbitmq";

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

  brokerManager.setLogger(app.log);

  await app.register(cors, { origin: true, credentials: true });
  await app.register(formbody);

  configureRoutes(app);
  scheduleMessageRelay(app.log);

  app.setErrorHandler(errorHandler);

  return {
    start: () => app.listen({ port: config.port, host: "0.0.0.0" }),
    stop: () => app.close(),
    instance: app,
    address: `http://localhost:${config.port}`,
  };
};
