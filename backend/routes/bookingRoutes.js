import express from "express";
import { bookSeat ,getMyBookings} from "../controllers/bookingController.js";
import { verifyPayment } from "../controllers/paymentController.js";
import {protect } from "../middlewares/authMiddleware.js";
import { bookingLimiter } from "../middlewares/rateLimitMiddlewares.js";

const bookingRouter = express.Router();
// Book seat (adds job to queue)
bookingRouter.post("/book-seat", protect, bookSeat);
// bookingRouter.get("/my-bookings", protect, getMyBookings);

bookingRouter.get("/my-bookings",getMyBookings);

export default bookingRouter;