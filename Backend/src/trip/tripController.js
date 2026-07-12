import pool from "../db.js";

// CREATE TRIP
export async function createTrip(req, res) {

    try {

        const {
            source,
            destination,
            vehicle_id,
            driver_id,
            cargo_weight,
            planned_distance
        } = req.body;

        // Check Vehicle
        const vehicleResult = await pool.query(
            "SELECT * FROM vehicles WHERE id=$1",
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        const vehicle = vehicleResult.rows[0];

        if (vehicle.status !== "Available") {
            return res.status(400).json({
                message: "Vehicle is not available"
            });
        }

        // Cargo validation
        if (Number(cargo_weight) > Number(vehicle.max_load_capacity)) {
            return res.status(400).json({
                message: "Cargo weight exceeds vehicle capacity"
            });
        }

        // Check Driver
        const driverResult = await pool.query(
            "SELECT * FROM drivers WHERE id=$1",
            [driver_id]
        );

        if (driverResult.rows.length === 0) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        const driver = driverResult.rows[0];

        if (driver.status !== "Available") {
            return res.status(400).json({
                message: "Driver is not available"
            });
        }

        // License expiry validation
        const today = new Date();
        const expiryDate = new Date(driver.license_expiry);

        if (expiryDate < today) {
            return res.status(400).json({
                message: "Driver license has expired"
            });
        }

        // Create Trip
        const result = await pool.query(

            `
            INSERT INTO trips
            (
                source,
                destination,
                vehicle_id,
                driver_id,
                cargo_weight,
                planned_distance
            )

            VALUES($1,$2,$3,$4,$5,$6)

            RETURNING *
            `,

            [
                source,
                destination,
                vehicle_id,
                driver_id,
                cargo_weight,
                planned_distance
            ]

        );

        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            data: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

export async function getTrips(req, res) {
    try {

        const result = await pool.query(

            `
            SELECT
                trips.*,
                vehicles.registration_number,
                vehicles.vehicle_name,
                drivers.name AS driver_name

            FROM trips

            JOIN vehicles
                ON trips.vehicle_id = vehicles.id

            JOIN drivers
                ON trips.driver_id = drivers.id

            ORDER BY trips.id DESC
            `

        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}


// GET TRIP BY ID
export async function getTripById(req, res) {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            SELECT
                trips.*,
                vehicles.registration_number,
                vehicles.vehicle_name,
                drivers.name AS driver_name

            FROM trips

            JOIN vehicles
                ON trips.vehicle_id = vehicles.id

            JOIN drivers
                ON trips.driver_id = drivers.id

            WHERE trips.id = $1
            `,

            [id]

        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}
// UPDATE TRIP
export async function updateTrip(req, res) {

    try {

        const { id } = req.params;

        const {
            source,
            destination,
            vehicle_id,
            driver_id,
            cargo_weight,
            planned_distance,
            status
        } = req.body;

        // Check Vehicle
        const vehicleResult = await pool.query(
            "SELECT * FROM vehicles WHERE id=$1",
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        const vehicle = vehicleResult.rows[0];

        if (Number(cargo_weight) > Number(vehicle.max_load_capacity)) {
            return res.status(400).json({
                message: "Cargo weight exceeds vehicle capacity"
            });
        }

        // Check Driver
        const driverResult = await pool.query(
            "SELECT * FROM drivers WHERE id=$1",
            [driver_id]
        );

        if (driverResult.rows.length === 0) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        const result = await pool.query(

            `
            UPDATE trips

            SET

            source=$1,
            destination=$2,
            vehicle_id=$3,
            driver_id=$4,
            cargo_weight=$5,
            planned_distance=$6,
            status=$7,
            updated_at=CURRENT_TIMESTAMP

            WHERE id=$8

            RETURNING *
            `,

            [
                source,
                destination,
                vehicle_id,
                driver_id,
                cargo_weight,
                planned_distance,
                status,
                id
            ]

        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json({
            success: true,
            message: "Trip updated successfully",
            data: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// DELETE TRIP
export async function deleteTrip(req, res) {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM trips WHERE id=$1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json({
            success: true,
            message: "Trip deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// DISPATCH TRIP
export async function dispatchTrip(req, res) {

    try {

        const { id } = req.params;

        // Find Trip
        const tripResult = await pool.query(
            "SELECT * FROM trips WHERE id=$1",
            [id]
        );

        if (tripResult.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const trip = tripResult.rows[0];

        if (trip.status !== "Draft") {
            return res.status(400).json({
                message: "Only Draft trips can be dispatched"
            });
        }

        // Update Trip Status
        await pool.query(
            `
            UPDATE trips
            SET status='Dispatched',
                updated_at=CURRENT_TIMESTAMP
            WHERE id=$1
            `,
            [id]
        );

        // Update Vehicle Status
        await pool.query(
            `
            UPDATE vehicles
            SET status='On Trip'
            WHERE id=$1
            `,
            [trip.vehicle_id]
        );

        // Update Driver Status
        await pool.query(
            `
            UPDATE drivers
            SET status='On Trip'
            WHERE id=$1
            `,
            [trip.driver_id]
        );

        res.json({
            success: true,
            message: "Trip dispatched successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// COMPLETE TRIP
export async function completeTrip(req, res) {

    try {

        const { id } = req.params;

        const { final_odometer, fuel_consumed } = req.body;

        // Check Trip
        const tripResult = await pool.query(
            "SELECT * FROM trips WHERE id=$1",
            [id]
        );

        if (tripResult.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const trip = tripResult.rows[0];

        if (trip.status !== "Dispatched") {
            return res.status(400).json({
                message: "Only dispatched trips can be completed"
            });
        }

        // Update Trip
        await pool.query(
            `
            UPDATE trips

            SET
                status='Completed',
                final_odometer=$1,
                fuel_consumed=$2,
                updated_at=CURRENT_TIMESTAMP

            WHERE id=$3
            `,
            [
                final_odometer,
                fuel_consumed,
                id
            ]
        );

        // Vehicle Available
        await pool.query(
            `
            UPDATE vehicles
            SET status='Available'
            WHERE id=$1
            `,
            [trip.vehicle_id]
        );

        // Driver Available
        await pool.query(
            `
            UPDATE drivers
            SET status='Available'
            WHERE id=$1
            `,
            [trip.driver_id]
        );

        res.json({
            success: true,
            message: "Trip completed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// CANCEL TRIP
export async function cancelTrip(req, res) {

    try {

        const { id } = req.params;

        const tripResult = await pool.query(
            "SELECT * FROM trips WHERE id=$1",
            [id]
        );

        if (tripResult.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const trip = tripResult.rows[0];

        if (trip.status !== "Dispatched") {
            return res.status(400).json({
                message: "Only dispatched trips can be cancelled"
            });
        }

        // Update Trip
        await pool.query(
            `
            UPDATE trips

            SET
                status='Cancelled',
                updated_at=CURRENT_TIMESTAMP

            WHERE id=$1
            `,
            [id]
        );

        // Vehicle Available
        await pool.query(
            `
            UPDATE vehicles
            SET status='Available'
            WHERE id=$1
            `,
            [trip.vehicle_id]
        );

        // Driver Available
        await pool.query(
            `
            UPDATE drivers
            SET status='Available'
            WHERE id=$1
            `,
            [trip.driver_id]
        );

        res.json({
            success: true,
            message: "Trip cancelled successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}