import express from "express";
import { createShow,getShowByEvent ,getShowById,updateShow,deleteShow} from "../controllers/showController.js";
import { getShowSeats } from "../controllers/showController.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import { protect } from "../middlewares/authMiddleware.js";

const showRouter = express.Router();

showRouter.post("/",protect, authorizeRoles("admin"),createShow);
showRouter.put("/:id",protect, authorizeRoles("admin"),updateShow);
showRouter.delete("/:id",protect, authorizeRoles("admin"),deleteShow);
showRouter.get("/event/:eventId", getShowByEvent);
showRouter.get("/:id",getShowById);
showRouter.get("/:showId/seats",getShowSeats);
export default showRouter;