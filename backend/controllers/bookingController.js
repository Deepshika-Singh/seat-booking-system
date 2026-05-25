import bookingQueue from "../queues/bookingQueue.js";
import Booking from "../models/Booking.js";
import { isSeatLocked, lockSeat,unlockSeat } from "../services/redisService.js";
import Show from "../models/Show.js";
// const bookSeat = async(req, res)=>{
//   try{
//     const {showId, seats} = req.body;
//     const userId = req.user.userId;
//     // const userId = "testUser1";

//     // for (const seatNo of seats) {
//     //   const locked = await isSeatLocked(showId, seatNo);

//     //   if (locked) {
//     //     return res.status(400).json({
//     //       success: false,
//     //       message: `Seat ${seatNo} is already booked or locked`,
//     //     });
//     //   }
//     // }


//      for (const seatNo of seats) {
//       const alreadyBooked =
//         await Booking.findOne({
//           show: showId,
//           seats: seatNo,
//           status: "booked",
//         });

//       if (alreadyBooked) {
//         return res.status(400).json({
//           success: false,
//           message: `Seat ${seatNo} already booked`,
//         });
//       }
//     }

//     const lockedSeats = [];

//     for (const seatNo of seats) {
//       const lock = await lockSeat(showId, seatNo, userId);
//       console.log(lock);
//       if (!lock.success) {
//         // rollback
//         for (const s of lockedSeats) {
//           await unlockSeat(showId, s, userId);
//         }

//         return res.status(400).json({
//           success: false,
//           message: `Seat ${seatNo} is temporarily locked`,
//         });
//       }

//       lockedSeats.push(seatNo);
//     }

//     await bookingQueue.add("book-seat",{
//       showId,
//       seats,
//       userId
//     });
//     return res.status(200).json({
//       success:true,
//       message:"Booking request added to queue"
//     });
//   }catch(error){
//     console.error("QUEUE ERROR:", error);
//     return res.status(500).json({
//       success:false,
//       message:"Server error(queue)"
//     });
//   }
// };

const bookSeat = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.userId;

    // 1. Check already booked
    for (const seatNo of seats) {
      const exists = await Booking.findOne({
        show: showId,
        seats: seatNo,
        status: "booked",
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNo} already booked`,
        });
      }
    }

    // 2. lock seats in redis
    const lockedSeats = [];

    for (const seatNo of seats) {
      const lock = await lockSeat(showId, seatNo, userId);

      if (!lock.success) {
        for (const s of lockedSeats) {
          await unlockSeat(showId, s, userId);
        }

        return res.status(400).json({
          success: false,
          message: `Seat ${seatNo} locked`,
        });
      }

      lockedSeats.push(seatNo);
    }

    // 3. ADD JOB TO QUEUE
    const job = await bookingQueue.add("book-seat", {
      showId,
      seats,
      userId,
    });

    // 4. IMPORTANT FIX: return jobId (frontend needs this)
    return res.status(200).json({
      success: true,
      jobId: job.id,
      message: "Booking processing started",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Booking error",
    });
  }
};

const getMyBookings = async(req,res)=>{
  try{
    const userId = req.user.userId;
    const bookings = await Booking.find({user:userId}).populate({path:"show", populate:{path:"event"}});
    return res.status(200).json({
      success:true,
      data:bookings
    });

  }catch(error){
    console.error("GET MY BOOKINGS ERROR:", error);
    return res.status(500).json({
      success:false,
      message:"Server error(getMyBookings)"
    });
  }
}
export {bookSeat,getMyBookings};

