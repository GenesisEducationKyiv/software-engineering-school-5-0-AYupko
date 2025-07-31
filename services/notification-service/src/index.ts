import { createApp } from "./app";
import { config } from "./config";

createApp(true, config)
  .then((app) =>
    app
      .start()
      .then(() =>
        console.log(`Notification Service listening on port ${config.port}`)
      )
  )
  .catch((err) => {
    console.error("Failed to start Notification Service:", err);
    process.exit(1);
  });
