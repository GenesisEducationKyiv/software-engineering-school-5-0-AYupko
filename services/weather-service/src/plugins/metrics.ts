import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import {
  incrementHttpRequest,
  observeHttpRequestDuration,
} from "../business/lib";

async function metricsPlugin(fastify: FastifyInstance) {
  fastify.addHook(
    "onResponse",
    (request: FastifyRequest, reply: FastifyReply, done) => {
      if (request.routeOptions.url === "/api/metrics") {
        done();
        return;
      }

      const route = request.routeOptions.url || request.url;
      const durationInSeconds = reply.elapsedTime / 1000;

      observeHttpRequestDuration(request.method, route, durationInSeconds);
      incrementHttpRequest(request.method, route, reply.statusCode.toString());

      done();
    }
  );
}

export default fp(metricsPlugin);
