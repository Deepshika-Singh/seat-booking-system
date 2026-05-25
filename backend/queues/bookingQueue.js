import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";
const bookingQueue = new Queue("seatBookingQueue",{
  connection: redisConnection
});
export default bookingQueue;