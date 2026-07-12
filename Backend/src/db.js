import pg from 'pg'

const { Pool } = pg
const fallbackUsers = []
let databaseReady = false

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : null

export async function initDatabase() {
  if (!pool) {
    console.log('DATABASE_URL not set. Falling back to in-memory storage for demo auth.')
    return
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    databaseReady = true
    console.log('PostgreSQL connected successfully.')
  } catch (error) {
    console.warn('Unable to connect to PostgreSQL. Falling back to in-memory storage.')
    console.warn(error.message)
    databaseReady = false
  }
}

export function isDatabaseReady() {
  return databaseReady
}

export async function getUserByEmail(email) {
  if (!pool || !databaseReady) {
    return fallbackUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  const result = await pool.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email.toLowerCase()],
  )

  return result.rows[0] || null
}

export async function saveUser({ name, email, passwordHash }) {
  if (!pool || !databaseReady) {
    const newUser = {
      id: `memory-${fallbackUsers.length + 1}`,
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
    }

    fallbackUsers.push(newUser)
    return newUser
  }

  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, password_hash',
    [name, email.toLowerCase(), passwordHash],
  )

  return result.rows[0]
}
