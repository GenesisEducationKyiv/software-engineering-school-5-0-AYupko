import { FastifyInstance } from "fastify";
import { weatherRoutes } from "./weather";
import { subscriptionRoutes } from "./subscription";

const configureRoutes = async (fastify: FastifyInstance) => {
  const defaultPrefix = "api/";

  fastify.register(weatherRoutes, { prefix: defaultPrefix + "weather" });

  fastify.register(subscriptionRoutes, { prefix: defaultPrefix });
};

export { configureRoutes };
