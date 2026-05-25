import express from "express";
import Show from "../models/Show.js";
import Event from "../models/Event.js";
import { generateSeats } from "../utils/generateSeats.js";
import Booking from "../models/Booking.js";

const createShow = async(req,res)=>{
  try{
    const {eventId, venue,date, totalSeats,price}= req.body;
    if(!eventId || !venue || !date || !totalSeats || !price){
      return res.status(400).json({
        success:false,
        message :"All fileds are required"
      });
    }
    if(totalSeats<=0 || price<=0){
      return res.status(400).json({
        success:false,
        message:"Total seats and price must be greater than zero"
      });
    }
    const event = await Event.findById(eventId);
    if(!event){
      return res.status(404).json({
        success:false,
        message:"Event not found"
      });
    }
    const show = await Show.create({
      event:eventId,
      venue,
      date,
      price,
      totalSeats,
      availableSeats: totalSeats
    })
    return res.status(201).json({
      success:true,
      message:"Show created successfully",
      data:show
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Error creating show",
      error:error.message
    })
  }
};
const getShowByEvent = async(req,res)=>{
  try{
    const{eventId}= req.params;
    const shows = await Show.find({event:eventId});
    return res.status(200).json({
      success:true,
      data:shows,
    });
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "Server error (getShowByEvent)",
    })
  }
};

const getShowById = async(req,res)=>{
  try{

    const {id}= req.params;
    const show = await Show.findById(id).populate("event");
    if(!show){
      return res.status(404).json({
        success:false,
        message:"Show not found"
      })
    }
    return res.status(200).json({
      success:true,
      data:show
    });

  }catch(error){
    return res.status(500).json({
      success: false,
      message: "Server error (getShowById)",
      error:error.message
    })
  }
}
const getShowSeats = async(req,res)=>{
  try{
    const {showId}= req.params;
    const show= await Show.findById(showId);
    if(!show){
      return res.status(404).json({
        success:false,
        message:"Show not found"
      })
    }
    const allSeats = generateSeats(show.totalSeats);
    
    const bookings = await Booking.find({show:showId,
      status:{$in:["pending","booked"]}
    });

    const bookedseatMap = {};
let occupiedSeats = 0;

for (let booking of bookings) {
  for (const seatNo of booking.seats) {
    bookedseatMap[seatNo] = booking.status;
    occupiedSeats++;
  }
}

    for(let seat of allSeats){
      if(bookedseatMap[seat.seatNumber]){
        seat.status=bookedseatMap[seat.seatNumber];
      }else{
      seat.status="available";
      }
    }
    

    const availableSeats =
      show.totalSeats - occupiedSeats;

    return res.status(200).json({
      success:true,
      data:{
        show,
        summary: {
          totalSeats: show.totalSeats,
          occupiedSeats,
          availableSeats,
        },
        seats:allSeats
      }
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Server error (getShowSeats)",
      error:error.message
    });
  }
}

const updateShow = async(req,res)=>{
  try{
    const { id} = req.params;
  const {venue,date,price} = req.body;
    const show = await Show .findById(id);
    if(!show){
      return res.status(404).json({
        success:false,
        message:"Show not found"
      });
    }
    if(venue) show.venue = venue;
    if(date) show.date = date;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative",
        });
      }

      show.price = price;
    }
    await show.save();
    return res.status(200).json({
      success:true,
      message:"Show updated successfully",
      data:show
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Server error (updateShow)",
      error:error.message
    });
  }
}
const deleteShow = async(req,res)=>{
  try{
    const {id}= req.params;
    const show = await Show.findById(id);
    if(!show){
      return res.status(404).json({
        success:false,
        message:"Show not found"
      }); 
    }
    await Show.findByIdAndDelete(id);
    await Booking.deleteMany({show:id});
    return res.status(200).json({
      success:true,
      message:"Show deleted successfully"
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Server error (deleteShow)",
      error:error.message
    });
  }

}
export {createShow, getShowByEvent,getShowById,getShowSeats,updateShow,deleteShow};