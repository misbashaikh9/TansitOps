import pool from "../db.js";

export async function getDrivers(req, res) {

    try {

        const result = await pool.query(
            "SELECT * FROM drivers ORDER BY id DESC"
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch(error) {

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
}