import {
  brokerManager,
  BrokerManager,
  EXCHANGE_NAME,
} from "@/business/lib/rabbitmq";
import {
  outboxRepository,
  OutboxRepository,
} from "@/database/repositories/outbox-event";

const createOutboxService = ({
  outboxRepository,
  brokerManager,
}: {
  outboxRepository: OutboxRepository;
  brokerManager: BrokerManager;
}) => {
  const processOutboxEvents = async () => {
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
          Buffer.from(JSON.stringify(event.payload))
        );

        await outboxRepository.updateProcessed({ id: event.id });
      } catch (error) {
        console.error(
          `[Outbox Service] Error processing event ${event.id}:`,
          error
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
