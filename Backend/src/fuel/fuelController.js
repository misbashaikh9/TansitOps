import pool from "../db.js";


export async function createFuel(req, res) {

    try {

        const {
            vehicle_id,
            liters,
            cost,
            date
        } = req.body;

        if (!Number.isInteger(Number(vehicle_id)) || Number(vehicle_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid vehicle_id is required"
            });
        }

        if (Number.isNaN(Number(liters)) || Number(liters) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Liters must be greater than 0"
            });
        }

        if (Number.isNaN(Number(cost)) || Number(cost) < 0) {
            return res.status(400).json({
                success: false,
                message: "Cost must be a valid non-negative number"
            });
        }

        const vehicleResult = await pool.query(
            "SELECT id FROM vehicles WHERE id=$1",
            [Number(vehicle_id)]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        const fuelResult = await pool.query(
            `
            INSERT INTO fuel_logs
            (
                vehicle_id,
                liters,
                cost,
                date
            )
            VALUES($1,$2,$3,$4)
            RETURNING *
            `,
            [
                Number(vehicle_id),
                Number(liters),
                Number(cost),
                date || new Date().toISOString().slice(0, 10)
            ]
        );

        await pool.query(
            `
            INSERT INTO expenses
            (
                vehicle_id,
                expense_type,
                amount,
                date
            )
            VALUES($1,'Fuel',$2,$3)
            `,
            [
                Number(vehicle_id),
                Number(cost),
                date || new Date().toISOString().slice(0, 10)
            ]
        );

        res.status(201).json({
            success: true,
            message: "Fuel record created",
            data: fuelResult.rows[0]
        });

    } catch(error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}


export async function createExpense(req, res) {

    try {

        const {
            vehicle_id,
            expense_type,
            amount,
            date,
            note
        } = req.body;

        if (!Number.isInteger(Number(vehicle_id)) || Number(vehicle_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid vehicle_id is required"
            });
        }

        if (!expense_type || !String(expense_type).trim()) {
            return res.status(400).json({
                success: false,
                message: "expense_type is required"
            });
        }

        if (Number.isNaN(Number(amount)) || Number(amount) < 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a valid non-negative number"
            });
        }

        const vehicleResult = await pool.query(
            "SELECT id FROM vehicles WHERE id=$1",
            [Number(vehicle_id)]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        const expenseResult = await pool.query(
            `
            INSERT INTO expenses
            (
                vehicle_id,
                expense_type,
                amount,
                date,
                note
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                Number(vehicle_id),
                String(expense_type).trim(),
                Number(amount),
                date || new Date().toISOString().slice(0, 10),
                note || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Expense record created",
            data: expenseResult.rows[0]
        });

    } catch(error) {

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

}


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


export async function getExpenses(req, res) {

    try {

        const result = await pool.query(`
            SELECT
                expenses.id,
                expenses.expense_type,
                expenses.amount,
                expenses.date,
                expenses.note,
                vehicles.vehicle_name,
                vehicles.registration_number
            FROM expenses
            LEFT JOIN vehicles
            ON expenses.vehicle_id = vehicles.id
            WHERE expenses.expense_type <> 'Fuel'
            ORDER BY expenses.id DESC
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