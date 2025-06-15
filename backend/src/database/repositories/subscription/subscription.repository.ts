import { Prisma, prisma } from "@/database/prisma";

type SubscriptionRepository = {
  findFirst: <T extends Prisma.SubscriptionFindFirstArgs>(
    payload: Prisma.SelectSubset<T, Prisma.SubscriptionFindFirstArgs>
  ) => Promise<Prisma.SubscriptionGetPayload<T> | null>;

  create: <T extends Prisma.SubscriptionCreateArgs>(
    payload: Prisma.SelectSubset<T, Prisma.SubscriptionCreateArgs>
  ) => Promise<Prisma.SubscriptionGetPayload<T>>;

  update: <T extends Prisma.SubscriptionUpdateArgs>(
    payload: Prisma.SelectSubset<T, Prisma.SubscriptionUpdateArgs>
  ) => Promise<Prisma.SubscriptionGetPayload<T>>;

  deleteOne: <T extends Prisma.SubscriptionDeleteArgs>(
    payload: Prisma.SelectSubset<T, Prisma.SubscriptionDeleteArgs>
  ) => Promise<Prisma.SubscriptionGetPayload<T>>;
};

const subscriptionRepository: SubscriptionRepository = {
  findFirst: async (payload) => prisma.subscription.findFirst(payload),
  create: async (payload) => prisma.subscription.create(payload),
  update: async (payload) => prisma.subscription.update(payload),
  deleteOne: async (payload) => prisma.subscription.delete(payload),
};

export { subscriptionRepository, SubscriptionRepository };
