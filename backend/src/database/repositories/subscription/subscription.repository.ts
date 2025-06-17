import { Prisma, prisma } from "@/database/prisma";
import { Subscription } from "@prisma/client";

type SubscriptionRepository = {
  create: <T extends Prisma.SubscriptionCreateArgs>(
    payload: Prisma.SelectSubset<T, Prisma.SubscriptionCreateArgs>
  ) => Promise<Prisma.SubscriptionGetPayload<T>>;

  findByEmail: ({
    email,
    city,
  }: {
    email: string;
    city: string;
  }) => Promise<Subscription | null>;

  findByToken: ({ token }: { token: string }) => Promise<Subscription | null>;

  confirmById: ({ id }: { id: string }) => Promise<void>;

  deleteById: ({ id }: { id: string }) => Promise<void>;
};

const subscriptionRepository: SubscriptionRepository = {
  findByEmail: async ({ email, city }) =>
    prisma.subscription.findFirst({ where: { email, city } }),

  findByToken: async ({ token }) =>
    prisma.subscription.findFirst({ where: { token } }),

  confirmById: async ({ id }) => {
    await prisma.subscription.update({
      where: { id },
      data: { confirmed: true },
    });
  },

  deleteById: async ({ id }) => {
    await prisma.subscription.delete({
      where: { id },
    });
  },

  create: async (payload) => prisma.subscription.create(payload),
};

export { subscriptionRepository, SubscriptionRepository };
