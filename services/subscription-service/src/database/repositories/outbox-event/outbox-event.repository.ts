import { OutboxEvent, Prisma } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { SubscriptionOutboxPayload } from "@/schemas/outbox.schema";

type OutboxRepository = {
  create: (
    {
      topic,
      payload,
    }: {
      topic: string;
      payload: SubscriptionOutboxPayload;
    },
    tx?: Prisma.TransactionClient
  ) => Promise<OutboxEvent>;

  findNotProcessed: () => Promise<OutboxEvent[]>;

  updateProcessed: ({ id }: { id: string }) => Promise<void>;
};

const outboxRepository: OutboxRepository = {
  create: async ({ topic, payload }, tx) => {
    return (tx || prisma).outboxEvent.create({
      data: {
        topic,
        payload,
      },
    });
  },

  findNotProcessed: async () => {
    return prisma.outboxEvent.findMany({
      where: { processedAt: null },
    });
  },

  updateProcessed: async ({ id }) => {
    await prisma.outboxEvent.update({
      where: { id },
      data: { processedAt: new Date() },
    });
  },
};

export { outboxRepository, OutboxRepository };
