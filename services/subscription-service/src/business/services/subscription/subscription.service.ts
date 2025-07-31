import { ConflictError, NotFoundError } from "@/business/lib/error";
import { prisma } from "@/database/prisma";
import {
  SubscriptionRepository,
  subscriptionRepository,
} from "@/database/repositories";
import {
  outboxRepository,
  OutboxRepository,
} from "@/database/repositories/outbox-event";
import { SubscriptionInput } from "@/schemas/subscription.schema";
import { randomUUID } from "crypto";

const createSubscriptionService = ({
  subscriptionRepository,
  outboxRepository,
}: {
  subscriptionRepository: SubscriptionRepository;
  outboxRepository: OutboxRepository;
}) => {
  const subscribe = async ({ payload }: { payload: SubscriptionInput }) => {
    const subscription = await subscriptionRepository.findByEmail({
      email: payload.email,
      city: payload.city,
    });

    if (subscription) {
      throw new ConflictError("Email already subscribed");
    }

    const token = randomUUID();

    await prisma.$transaction(async (tx) => {
      await subscriptionRepository.create(
        {
          email: payload.email,
          frequency: payload.frequency,
          city: payload.city,
          token,
        },
        tx
      );

      await outboxRepository.create(
        {
          topic: "subscription.events",
          payload: {
            type: "SUBSCRIPTION_CREATED",
            recepientEmail: payload.email,
            confirmationToken: token,
          },
        },
        tx
      );
    });
  };

  const confirmSubscription = async ({ token }: { token: string }) => {
    const subscription = await subscriptionRepository.findByToken({ token });

    if (!subscription) {
      throw new NotFoundError("Token not found");
    }

    await subscriptionRepository.confirmById({ id: subscription.id });
  };

  const unsubscribe = async ({ token }: { token: string }) => {
    const subscription = await subscriptionRepository.findByToken({ token });

    if (!subscription) {
      throw new NotFoundError("Token not found");
    }

    await subscriptionRepository.deleteById({ id: subscription.id });
  };

  return {
    subscribe,
    confirmSubscription,
    unsubscribe,
  };
};

export const subscriptionService = createSubscriptionService({
  subscriptionRepository,
  outboxRepository,
});
