import pool from "../db.js";


// GET ALL DRIVERS
export async function getDrivers(req,res){

    try{

        const result=await pool.query(
            "SELECT * FROM drivers ORDER BY id DESC"
        );


        res.json({
            success:true,
            data:result.rows
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}



// GET DRIVER BY ID
export async function getDriverById(req,res){

    try{

        const {id}=req.params;


        const result=await pool.query(
            "SELECT * FROM drivers WHERE id=$1",
            [id]
        );

        if(result.rows.length===0){
            return res.status(404).json({
                success:false,
                message:"Driver not found"
            });
        }

        res.json({
            success:true,
            data:result.rows[0]
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}



// CREATE DRIVER
export async function createDriver(req,res){

    try{

        const {
            name,
            license_number,
            license_category,
            license_expiry,
            contact_number,
            safety_score
        }=req.body;


        const result=await pool.query(

        `
        INSERT INTO drivers
        (
        name,
        license_number,
        license_category,
        license_expiry,
        contact_number,
        safety_score
        )

        VALUES($1,$2,$3,$4,$5,$6)

        RETURNING *
        `,

        [
        name,
        license_number,
        license_category,
        license_expiry,
        contact_number,
        safety_score
        ]

        );


        res.status(201).json(result.rows[0]);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}



// UPDATE DRIVER
export async function updateDriver(req,res){

    try{

        const {id}=req.params;


        const {
            name,
            license_category,
            license_expiry,
            contact_number,
            safety_score,
            status
        }=req.body;


        const result=await pool.query(

        `
        UPDATE drivers

        SET

        name=$1,
        license_category=$2,
        license_expiry=$3,
        contact_number=$4,
        safety_score=$5,
        status=$6

        WHERE id=$7

        RETURNING *
        `,

        [
        name,
        license_category,
        license_expiry,
        contact_number,
        safety_score,
        status,
        id
        ]

        );

        if(result.rows.length===0){
            return res.status(404).json({
                success:false,
                message:"Driver not found"
            });
        }

        res.json({
            success:true,
            message:"Driver updated successfully",
            data:result.rows[0]
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}



// DELETE DRIVER
export async function deleteDriver(req,res){

    try{

        const {id}=req.params;


        const result = await pool.query(
            "DELETE FROM drivers WHERE id=$1 RETURNING *",
            [id]
        );

        if(result.rows.length===0){
            return res.status(404).json({
                success:false,
                message:"Driver not found"
            });
        }


        res.json({
            success:true,
            message:"Driver deleted"
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}