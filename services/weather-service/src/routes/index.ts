import { FastifyInstance } from "fastify";
import { weatherRoutes } from "./weather";
import { healthcheckRoutes } from "./healthcheck";
import { metricsRoutes } from "./metrics";

const configureRoutes = async (fastify: FastifyInstance) => {
  const defaultPrefix = "api/";

  fastify.register(healthcheckRoutes, { prefix: defaultPrefix + "health" });

  fastify.register(metricsRoutes, { prefix: defaultPrefix + "metrics" });

  fastify.register(weatherRoutes, { prefix: defaultPrefix + "weather" });

};

export { configureRoutes };
