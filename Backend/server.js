import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDatabase, isDatabaseReady } from './src/db.js'
import { signup, login } from './src/authController.js'
import vehicleRoutes  from "./src/vehicle/vehicleRoutes.js";
import driverRoutes from "./src/driver/driverRoutes.js";
import tripRoutes from "./src/trip/tripRoutes.js";
import fuelRoutes from "./src/fuel/fuelRoutes.js";
import maintenanceRoutes from "./src/maintenance/maintenanceRoute.js";
import reportsRoutes from "./src/reports/reportsRoutes.js";


const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors())
app.use(express.json())
app.use("/api/vehicles",vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/reports", reportsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDatabaseReady() ? 'connected' : 'demo-mode',
  })
})

app.post('/api/auth/signup', signup)
app.post('/api/auth/login', login)

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload.',
    })
  }

  return next(error)
})


await initDatabase()

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Backend listening on http://127.0.0.1:${port}`)
})

server.on('error', (error) => {
  if (error?.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing process or change PORT.`)
    process.exit(1)
  }

  console.error(error)
  process.exit(1)
})
