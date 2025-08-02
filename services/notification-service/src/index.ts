import { createApp } from "./app";
import {
  brokerManager,
  createSubscriptionConsumer,
} from "./business/lib/rabbitmq";
import { eventService } from "./business/services";
import { config } from "./config";

async function main() {
  const app = await createApp(true, config);

  const subscriptionConsumer = createSubscriptionConsumer({
    brokerManager,
    eventService,
  });

  await Promise.all([app.start(), subscriptionConsumer.start()]);
  
  console.log(`Notification Service listening on port ${config.port}`);
  console.log("Message consumer started and is waiting for messages.");
}

main().catch((err) => {
  console.error("Failed to start Notification Service:", err);
  process.exit(1);
});
