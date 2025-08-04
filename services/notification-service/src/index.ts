import { createApp } from "./app";
import { eventConsumer } from "./business/lib/rabbitmq";

import { config } from "./config";

async function main() {
  const app = await createApp(config);

  await Promise.all([app.start(), eventConsumer.start()]);

  console.log(`Notification Service listening on port ${config.port}`);
}

main().catch((err) => {
  console.error("Failed to start Notification Service:", err);
  process.exit(1);
});
