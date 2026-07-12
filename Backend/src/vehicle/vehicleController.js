import pool from "../db.js";


// GET ALL VEHICLES
export async function getVehicles(req,res){

    try{

        const result = await pool.query(
            "SELECT * FROM vehicles ORDER BY id DESC"
        );

        res.json({
            success:true,
            data:result.rows
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

}



// GET SINGLE VEHICLE
export async function getVehicleById(req,res){

    try{

        const {id}=req.params;

        const result=await pool.query(
            "SELECT * FROM vehicles WHERE id=$1",
            [id]
        );


        if(result.rows.length===0)
            return res.status(404).json({
                message:"Vehicle not found"
            });


        res.json(result.rows[0]);


    }catch(error){

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
        }=req.body;


        const result=await pool.query(

        `
        INSERT INTO vehicles
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

        RETURNING *
        `,

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


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}



// UPDATE VEHICLE
export async function updateVehicle(req,res){

    try{

        const {id}=req.params;

        const {
            vehicle_name,
            model,
            type,
            max_load_capacity,
            odometer,
            acquisition_cost,
            status
        }=req.body;


        const result=await pool.query(

        `
        UPDATE vehicles

        SET
        vehicle_name=$1,
        model=$2,
        type=$3,
        max_load_capacity=$4,
        odometer=$5,
        acquisition_cost=$6,
        status=$7

        WHERE id=$8

        RETURNING *
        `,

        [
            vehicle_name,
            model,
            type,
            max_load_capacity,
            odometer,
            acquisition_cost,
            status,
            id
        ]

        );


        res.json(result.rows[0]);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}



// DELETE VEHICLE
export async function deleteVehicle(req,res){

    try{

        const {id}=req.params;


        await pool.query(
            "DELETE FROM vehicles WHERE id=$1",
            [id]
        );


        res.json({
            message:"Vehicle deleted"
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}