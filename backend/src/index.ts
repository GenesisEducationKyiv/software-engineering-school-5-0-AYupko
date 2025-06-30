import { createApp } from "./app";
import { env } from "./config";

const config = {
  ...env,
  PORT: Number(env.PORT),
};

createApp(true, config)
  .then((app) =>
    app.start().then(() => console.log(`🚀 Server ready at ${app.address}`))
  )
  .catch((err) => {
    console.error("Failed to start app", err);
    process.exit(1);
  });
