import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { Config } from "./config";
import { errorHandler } from "./plugins/error-handler";
import { configureRoutes } from "./routes";

export const createApp = async (logger = true, config: Config) => {
  const app = Fastify({ logger });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(formbody);

  configureRoutes(app);

  app.setErrorHandler(errorHandler);

  return {
    start: () => app.listen({ port: config.port, host: "0.0.0.0" }),
    stop: () => app.close(),
    instance: app,
    address: `http://localhost:${config.port}`,
  };
};
