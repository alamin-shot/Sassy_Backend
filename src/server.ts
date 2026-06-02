// backend/src/server.ts
import app from "./app";
import connectWithRetry from "./config/db";
import { env } from "./config/env";

const start = async () => {
  await connectWithRetry();
  app.listen(env.PORT, () => {
    console.log(
      `🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`,
    );
  });
};

start();
