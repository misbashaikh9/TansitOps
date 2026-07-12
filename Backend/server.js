import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDatabase, isDatabaseReady } from './src/db.js'
import { signup, login } from './src/authController.js'

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDatabaseReady() ? 'connected' : 'demo-mode',
  })
})

app.post('/api/auth/signup', signup)
app.post('/api/auth/login', login)

await initDatabase()

app.listen(port, '127.0.0.1', () => {
  console.log(`Backend listening on http://127.0.0.1:${port}`)
})
