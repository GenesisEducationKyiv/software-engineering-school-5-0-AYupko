import Fastify from "fastify";
import { config } from "./config";
import { WeatherClient } from "./clients/weather-client";
import { SubscriptionClient } from "./clients/subscription-client";
import { routes } from "./routes";
import formbody from "@fastify/formbody";

async function start() {
  const fastify = Fastify({ logger: true });
  fastify.register(formbody);
  const weatherClient = new WeatherClient(config.weatherServiceUrl);
  const subscriptionClient = new SubscriptionClient(
    config.subscriptionServiceUrl
  );

  fastify.decorate("weatherClient", weatherClient);
  fastify.decorate("subscriptionClient", subscriptionClient);

  await fastify.register(routes);

  try {
    await fastify.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`API Gateway listening on port ${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
