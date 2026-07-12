import pool from "../db.js";


export async function getFuel(req, res) {

    try {

        const result = await pool.query(`
            SELECT 

                fuel_logs.id,
                fuel_logs.liters,
                fuel_logs.cost,
                fuel_logs.date,

                vehicles.vehicle_name,
                vehicles.registration_number

            FROM fuel_logs

            LEFT JOIN vehicles

            ON fuel_logs.vehicle_id = vehicles.id

            ORDER BY fuel_logs.id DESC
        `);


        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });


    } catch(error) {

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

}