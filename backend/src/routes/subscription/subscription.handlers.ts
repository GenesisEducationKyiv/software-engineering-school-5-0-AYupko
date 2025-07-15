import { subscriptionService } from "@/business/services";
import {
  SubscriptionInput,
  SubscriptionTokenParams,
} from "@/schemas/subscription.schema";
import { FastifyReply, FastifyRequest } from "fastify";

const subscribe = async (
  request: FastifyRequest<{ Body: SubscriptionInput }>,
  reply: FastifyReply
) => {
  const payload = request.body;

  await subscriptionService.subscribe({ payload });

  return reply.code(200).send({
    message: "Subscription successful. Confirmation email sent.",
  });
};

const confirmSubscription = async (
  request: FastifyRequest<{ Params: SubscriptionTokenParams }>,
  reply: FastifyReply
) => {
  const token = request.params.token;

  await subscriptionService.confirmSubscription({ token });

  return reply.code(200).send();
};

const unsubscribe = async (
  request: FastifyRequest<{ Params: SubscriptionTokenParams }>,
  reply: FastifyReply
) => {
  const token = request.params.token;

  await subscriptionService.unsubscribe({ token });

  return reply.code(200).send();
};

export { subscribe, confirmSubscription, unsubscribe };
