import { env } from "@/config";
import Redis from "ioredis";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
});

export { redis };
