import { Prisma, prisma } from "@/database/prisma";

const findFirst = <T extends Prisma.SubscriptionFindFirstArgs>(
  payload: Prisma.SelectSubset<T, Prisma.SubscriptionFindFirstArgs>
) => {
  return prisma.subscription.findFirst(payload);
};

const create = <T extends Prisma.SubscriptionCreateArgs>(
  payload: Prisma.SelectSubset<T, Prisma.SubscriptionCreateArgs>
) => prisma.subscription.create(payload);

const update = <T extends Prisma.SubscriptionUpdateArgs>(
  payload: Prisma.SelectSubset<T, Prisma.SubscriptionUpdateArgs>
) => prisma.subscription.update(payload);

const deleteOne = <T extends Prisma.SubscriptionDeleteArgs>(
  payload: Prisma.SelectSubset<T, Prisma.SubscriptionDeleteArgs>
) => prisma.subscription.delete(payload);

export const subscriptionRepository = {
  findFirst,
  create,
  update,
  deleteOne,
};
