import Fastify from "fastify";
import cors from "@fastify/cors";

import { errorHandler } from "./plugins/error-handler";

export const createApp = async (logger = true, config = { port: 3003 }) => {
  const app = Fastify({ logger });

  await app.register(cors, { origin: true, credentials: true });

  app.setErrorHandler(errorHandler);

  return {
    start: () => app.listen({ port: config.port, host: "0.0.0.0" }),
    stop: () => app.close(),
    instance: app,
    address: `http://localhost:${config.port}`,
  };
};
