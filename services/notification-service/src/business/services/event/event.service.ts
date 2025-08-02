import {
  sendConfirmationEmail,
  SendConfirmationEmail,
} from "@/business/lib/emails";
import { ConsumeMessage } from "amqplib";
import { FastifyBaseLogger } from "fastify";

export interface EventService {
  processEvent: (msg: ConsumeMessage, log: FastifyBaseLogger) => Promise<void>;
}

export const createEventService = ({
  sendConfirmationEmail,
}: {
  sendConfirmationEmail: SendConfirmationEmail;
}): EventService => {
  const processEvent = async (msg: ConsumeMessage, log: FastifyBaseLogger) => {
    const event = JSON.parse(msg.content.toString());
    if (event.type === "SUBSCRIPTION_CREATED") {
      await sendConfirmationEmail({
        to: event.recipientEmail,
        token: event.confirmationToken,
      });
    } else {
      log.warn(`[EventService] Unknown event type: ${event.type}`);
    }
  };

  return {
    processEvent,
  };
};

export const eventService = createEventService({
  sendConfirmationEmail,
});
