import { FastifyInstance } from "fastify";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    reply.send({ status: "ok", timestamp: new Date().toISOString() });
  });
}
