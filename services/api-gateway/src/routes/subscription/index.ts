import { FastifyInstance } from "fastify";

export async function subscriptionRoutes(fastify: FastifyInstance) {
  fastify.post("/subscribe", async (request, reply) => {
    const { email, city, frequency } = request.body as {
      email: string;
      city: string;
      frequency: string;
    };
    const result = await fastify.subscriptionClient.createSubscription(
      email,
      city,
      frequency
    );
    reply.send(result);
  });

  fastify.get("/confirm/:token", async (request, reply) => {
    const { token } = request.params as { token: string };
    const result = await fastify.subscriptionClient.confirmSubscription(token);
    reply.send(result);
  });

  fastify.get("/unsubscribe/:token", async (request, reply) => {
    const { token } = request.params as { token: string };
    const result = await fastify.subscriptionClient.unsubscribe(token);
    reply.send(result);
  });
}
