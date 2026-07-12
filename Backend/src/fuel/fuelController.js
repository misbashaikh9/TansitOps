import pool from "../db.js";


// CREATE FUEL ENTRY
export const createFuel = async (req, res) => {
  try {
    const {
      vehicle_id,
      driver_id,
      fuel_date,
      fuel_quantity,
      fuel_cost,
      odometer_reading,
      fuel_station
    } = req.body;


    const result = await pool.query(
      `
      INSERT INTO fuel_logs
      (
        vehicle_id,
        driver_id,
        fuel_date,
        fuel_quantity,
        fuel_cost,
        odometer_reading,
        fuel_station
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        vehicle_id,
        driver_id,
        fuel_date,
        fuel_quantity,
        fuel_cost,
        odometer_reading,
        fuel_station
      ]
    );


    res.status(201).json({
      message: "Fuel record created successfully",
      fuel: result.rows[0]
    });


  } catch(error){
    console.log(error);
    res.status(500).json({
      message:"Server error",
      error:error.message
    });
  }
};



// GET ALL FUEL RECORDS
export const getAllFuel = async(req,res)=>{
  try{

    const result = await pool.query(
      `
      SELECT 
      fuel_logs.*,
      vehicles.registration_number,
      drivers.name AS driver_name

      FROM fuel_logs

      LEFT JOIN vehicles
      ON fuel_logs.vehicle_id = vehicles.id

      LEFT JOIN drivers
      ON fuel_logs.driver_id = drivers.id

      ORDER BY fuel_logs.id DESC
      `
    );


    res.json(result.rows);


  }catch(error){

    console.log(error);

    res.status(500).json({
      message:"Server error",
      error:error.message
    });

  }
};



// GET FUEL BY ID
export const getFuelById = async(req,res)=>{

try{

const {id}=req.params;


const result = await pool.query(
`
SELECT *
FROM fuel_logs
WHERE id=$1
`,
[id]
);


if(result.rows.length===0){
 return res.status(404).json({
  message:"Fuel record not found"
 });
}


res.json(result.rows[0]);


}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
});

}

};




// UPDATE FUEL
export const updateFuel = async(req,res)=>{

try{

const {id}=req.params;

const {
 fuel_quantity,
 fuel_cost,
 odometer_reading,
 fuel_station
}=req.body;


const result = await pool.query(
`
UPDATE fuel_logs

SET 
fuel_quantity=$1,
fuel_cost=$2,
odometer_reading=$3,
fuel_station=$4

WHERE id=$5

RETURNING *

`,
[
fuel_quantity,
fuel_cost,
odometer_reading,
fuel_station,
id
]
);


if(result.rows.length===0){
 return res.status(404).json({
 message:"Fuel record not found"
 });
}


res.json({
message:"Fuel updated successfully",
fuel:result.rows[0]
});


}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
});

}

};




// DELETE FUEL
export const deleteFuel = async(req,res)=>{

try{

const {id}=req.params;


const result = await pool.query(
`
DELETE FROM fuel_logs
WHERE id=$1
RETURNING *
`,
[id]
);


if(result.rows.length===0){

return res.status(404).json({
message:"Fuel record not found"
});

}


res.json({
message:"Fuel deleted successfully"
});


}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
});

}

};