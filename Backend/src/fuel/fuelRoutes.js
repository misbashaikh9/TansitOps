import express from "express";

import {
    createExpense,
    createFuel,
    getExpenses,
    getFuel
} from "./fuelController.js";


const router = express.Router();


router.post("/", createFuel);
router.get("/", getFuel);
router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);


export default router;