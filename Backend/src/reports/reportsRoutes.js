import express from "express";

import {
    getVehicleReports,
    getFuelReport,
    getMaintenanceReport,
    getDriverReport
} from "./reportsController.js";


const router = express.Router();


router.get("/vehicles", getVehicleReports);

router.get("/fuel", getFuelReport);

router.get("/maintenance", getMaintenanceReport);

router.get("/drivers", getDriverReport);


export default router;