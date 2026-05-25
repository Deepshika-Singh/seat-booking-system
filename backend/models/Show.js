import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({
  event:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  venue:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  totalSeats:{
    type:Number,
    required:true
  },
    availableSeats:{
      type:Number,
      required:true
  },
  status:{
    type: String,
    enum :["scheduled","cancelled"],
    default:"scheduled"
  }
},{
  timestamps:true
});

export default mongoose.model("Show", ShowSchema);