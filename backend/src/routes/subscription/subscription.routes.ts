import {
  subscriptionBodySchema,
  subscriptionTokenParamsSchema,
} from "@/schemas/subscription.schema";
import { FastifyInstance } from "fastify";
import {
  confirmSubscription,
  subscribe,
  unsubscribe,
} from "./subscription.handlers";
import { zodToJsonSchema as $ref } from "zod-to-json-schema";
import { messageResponseSchema } from "@/schemas/application.schemas";

export const subscriptionRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/subscribe",
    {
      schema: {
        tags: ["subscription"],
        summary: "Subscribe to weather updates",
        description:
          "Subscribe an email to receive weather updates for a specific city with chosen frequency.",
        consumes: ["application/json", "application/x-www-form-urlencoded"],
        produces: ["application/json"],
        body: $ref(subscriptionBodySchema),
        response: {
          200: $ref(messageResponseSchema),
          400: { description: "Invalid input" },
          409: { description: "Email already subscribed" },
        },
      },
    },
    subscribe
  );

  fastify.get(
    "/confirm/:token",
    {
      schema: {
        tags: ["subscription"],
        summary: "Confirm email subscription",
        description:
          "Confirms a subscription using the token sent in the confirmation email.",
        params: $ref(subscriptionTokenParamsSchema),
        produces: ["application/json"],
        response: {
          200: { description: "Subscription confirmed successfully" },
          400: { description: "Invalid token" },
          404: { description: "Token not found" },
        },
      },
    },
    confirmSubscription
  );

  fastify.get(
    "/unsubscribe/:token",
    {
      schema: {
        tags: ["subscription"],
        summary: "Unsubscribe from weather updates",
        description:
          "Unsubscribes an email from weather updates using the token sent in emails.",
        params: $ref(subscriptionTokenParamsSchema),
        produces: ["application/json"],
        response: {
          200: { description: "Unsubscribed successfully" },
          400: { description: "Invalid token" },
          404: { description: "Token not found" },
        },
      },
    },
    unsubscribe
  );
};
