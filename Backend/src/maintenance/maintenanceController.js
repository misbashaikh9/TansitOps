import pool from "../db.js";

export async function createMaintenance(req, res) {

    try {

        const {
            vehicle_id,
            description,
            start_date,
            end_date,
            amount,
            status
        } = req.body;

        if (!Number.isInteger(Number(vehicle_id)) || Number(vehicle_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid vehicle_id is required"
            });
        }

        if (!description || !String(description).trim()) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }

        if (amount !== undefined && amount !== null && String(amount) !== '' && Number.isNaN(Number(amount))) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a valid number"
            });
        }

        const vehicleResult = await pool.query(
            "SELECT * FROM vehicles WHERE id=$1",
            [Number(vehicle_id)]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        const maintenanceResult = await pool.query(
            `
            INSERT INTO maintenance_logs
            (
                vehicle_id,
                description,
                start_date,
                end_date,
                status
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                Number(vehicle_id),
                description || null,
                start_date || null,
                end_date || null,
                status || 'In Shop'
            ]
        );

        if (amount !== undefined && amount !== null && String(amount) !== '') {
            await pool.query(
                `
                INSERT INTO expenses
                (
                    vehicle_id,
                    expense_type,
                    amount,
                    date
                )
                VALUES($1,'Maintenance',$2,$3)
                `,
                [
                    Number(vehicle_id),
                    Number(amount),
                    start_date || new Date().toISOString().slice(0, 10)
                ]
            );
        }

        await pool.query(
            `
            UPDATE vehicles
            SET status='In Shop'
            WHERE id=$1
            `,
            [Number(vehicle_id)]
        );

        res.status(201).json({
            success: true,
            message: "Maintenance created and vehicle moved to In Shop",
            data: maintenanceResult.rows[0]
        });

    } catch(error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}


export async function getMaintenance(req, res) {

    try {

        const result = await pool.query(`
            SELECT 
                maintenance_logs.id,
                maintenance_logs.description,
                maintenance_logs.start_date,
                maintenance_logs.end_date,
                maintenance_logs.status,

                vehicles.vehicle_name,
                vehicles.registration_number

            FROM maintenance_logs

            LEFT JOIN vehicles
            ON maintenance_logs.vehicle_id = vehicles.id

            ORDER BY maintenance_logs.id DESC
        `);


        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });


    } catch(error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}