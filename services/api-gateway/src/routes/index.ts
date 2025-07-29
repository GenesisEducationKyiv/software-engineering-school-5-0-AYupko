import { FastifyInstance } from "fastify";
import { weatherRoutes } from "./weather";
import { subscriptionRoutes } from "./subscription";
import { healthRoutes } from "./health";

export async function routes(fastify: FastifyInstance) {
  await fastify.register(weatherRoutes, { prefix: "/api/weather" });
  await fastify.register(subscriptionRoutes, { prefix: "/api/" });
  await fastify.register(healthRoutes, { prefix: "/api/health" });
}
