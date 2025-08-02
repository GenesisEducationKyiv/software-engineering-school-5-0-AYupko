import { config } from "@/config";
import Redis from "ioredis";

const redis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
});

export { redis };
