import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import Booking from "../models/Booking.js";
import { lockSeat, isSeatLocked } from "../services/redisService.js";
import {getIO} from "../socket.js";
import bookingExpiryQueue from "./expiryQueue.js";
import Show from "../models/Show.js";

const worker = new Worker(
  "seatBookingQueue",
  async (job) => {
    console.log("Worker received job:", job.data);
    try {
    const { showId, seats, userId} = job.data;
    const show = await Show.findById(showId);
    if(!show){
      for (const seatNo of seats) {
          await unlockSeat(
            showId,
            seatNo,
            userId
          );
        }

        throw new Error(
          "Show not found"
        );

    }
    const totalPrice = show.price*seats.length;
    //check if seat is already locked
    // for(const seatNo of seats){
    //  const isLocked = await isSeatLocked(showId, seatNo);
    // if (isLocked) {
    //   console.log(`Seat ${seatNo} is locked for show ${showId}`);
    //   return;
    // } 
    // }
    // //lock seat in redis
    // for( const seatNo of seats){
    //   const lock = await lockSeat(showId, seatNo, userId);
    // if (!lock.success) {
    //   console.log(`Failed to lock seat ${seatNo}for ${showId}`);
    //   return;
    // }
    // }
    //uodate booking status in MongoDB
    const booking = await Booking.create({
      show: showId,
      seats,
      user: userId,
      totalPrice,
      status: "pending",
    });
    await bookingExpiryQueue.add(
      "expire-booking",
      {
        bookingId: booking._id,
        showId,
        seats
      },{
        delay: 15 * 60 * 1000, //15 minutes
        // delay: 30 * 1000,
      }
    )
    const io = getIO();
    for( const seatNo of seats){
      io.to(showId).emit("seatUpdated",{
      showId,
      seatNo,
      status: "pending"
    });
    }
    return booking;
    } catch (error) {
      console.error("Worker error:", error);
      throw error;
    }
  },
  {
    connection: redisConnection,
  },
);

export default worker;