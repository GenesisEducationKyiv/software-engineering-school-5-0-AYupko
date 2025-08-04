import Fastify from "fastify";
import { config } from "./config";
import { WeatherClient } from "./clients/weather-client";
import { SubscriptionClient } from "./clients/subscription-client";
import { routes } from "./routes";
import formbody from "@fastify/formbody";
import metricsPlugin from "./plugins/metrics";

async function start() {
  const fastify = Fastify({
    logger: {
      level: config.logLevel,
      base: null,
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      transport:
        config.nodeEnv === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  fastify.register(formbody);
  await fastify.register(metricsPlugin);

  const weatherClient = new WeatherClient(
    config.weatherServiceUrl,
    fastify.log
  );
  const subscriptionClient = new SubscriptionClient(
    config.subscriptionServiceUrl,
    fastify.log
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
