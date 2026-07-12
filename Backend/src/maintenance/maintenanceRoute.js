import express from "express";

import {
    getMaintenance
} from "./maintenanceController.js";


const router = express.Router();


router.get("/", getMaintenance);


export default router;