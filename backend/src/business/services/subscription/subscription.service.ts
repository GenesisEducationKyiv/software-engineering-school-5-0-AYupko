import {
  SendConfirmationEmail,
  sendConfirmationEmail,
} from "@/business/lib/emails";
import { ConflictError, NotFoundError } from "@/business/lib/error";
import {
  SubscriptionRepository,
  subscriptionRepository,
} from "@/database/repositories";
import { SubscriptionInput } from "@/schemas/subscription.schema";
import { randomUUID } from "crypto";

const createSubscriptionService = ({
  subscriptionRepository,
  sendConfirmationEmail,
}: {
  subscriptionRepository: SubscriptionRepository;
  sendConfirmationEmail: SendConfirmationEmail;
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

    await subscriptionRepository.create({
      data: {
        email: payload.email,
        frequency: payload.frequency,
        city: payload.city,
        token,
      },
    });

    await sendConfirmationEmail({ to: payload.email, token });
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
  sendConfirmationEmail,
});
