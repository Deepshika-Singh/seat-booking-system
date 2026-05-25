import mongoose from "mongoose";

const bookingSchema = new mongoose .Schema({
  show :{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Show", 
    required: true
  },
  // seatNumber:{
  //   type: String,
  //   required:true
  // },
  seats: {
   type: [String],
   required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  },
  status:{
    type: String,
    enum:["pending","booked","cancelled"],
    default:"pending"
  },
  totalPrice:{
    type: Number,
    required:true
  },
  paymentOrderId: {
      type: String,
    },
  paymentInfo: {
      paymentId: String,

      status: {
        type: String,
        enum: [
          "pending",
          "paid",
          "failed",
        ],
        default: "pending",
      },
    },
  lockedAt:{
    type: Date,
    default: Date.now
  }
},{
  timestamps: true
});
export default mongoose.model("Booking", bookingSchema);