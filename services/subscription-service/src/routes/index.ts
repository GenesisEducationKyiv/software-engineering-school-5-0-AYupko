import { FastifyInstance } from "fastify";
import { subscriptionRoutes } from "./subscription";
import { healthcheckRoutes } from "./healthcheck";

const configureRoutes = async (fastify: FastifyInstance) => {
  const defaultPrefix = "api/";

  fastify.register(subscriptionRoutes, {
    prefix: defaultPrefix,
  });

  fastify.register(healthcheckRoutes, { prefix: defaultPrefix + "health" });
};

export { configureRoutes };
