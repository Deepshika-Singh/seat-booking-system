import express from "express";
import http from "http";
import { Server } from "socket.io";
import {connectDB} from "./config/db.js"; 
import {initSocket} from "./socket.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import "./queues/bookingWorker.js";
import "./queues/bookingExpiryWorker.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bookingRouter from "./routes/bookingRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import authRouter from "./routes/authRoutes.js";
import showRouter from "./routes/showRoutes.js";

import cors from "cors";
dotenv.config();
console.log("CLIENT URL:", process.env.CLIENT_URL);
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();
const server = http.createServer(app);
app.get("/", (req, res) => {
  res.send("Welcome to the Seat Booking System API");
});
app.use("/api/auth", authRouter);
app.use("/api/booking",bookingRouter);
app.use("/api/payment",paymentRouter);
console.log("PAYMENT ROUTER LOADED");
app.use("/api/events",eventRouter);
app.use("/api/shows", showRouter);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
//initialize socket logic
initSocket(io);


console.log(process.env.PORT);
server.listen(process.env.PORT, () =>
  
  console.log("Server running")
);