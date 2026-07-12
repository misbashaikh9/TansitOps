import express from "express";
import { getDrivers } from "./driverController.js";

const router = express.Router();

router.get("/", getDrivers);

export default router;