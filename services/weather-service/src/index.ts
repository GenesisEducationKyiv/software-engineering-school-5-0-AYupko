import { createApp } from "./app";
import { config } from "./config";

createApp(config)
  .then((app) =>
    app
      .start()
      .then(() =>
        console.log(`Weather Service listening on port ${config.port}`)
      )
  )
  .catch((err) => {
    console.error("Failed to start Weather Service:", err);
    process.exit(1);
  });
