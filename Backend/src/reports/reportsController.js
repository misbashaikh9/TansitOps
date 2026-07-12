import pool from "../db.js";


export async function getReports(req, res) {

    try {


        // Fleet Utilization

        const vehicleStats = await pool.query(`
            SELECT

            COUNT(*) AS total_vehicles,

            COUNT(*) FILTER(
                WHERE status='On Trip'
            ) AS active_vehicles

            FROM vehicles
        `);



        // Total Fuel Cost

        const fuelCost = await pool.query(`
            SELECT

            COALESCE(SUM(cost),0)
            AS total_fuel_cost

            FROM fuel_logs
        `);



        // Total Maintenance Cost

        const maintenanceCost = await pool.query(`
            SELECT

            COALESCE(SUM(amount),0)
            AS total_maintenance_cost

            FROM expenses

            WHERE expense_type='Maintenance'
        `);



        // Active Trips

        const activeTrips = await pool.query(`
            SELECT COUNT(*)

            FROM trips

            WHERE status='Dispatched'
        `);



        const totalVehicles =
            Number(vehicleStats.rows[0].total_vehicles);


        const activeVehicles =
            Number(vehicleStats.rows[0].active_vehicles);



        const fleetUtilization =
            totalVehicles === 0
            ? 0
            : ((activeVehicles / totalVehicles) * 100).toFixed(2);



        res.status(200).json({

            success:true,

            data:{
                totalVehicles,
                activeVehicles,

                fleetUtilization:`${fleetUtilization}%`,

                activeTrips:
                Number(activeTrips.rows[0].count),

                totalFuelCost:
                Number(fuelCost.rows[0].total_fuel_cost),

                totalMaintenanceCost:
                Number(
                    maintenanceCost.rows[0]
                    .total_maintenance_cost
                )
            }

        });



    } catch(error) {


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

}