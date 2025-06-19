import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { configureRoutes } from "./routes";

export const createApp = async (logger = true, config = { PORT: 3000 }) => {
  const app = Fastify({ logger });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(formbody);
  configureRoutes(app);

  return {
    start: () => app.listen({ port: config.PORT, host: "0.0.0.0" }),
    stop: () => app.close(),
    instance: app,
    address: `http://localhost:${config.PORT}`,
  };
};
