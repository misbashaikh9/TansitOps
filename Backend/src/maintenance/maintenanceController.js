import pool from "../db.js";

// CREATE MAINTENANCE
export async function createMaintenance(req, res) {

    try {

        const {
            vehicle_id,
            description,
            start_date,
            end_date
        } = req.body;

        // Check Vehicle
        const vehicleResult = await pool.query(
            "SELECT * FROM vehicles WHERE id=$1",
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        const vehicle = vehicleResult.rows[0];

        if (vehicle.status === "In Shop") {
            return res.status(400).json({
                message: "Vehicle is already under maintenance"
            });
        }

        // Create Maintenance Record
        const result = await pool.query(

            `
            INSERT INTO maintenance_logs
            (
                vehicle_id,
                description,
                start_date,
                end_date
            )

            VALUES($1,$2,$3,$4)

            RETURNING *
            `,

            [
                vehicle_id,
                description,
                start_date,
                end_date
            ]

        );

        // Update Vehicle Status
        await pool.query(

            `
            UPDATE vehicles
            SET status='In Shop'
            WHERE id=$1
            `,

            [vehicle_id]

        );

        res.status(201).json({
            success: true,
            message: "Maintenance created successfully",
            data: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}
// GET ALL MAINTENANCE
export async function getMaintenance(req, res) {

    try {

        const result = await pool.query(

            `
            SELECT
                maintenance_logs.*,
                vehicles.registration_number,
                vehicles.vehicle_name

            FROM maintenance_logs

            JOIN vehicles
            ON maintenance_logs.vehicle_id = vehicles.id

            ORDER BY maintenance_logs.id DESC
            `

        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}
// GET MAINTENANCE BY ID
export async function getMaintenanceById(req, res) {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            SELECT
                maintenance_logs.*,
                vehicles.registration_number,
                vehicles.vehicle_name

            FROM maintenance_logs

            JOIN vehicles
            ON maintenance_logs.vehicle_id = vehicles.id

            WHERE maintenance_logs.id = $1
            `,

            [id]

        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}
// UPDATE MAINTENANCE
export async function updateMaintenance(req, res) {

    try {

        const { id } = req.params;

        const {
            description,
            start_date,
            end_date,
            status
        } = req.body;

        const result = await pool.query(

            `
            UPDATE maintenance_logs

            SET

            description = $1,
            start_date = $2,
            end_date = $3,
            status = $4

            WHERE id = $5

            RETURNING *
            `,

            [
                description,
                start_date,
                end_date,
                status,
                id
            ]

        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        res.json({
            success: true,
            message: "Maintenance updated successfully",
            data: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}
// DELETE MAINTENANCE
export async function deleteMaintenance(req, res) {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            DELETE FROM maintenance_logs
            WHERE id = $1
            RETURNING *
            `,

            [id]

        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        res.json({
            success: true,
            message: "Maintenance deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}
// CLOSE MAINTENANCE
export async function closeMaintenance(req, res) {

    try {

        const { id } = req.params;

        // Find maintenance record
        const maintenanceResult = await pool.query(
            "SELECT * FROM maintenance_logs WHERE id=$1",
            [id]
        );

        if (maintenanceResult.rows.length === 0) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        const maintenance = maintenanceResult.rows[0];

        if (maintenance.status !== "Active") {
            return res.status(400).json({
                message: "Maintenance is already closed"
            });
        }

        // Update maintenance status
        await pool.query(
            `
            UPDATE maintenance_logs
            SET
                status='Completed',
                end_date=CURRENT_DATE
            WHERE id=$1
            `,
            [id]
        );

        // Check vehicle status
        const vehicleResult = await pool.query(
            "SELECT status FROM vehicles WHERE id=$1",
            [maintenance.vehicle_id]
        );

        if (
            vehicleResult.rows.length > 0 &&
            vehicleResult.rows[0].status !== "Retired"
        ) {
            await pool.query(
                `
                UPDATE vehicles
                SET status='Available'
                WHERE id=$1
                `,
                [maintenance.vehicle_id]
            );
        }

        res.json({
            success: true,
            message: "Maintenance closed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}