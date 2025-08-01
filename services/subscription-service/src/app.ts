import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { errorHandler } from "./plugins/error-handler";
import { configureRoutes } from "./routes";
import { scheduleMessageRelay } from "./business/crons/message-relay.cron";

export const createApp = async (logger = true, config = { port: 3002 }) => {
  const app = Fastify({ logger });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(formbody);

  configureRoutes(app);
  scheduleMessageRelay();

  app.setErrorHandler(errorHandler);

  return {
    start: () => app.listen({ port: config.port, host: "0.0.0.0" }),
    stop: () => app.close(),
    instance: app,
    address: `http://localhost:${config.port}`,
  };
};
