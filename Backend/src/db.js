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
    console.log('DATABASE_URL not set.')
    return
  }

  try {

    await pool.query(`
      
      CREATE TABLE IF NOT EXISTS roles(
        id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL
      );


      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role_id INTEGER REFERENCES roles(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );


      CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        vehicle_name VARCHAR(100),
        model VARCHAR(100),
        type VARCHAR(50),
        max_load_capacity DECIMAL NOT NULL,
        odometer INTEGER DEFAULT 0,
        acquisition_cost DECIMAL,
        status VARCHAR(30) DEFAULT 'Available'
      );


      CREATE TABLE IF NOT EXISTS drivers(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        license_number VARCHAR(100) UNIQUE NOT NULL,
        license_category VARCHAR(50),
        license_expiry DATE,
        contact_number VARCHAR(20),
        safety_score INTEGER DEFAULT 0,
        status VARCHAR(30) DEFAULT 'Available'
      );


 CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,

    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,

    cargo_weight DECIMAL(10,2) NOT NULL,
    planned_distance DECIMAL(10,2) NOT NULL,

    status VARCHAR(20) DEFAULT 'Draft',

    final_odometer DECIMAL(10,2),
    fuel_consumed DECIMAL(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


      CREATE TABLE IF NOT EXISTS maintenance_logs(
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER REFERENCES vehicles(id),
        description TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(30) DEFAULT 'Active'
      );


      CREATE TABLE IF NOT EXISTS fuel_logs(
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER REFERENCES vehicles(id),
        liters DECIMAL,
        cost DECIMAL,
        date DATE
      );


      CREATE TABLE IF NOT EXISTS expenses(
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER REFERENCES vehicles(id),
        expense_type VARCHAR(100),
        amount DECIMAL,
        date DATE
      );

    `);


    // insert default roles

    await pool.query(`
      INSERT INTO roles(role_name)
      VALUES
      ('Admin'),
      ('Dispatcher'),
      ('Manager')
      ON CONFLICT DO NOTHING;
    `);


    databaseReady = true;

    console.log("PostgreSQL database initialized successfully.");

  } catch(error){

    console.log("Database initialization failed");
    console.log(error.message);

    databaseReady = false;
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

export default pool;