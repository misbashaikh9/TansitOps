import pool from "../db.js";


// ===============================
// VEHICLE ANALYTICS REPORT
// ===============================

export const getVehicleReports = async (req,res)=>{

try{

const result = await pool.query(`

SELECT

v.id,
v.registration_number,
v.vehicle_name,

COUNT(t.id) AS total_trips,

COUNT(
CASE 
WHEN t.status='Completed'
THEN 1
END
) AS completed_trips,


COALESCE(SUM(t.planned_distance),0)
AS total_distance,


COALESCE(SUM(t.fuel_consumed),0)
AS total_fuel,


CASE
WHEN COALESCE(SUM(t.fuel_consumed),0) > 0
THEN ROUND(
SUM(t.planned_distance) /
SUM(t.fuel_consumed),2
)
ELSE 0
END
AS fuel_efficiency,


COALESCE(
(
SELECT SUM(fuel_cost)
FROM fuel_logs f
WHERE f.vehicle_id=v.id
),0
)
AS fuel_cost,


COALESCE(
(
SELECT SUM(cost)
FROM maintenance_logs m
WHERE m.vehicle_id=v.id
),0
)
AS maintenance_cost,


COALESCE(
(
SELECT SUM(revenue)
FROM trips tr
WHERE tr.vehicle_id=v.id
),0
)
AS revenue,


CASE
WHEN v.acquisition_cost > 0
THEN
(
(
COALESCE(
(SELECT SUM(revenue)
FROM trips tr
WHERE tr.vehicle_id=v.id),0
)
-
(
COALESCE(
(SELECT SUM(fuel_cost)
FROM fuel_logs f
WHERE f.vehicle_id=v.id),0
)
+
COALESCE(
(SELECT SUM(cost)
FROM maintenance_logs m
WHERE m.vehicle_id=v.id),0
)
)
)
/
v.acquisition_cost
)
ELSE 0
END
AS roi


FROM vehicles v

LEFT JOIN trips t
ON v.id=t.vehicle_id


GROUP BY v.id;


`);


res.json(result.rows);


}catch(error){

console.log(error);

res.status(500).json({
message:"Server Error",
error:error.message
});

}

};




// ===============================
// FUEL REPORT
// ===============================

export const getFuelReport = async(req,res)=>{

try{

const result = await pool.query(`

SELECT

v.registration_number,

SUM(f.fuel_quantity) AS total_fuel,

SUM(f.fuel_cost) AS total_fuel_cost


FROM fuel_logs f


JOIN vehicles v
ON f.vehicle_id=v.id


GROUP BY v.registration_number;


`);


res.json(result.rows);


}catch(error){

res.status(500).json({
message:"Server Error",
error:error.message
});

}

};




// ===============================
// MAINTENANCE REPORT
// ===============================

export const getMaintenanceReport = async(req,res)=>{

try{


const result = await pool.query(`

SELECT

v.registration_number,

COUNT(m.id) AS total_maintenance,

COALESCE(SUM(m.cost),0)
AS maintenance_cost


FROM maintenance_logs m


JOIN vehicles v
ON m.vehicle_id=v.id


GROUP BY v.registration_number;


`);


res.json(result.rows);


}catch(error){

res.status(500).json({
message:"Server Error",
error:error.message
});

}

};




// ===============================
// DRIVER REPORT
// ===============================

export const getDriverReport = async(req,res)=>{


try{


const result = await pool.query(`

SELECT

d.id,
d.name,

COUNT(t.id)
AS total_trips,


COUNT(
CASE
WHEN t.status='Completed'
THEN 1
END
)
AS completed_trips


FROM drivers d


LEFT JOIN trips t
ON d.id=t.driver_id


GROUP BY d.id;


`);


res.json(result.rows);


}catch(error){

res.status(500).json({
message:"Server Error",
error:error.message
});

}


};