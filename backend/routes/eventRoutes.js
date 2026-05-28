import express from "express";
import { createEvent,getEventById ,getAllEvents,deleteEvent,updateEvent} from "../controllers/eventController.js";
import authorizeRoles  from "../middlewares/authorizeRoles.js"
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createEvent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent);
router.put("/:id", protect, authorizeRoles("admin"), updateEvent);
router.get("/:id", protect, getEventById);
router.get("/", getAllEvents);

export default router;

