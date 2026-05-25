import { Worker } from "bullmq";
import Booking from "../models/Booking.js"; 
import {getIO} from "../socket.js";
import { unlockSeat } from "../services/redisService.js";
import bookingExpiryQueue from "./expiryQueue.js";

const bookingWorker = new Worker(bookingExpiryQueue.name, async (job)=>{
  const{bookingId}= job.data;
  try{
    const booking = await Booking.findById(bookingId);
    if(!booking){
      console.error("Booking not found for job:", job.id);
      return;
    }
    if (booking.status !== "pending") return;
    
      booking.status ="cancelled";
      await booking.save();
      for( const seatNo of booking.seats){
        await unlockSeat(booking.show, seatNo);
      }
      const io = getIO();
      for(const seatNo of booking.seats){
        io.to(booking.show.toString()).emit("seatUpdated",
        {showId: booking.show.toString(),
          seatNo:seatNo,  
          status:"available"  
        }
      );
      }
  }catch(error){
    console.error("Error processing booking expiry for job:", job.id, error);
  }
},{
  connection: bookingExpiryQueue.opts.connection,
  concurrency: 5
});
export default bookingWorker;