import { Frequency, Prisma, Subscription } from "@prisma/client";
import { prisma } from "@/database/prisma";

type SubscriptionRepository = {
  create: (
    {
      email,
      frequency,
      city,
      token,
    }: {
      email: string;
      frequency: Frequency;
      city: string;
      token: string;
    },
    tx?: Prisma.TransactionClient
  ) => Promise<Subscription>;

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

  create: async (payload) => prisma.subscription.create({ data: payload }),
};

export { subscriptionRepository, SubscriptionRepository };
