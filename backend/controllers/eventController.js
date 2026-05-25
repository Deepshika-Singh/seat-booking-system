import express from "express";
import Event from "../models/Event.js";
import Show from "../models/Show.js";

const createEvent = async (req, res) => {
  try{
    const {name,eventType,description} = req.body;
    if(!name || !eventType|| !description){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }
    if(!["movie","concert","theater"].includes(eventType)){
      return res.status(400).json({
        success:false,
        message:"Invalid event type"
      })
    }
    // Create event
    const event = await Event.create({
      name,
      eventType:eventType,
      description
    });
    return res.status(201).json({
      success:true,
      message:"Event created successfully",
      data:event
    })
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
};
const getAllEvents = async(req,res)=>{
  try{
    const events = await Event.find().sort({createdAt:-1});
    return res.status(200).json({
      success:true,
      data:events
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"server error (getAllEvents)"
    })
  }
}
const getEventById = async(req,res)=>{
  try{
    const{id}= req.params;
    const event = await Event.findById(id);
    if(!event){
      return res.status(404).json({
        success:false,
        message:"Event is not exists"
      })
    }
    return res.status(200).json({
      success:true,
      data:event
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Error fetching event"
    })
  }
}

const updateEvent = async(req,res)=>{
  try{
    const { id} = req.params;
    const {name,eventType,description} = req.body;
    const event = await Event.findById(id);
    if(!event){
      return res.status(404).json({
        success:false,
        message:"Event is not exists"
      });
    }
    if(name) event.name = name;
    
    if (eventType) {
      const validTypes = ["movie", "concert", "theater"];

      if (!validTypes.includes(eventType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid event type",
        });
      }

      event.eventType = eventType;
    }

    // Update description
    if (description) {
      event.description = description;
    }
    await event.save();
    return res.status(200).json({
      success:true,
      message:"Event updated successfully",
      data:event
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Error updating event"
    });
  }
}

const deleteEvent = async(req,res)=>{
  try{
    const {id} = req.params;
    const event = await Event.findById(id);
    if(!event){
      return res.status(404).json({
        success: false,
        message:"Event is not exists"
      });
    }
    await Event.findByIdAndDelete(id);
    await Show.deleteMany({event:id});
    return res.status(200).json({
      success:true,
      message:"Event deleted successfully"
    });

  }catch(error){
    return res.status(500).json({
      success:false,
      message: "Error deleting event"
    });
  }
}

export {createEvent, getAllEvents, getEventById, updateEvent, deleteEvent};