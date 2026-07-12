import express from "express";
import {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip
} from "./tripController.js";
const router = express.Router();
router.get("/", getTrips);
router.get("/:id", getTripById);
router.post("/", createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.patch("/:id/dispatch", dispatchTrip);
router.patch("/:id/complete", completeTrip);
router.patch("/:id/cancel", cancelTrip);
export default router;