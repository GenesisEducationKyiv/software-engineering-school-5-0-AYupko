import { FastifyInstance } from "fastify";

export async function weatherRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    const { city } = request.query as { city: string };
    const weather = await fastify.weatherClient.getWeather(city);
    reply.send(weather);
  });
}
