import {
  brokerManager,
  BrokerManager,
  EXCHANGE_NAME,
} from "@/business/lib/rabbitmq";
import {
  outboxRepository,
  OutboxRepository,
} from "@/database/repositories/outbox-event";
import { FastifyBaseLogger } from "fastify";

export const createOutboxService = ({
  outboxRepository,
  brokerManager,
}: {
  outboxRepository: OutboxRepository;
  brokerManager: BrokerManager;
}) => {
  const processOutboxEvents = async (logger: FastifyBaseLogger) => {
    const notProcessedEvents = await outboxRepository.findNotProcessed();

    if (notProcessedEvents.length === 0) {
      return;
    }

    const channel = await brokerManager.getChannel();

    for (const event of notProcessedEvents) {
      try {
        channel.publish(
          EXCHANGE_NAME,
          event.topic,
          Buffer.from(JSON.stringify(event.payload)),
          { persistent: true }
        );

        await outboxRepository.updateProcessed({ id: event.id });
      } catch (error) {
        logger.error(
          { err: error, eventId: event.id },
          `[Outbox Service] Error processing event`
        );
      }
    }
  };

  return {
    processOutboxEvents,
  };
};

export const outboxService = createOutboxService({
  outboxRepository,
  brokerManager,
});
