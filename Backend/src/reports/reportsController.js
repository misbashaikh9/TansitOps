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


        // Other non-fuel, non-maintenance expenses (e.g., tolls)
        const otherExpenseCost = await pool.query(`
            SELECT
            COALESCE(SUM(amount),0)
            AS total_other_expense_cost
            FROM expenses
            WHERE expense_type <> 'Fuel'
            AND expense_type <> 'Maintenance'
        `);



        // Active Trips

        const activeTrips = await pool.query(`
            SELECT COUNT(*)

            FROM trips

            WHERE status='Dispatched'
        `);


        // Latest completed trip for efficiency tracking
        const latestTrip = await pool.query(`
            SELECT
                planned_distance,
                fuel_consumed,
                updated_at
            FROM trips
            WHERE status='Completed'
            ORDER BY updated_at DESC, id DESC
            LIMIT 1
        `);


        // Latest fuel log for cost recency
        const latestFuelLog = await pool.query(`
            SELECT
                liters,
                cost,
                date
            FROM fuel_logs
            ORDER BY date DESC, id DESC
            LIMIT 1
        `);



        const totalVehicles =
            Number(vehicleStats.rows[0].total_vehicles);


        const activeVehicles =
            Number(vehicleStats.rows[0].active_vehicles);



        const fleetUtilization =
            totalVehicles === 0
            ? 0
            : ((activeVehicles / totalVehicles) * 100).toFixed(2);


        const totalFuelCost = Number(fuelCost.rows[0].total_fuel_cost);
        const totalMaintenanceCost = Number(
            maintenanceCost.rows[0].total_maintenance_cost
        );

        const totalOtherExpenseCost = Number(
            otherExpenseCost.rows[0].total_other_expense_cost
        );

        const operationalCost = totalFuelCost + totalMaintenanceCost + totalOtherExpenseCost;

        const latestTripRow = latestTrip.rows[0] || null;
        const latestFuelRow = latestFuelLog.rows[0] || null;

        const latestDistance = Number(latestTripRow?.planned_distance || 0);
        const latestTripFuel = Number(latestTripRow?.fuel_consumed || 0);
        const latestFuelLiters = Number(latestFuelRow?.liters || 0);

        const fuelEfficiencyBase = latestTripFuel > 0
            ? latestTripFuel
            : latestFuelLiters;

        const fuelEfficiencyValue = fuelEfficiencyBase > 0
            ? (latestDistance / fuelEfficiencyBase).toFixed(2)
            : '0.00';


        // Per-vehicle operational breakdown
        const perVehicleOperationalCost = await pool.query(`
            SELECT
                v.id AS vehicle_id,
                v.vehicle_name,
                v.registration_number,
                COALESCE(f.fuel_cost, 0) AS fuel_cost,
                COALESCE(e.maintenance_cost, 0) AS maintenance_cost,
                COALESCE(e.other_expense_cost, 0) AS other_expense_cost,
                COALESCE(f.fuel_cost, 0) + COALESCE(e.maintenance_cost, 0) + COALESCE(e.other_expense_cost, 0) AS total_operational_cost
            FROM vehicles v
            LEFT JOIN (
                SELECT
                    vehicle_id,
                    SUM(cost) AS fuel_cost
                FROM fuel_logs
                GROUP BY vehicle_id
            ) f ON f.vehicle_id = v.id
            LEFT JOIN (
                SELECT
                    vehicle_id,
                    SUM(CASE WHEN expense_type = 'Maintenance' THEN amount ELSE 0 END) AS maintenance_cost,
                    SUM(CASE WHEN expense_type <> 'Fuel' AND expense_type <> 'Maintenance' THEN amount ELSE 0 END) AS other_expense_cost
                FROM expenses
                GROUP BY vehicle_id
            ) e ON e.vehicle_id = v.id
            ORDER BY v.id DESC
        `);



        res.status(200).json({

            success:true,

            data:{
                totalVehicles,
                activeVehicles,

                fleetUtilization:`${fleetUtilization}%`,

                activeTrips:
                Number(activeTrips.rows[0].count),

                totalFuelCost:
                totalFuelCost,

                totalMaintenanceCost:
                totalMaintenanceCost,

                totalOtherExpenseCost,

                operationalCost,

                fuelEfficiency: `${fuelEfficiencyValue} km/L`,

                latestTripDistance: latestDistance,
                latestTripFuelConsumed: latestTripFuel,
                latestFuelLogLiters: latestFuelLiters,
                latestFuelLogCost: Number(latestFuelRow?.cost || 0),

                vehicleOperationalCosts: perVehicleOperationalCost.rows
            }

        });



    } catch(error) {


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

}