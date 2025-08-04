import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import {
  httpRequestDurationSeconds,
  httpRequestsTotal,
} from "@/business/lib/observability";

async function metricsPlugin(fastify: FastifyInstance) {
  fastify.addHook(
    "onResponse",
    (request: FastifyRequest, reply: FastifyReply, done) => {
      const route = request.routeOptions.url || request.url;

      if (route === "/api/metrics") {
        done();
        return;
      }

      httpRequestDurationSeconds
        .labels(request.method, route)
        .observe(reply.elapsedTime / 1000);

      httpRequestsTotal
        .labels(request.method, route, reply.statusCode.toString())
        .inc();

      done();
    }
  );
}

export default fp(metricsPlugin);
