import pool from "../db.js";


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