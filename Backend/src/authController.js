import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getUserByEmail, saveUser } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret'

function buildToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '1h' },
  )
}

export async function signup(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await saveUser({ name, email, passwordHash })
  const token = buildToken(user)

  return res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = await getUserByEmail(email)
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = buildToken(user)

  return res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
}
