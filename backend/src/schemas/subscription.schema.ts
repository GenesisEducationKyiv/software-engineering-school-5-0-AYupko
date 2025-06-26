import { Frequency } from "@prisma/client";
import { z } from "zod";

const subscriptionBodySchema = z.object({
  email: z.string().email(),
  city: z.string().min(1),
  frequency: z.nativeEnum(Frequency),
});

type SubscriptionInput = z.infer<typeof subscriptionBodySchema>;

const subscriptionTokenParamsSchema = z.object({
  token: z.string().uuid(),
});

type SubscriptionTokenParams = z.infer<
  typeof subscriptionTokenParamsSchema
>;

export { subscriptionBodySchema, subscriptionTokenParamsSchema };

export type { SubscriptionInput, SubscriptionTokenParams };
