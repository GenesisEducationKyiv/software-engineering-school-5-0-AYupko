import cron from "node-cron";
import { outboxService } from "../services/outbox-service";
import { FastifyBaseLogger } from "fastify";

export const scheduleMessageRelay = (logger: FastifyBaseLogger) => {
  cron.schedule("0 * * * *", () => {
    logger.info("Running message relay cron job");
    outboxService.processOutboxEvents(logger);
  });
};
