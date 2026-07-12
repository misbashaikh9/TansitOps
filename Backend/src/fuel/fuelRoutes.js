import express from "express";

import {
    getFuel
} from "./fuelController.js";


const router = express.Router();


router.get("/", getFuel);


export default router;