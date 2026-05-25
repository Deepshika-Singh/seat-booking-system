import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

const bookingExpiryQueue = new Queue("bookingExpiryQueue",{
  connection : redisConnection
}
);
export default bookingExpiryQueue;