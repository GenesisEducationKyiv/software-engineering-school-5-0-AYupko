import { register } from "@/business/lib/observability/metrics";
import { FastifyInstance } from "fastify";

export const metricsRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    reply.type("text/plain");
    return await register.metrics();
  });
};
