import express from "express";
import { createOrder, verifyPayment,cancelBooking } from "../controllers/paymentController.js";
import {protect } from "../middlewares/authMiddleware.js";
import { paymentLimiter } from "../middlewares/rateLimitMiddlewares.js";

const paymentRouter = express.Router();
paymentRouter.get("/check", (req, res) => {
  res.send("payment route working");
});
console.log("createOrder:", createOrder);
paymentRouter.post("/create-order",createOrder);
paymentRouter.post("/verify",paymentLimiter ,protect,verifyPayment);
paymentRouter.post( "/cancel",protect,cancelBooking);

export default paymentRouter;