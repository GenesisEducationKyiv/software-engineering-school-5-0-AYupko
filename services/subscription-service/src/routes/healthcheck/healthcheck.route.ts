import { FastifyInstance } from "fastify";

export const healthcheckRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    return { status: "ok" };
  });
};
