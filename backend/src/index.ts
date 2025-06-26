import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";

import { configureRoutes } from "./routes";
import { env } from "./config";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    });

    await fastify.register(formbody);

    configureRoutes(fastify);

    await fastify.listen({
      port: Number(env.PORT) || 3000,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server ready at http://localhost:${env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
