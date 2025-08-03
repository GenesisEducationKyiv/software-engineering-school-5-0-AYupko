import Fastify from "fastify";
import cors from "@fastify/cors";

import { errorHandler } from "./plugins/error-handler";
import { Config } from "./config";

export const createApp = async (config: Config) => {
  const app = Fastify();

  await app.register(cors, { origin: true, credentials: true });

  app.setErrorHandler(errorHandler);

  return {
    start: () => app.listen({ port: config.port, host: "0.0.0.0" }),
    stop: () => app.close(),
    instance: app,
    address: `http://localhost:${config.port}`,
  };
};
