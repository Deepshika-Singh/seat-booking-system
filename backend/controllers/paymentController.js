import Booking from "../models/Booking.js";
import { unlockSeat } from "../services/redisService.js";
import { getIO } from "../socket.js";

/* =========================
   CREATE ORDER
========================= */

const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking already processed",
      });
    }

    return res.status(200).json({
      success: true,
      order: {
        orderId: "ORDER_" + booking._id,
        amount: booking.totalPrice,
      },
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Create order failed",
    });
  }
};

/* =========================
   VERIFY PAYMENT
========================= */

const verifyPayment = async (
  req,
  res
) => {
  try {

    const { bookingId } =
      req.body;

    // 1. fetch latest booking
    const booking =
      await Booking.findById(
        bookingId
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    // 2. STOP if cancelled
    if (
      booking.status ===
      "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Booking cancelled",
      });
    }

    // 3. STOP if already booked
    if (
      booking.status ===
      "booked"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Already booked",
      });
    }

    // 4. update booking
    booking.status = "booked";

    booking.paymentInfo = {
      paymentId:
        "PAY_" + Date.now(),
      status: "paid",
    };

    await booking.save();

    // 5. unlock redis
    for (const seatNo of booking.seats) {
      await unlockSeat(
        booking.show.toString(),
        seatNo
      );
    }

    // 6. socket update
    const io = getIO();

    for (const seatNo of booking.seats) {
      io.to(
        booking.show.toString()
      ).emit("seatUpdated", {
        showId:
          booking.show.toString(),
        seatNo,
        status: "booked",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Payment successful",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Payment failed",
    });
  }
};
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // find pending booking only
    const booking = await Booking.findOneAndUpdate(
      {
        _id: bookingId,
        status: "pending",
      },
      {
        $set: {
          status: "cancelled",
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "Booking not found",
      });
    }

    // unlock redis seats
    for (const seatNo of booking.seats) {
      await unlockSeat(
        booking.show.toString(),
        seatNo
      );
    }

    // realtime update
    const io = getIO();

    for (const seatNo of booking.seats) {
      io.to(booking.show.toString()).emit(
        "seatUpdated",
        {
          showId: booking.show.toString(),
          seatNo,
          status: "available",
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Cancel failed",
    });
  }
};

export {
  createOrder,
  verifyPayment,
  cancelBooking,
};