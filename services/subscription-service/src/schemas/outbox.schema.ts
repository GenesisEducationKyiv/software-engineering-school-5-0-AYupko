import { z } from "zod";

const subscriptionOutboxPayloadSchema = z.object({
  type: z.string(),
  recipientEmail: z.string().email(),
  confirmationToken: z.string().uuid(),
});

type SubscriptionOutboxPayload = z.infer<typeof subscriptionOutboxPayloadSchema>;

export { subscriptionOutboxPayloadSchema };

export type { SubscriptionOutboxPayload };
