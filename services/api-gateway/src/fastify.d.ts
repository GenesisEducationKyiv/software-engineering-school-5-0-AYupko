import { SubscriptionClient } from "./clients/subscription-client";
import { WeatherClient } from "./clients/weather-client";

declare module "fastify" {
  interface FastifyInstance {
    weatherClient: WeatherClient;
    subscriptionClient: SubscriptionClient;
  }
}
