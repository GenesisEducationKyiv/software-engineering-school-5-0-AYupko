import { sendConfirmationEmail } from "@/business/lib/emails";
import { SendConfirmationEmail } from "@/business/lib/emails/types";
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
    const subscription = await subscriptionRepository.findFirst({
      where: { email: payload.email, city: payload.city },
      select: { id: true },
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
    const subscription = await subscriptionRepository.findFirst({
      where: { token },
      select: { id: true },
    });

    if (!subscription) {
      throw new NotFoundError("Token not found");
    }

    await subscriptionRepository.update({
      where: { id: subscription.id },
      data: { confirmed: true },
    });
  };

  const unsubscribe = async ({ token }: { token: string }) => {
    const subscription = await subscriptionRepository.findFirst({
      where: { token },
      select: { id: true },
    });

    if (!subscription) {
      throw new NotFoundError("Token not found");
    }

    await subscriptionRepository.deleteOne({
      where: { id: subscription.id },
    });
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
