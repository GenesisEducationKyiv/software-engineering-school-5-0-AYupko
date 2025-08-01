import cron from "node-cron";
import { outboxService } from "../services/outbox-service";

export const scheduleMessageRelay = () => {
  cron.schedule("*/10 * * * * *", outboxService.processOutboxEvents);
};
