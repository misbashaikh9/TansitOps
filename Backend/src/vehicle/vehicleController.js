import pool from "../db.js";


// GET ALL VEHICLES

export async function getVehicles(req,res){

    try{

        const result = await pool.query(
            "SELECT * FROM vehicles ORDER BY id DESC"
        );


        res.json(result.rows);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}



// CREATE VEHICLE

export async function createVehicle(req,res){

    try{

        const {
            registration_number,
            vehicle_name,
            model,
            type,
            max_load_capacity,
            odometer,
            acquisition_cost
        } = req.body;



        const result = await pool.query(

        `INSERT INTO vehicles
        (
        registration_number,
        vehicle_name,
        model,
        type,
        max_load_capacity,
        odometer,
        acquisition_cost
        )

        VALUES($1,$2,$3,$4,$5,$6,$7)

        RETURNING *`,

        [
        registration_number,
        vehicle_name,
        model,
        type,
        max_load_capacity,
        odometer,
        acquisition_cost
        ]

        );


        res.status(201).json(result.rows[0]);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}