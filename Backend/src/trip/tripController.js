import pool from "../db.js";


export async function getTrips(req, res) {

    try {

        const result = await pool.query(`
            
            SELECT 
                trips.id,
                trips.source,
                trips.destination,
                trips.cargo_weight,
                trips.planned_distance,
                trips.status,

                vehicles.vehicle_name,
                vehicles.registration_number,

                drivers.name AS driver_name

            FROM trips

            JOIN vehicles
            ON trips.vehicle_id = vehicles.id

            JOIN drivers
            ON trips.driver_id = drivers.id

            ORDER BY trips.id DESC

        `);


        res.status(200).json({

            success:true,
            count:result.rows.length,
            data:result.rows

        });


    } catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

}