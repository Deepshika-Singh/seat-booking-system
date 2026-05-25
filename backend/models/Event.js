import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  eventType:{
    type:String,
    enum:["movie","concert","theater"],
    required:true
  },
  description : {
    type:String,
    required : true,
  }
},{
  timestamps:true
});
export default mongoose.model("Event", eventSchema);