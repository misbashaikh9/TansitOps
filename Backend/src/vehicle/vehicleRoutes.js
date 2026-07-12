import express from "express";

import {
    getVehicles,
    createVehicle
} from "./vehicleController.js";


const router = express.Router();


router.get("/",getVehicles);

router.post("/",createVehicle);


export default router;