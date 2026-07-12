import express from "express";
import {
  createFuel,
  getAllFuel,
  getFuelById,
  updateFuel,
  deleteFuel
} from "./fuelController.js";

const router = express.Router();

// Create fuel entry
router.post("/", createFuel);

// Get all fuel records
router.get("/", getAllFuel);

// Get fuel by id
router.get("/:id", getFuelById);

// Update fuel record
router.put("/:id", updateFuel);

// Delete fuel record
router.delete("/:id", deleteFuel);

export default router;