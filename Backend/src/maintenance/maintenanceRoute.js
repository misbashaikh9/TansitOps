import express from "express";

import {
    getMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    closeMaintenance
} from "./maintenanceController.js";

const router = express.Router();
router.post("/", createMaintenance);
router.get("/", getMaintenance);
router.get("/:id", getMaintenanceById);

router.post("/", createMaintenance);

router.put("/:id", updateMaintenance);

router.delete("/:id", deleteMaintenance);

router.patch("/:id/close", closeMaintenance);

export default router;