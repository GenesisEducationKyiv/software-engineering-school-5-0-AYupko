import {
  sendConfirmationEmail,
  SendConfirmationEmail,
} from "@/business/lib/emails";
import { ConsumeMessage } from "amqplib";

export interface EventService {
  (msg: ConsumeMessage): Promise<void>;
}

export const createEventService = ({
  sendConfirmationEmail,
}: {
  sendConfirmationEmail: SendConfirmationEmail;
}): EventService => {
  return async (msg: ConsumeMessage) => {
    const event = JSON.parse(msg.content.toString());

    if (event.type === "SUBSCRIPTION_CREATED") {
      await sendConfirmationEmail({
        to: event.recipientEmail,
        token: event.confirmationToken,
      });
    } else {
      console.warn(`[SubscriptionConsumer] Unknown event type: ${event.type}`);
    }
  };
};

export const eventService = createEventService({
  sendConfirmationEmail,
});
