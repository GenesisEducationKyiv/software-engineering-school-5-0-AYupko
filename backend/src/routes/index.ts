import { FastifyInstance } from "fastify";
import { weatherRoutes } from "./weather";
import { subscriptionRoutes } from "./subscription";
import { healthcheckRoutes } from "./healthcheck";

const configureRoutes = async (fastify: FastifyInstance) => {
  const defaultPrefix = "api/";

  fastify.register(healthcheckRoutes, { prefix: defaultPrefix + "health" });

  fastify.register(weatherRoutes, { prefix: defaultPrefix + "weather" });

  fastify.register(subscriptionRoutes, { prefix: defaultPrefix });
};

export { configureRoutes };
