import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:5000/api'

const initialForm = {
  name: '',
  email: '',
  password: '',
}

function App() {
  const [mode, setMode] = useState('signup')
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ loading: false, message: '', error: '' })
  const [backendStatus, setBackendStatus] = useState('Checking backend...')
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('authUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(`${API_URL}/health`)
        const data = await response.json()
        const dbState = data.database === 'connected' ? 'PostgreSQL connected' : 'Demo auth mode'
        setBackendStatus(dbState)
      } catch {
        setBackendStatus('Backend unavailable on port 5000')
      }
    }

    checkBackend()
  }, [])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, message: '', error: '' })

    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))
      setCurrentUser(data.user)
      setStatus({
        loading: false,
        message: data.message,
        error: '',
      })
      setForm(initialForm)
    } catch (error) {
      setStatus({
        loading: false,
        message: '',
        error: error.message,
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('authUser')
    setCurrentUser(null)
    setStatus({ loading: false, message: 'You have been signed out.', error: '' })
  }

  if (currentUser) {
    return (
      <main className="dashboard-wrapper">
        <section className="dashboard-card">
          <div className="dashboard-header">
            <div>
              <span className="pill">Dashboard</span>
              <h1>Welcome, {currentUser.name}</h1>
              <p>Here’s your quick overview after login.</p>
            </div>
            <button type="button" className="secondary-button" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="dashboard-grid">
            <article className="metric-card">
              <span>Today’s visits</span>
              <strong>42</strong>
              <small>+12% from yesterday</small>
            </article>

            <article className="metric-card">
              <span>Open tasks</span>
              <strong>8</strong>
              <small>4 urgent items</small>
            </article>

            <article className="metric-card">
              <span>Revenue</span>
              <strong>$2.4k</strong>
              <small>On track this week</small>
            </article>
          </div>

          <div className="dashboard-bottom">
            <div className="list-card">
              <h2>Quick actions</h2>
              <ul>
                <li>Review recent sign-ins</li>
                <li>Check pending approvals</li>
                <li>Update your profile</li>
              </ul>
            </div>

            <div className="list-card">
              <h2>Profile</h2>
              <p>{currentUser.email}</p>
              <p className="backend-status">Backend: {backendStatus}</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="pill">Auth starter</span>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p>
            Simple React authentication UI with a Node/Express backend ready for PostgreSQL.
          </p>
          <strong className="backend-status">Backend: {backendStatus}</strong>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="mode-switch">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
          </div>

          {mode === 'signup' && (
            <label>
              <span>Name</span>
              <input
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={onChange}
                required
              />
            </label>
          )}

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={status.loading}>
            {status.loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign up'}
          </button>

          {status.message && <p className="status success">{status.message}</p>}
          {status.error && <p className="status error">{status.error}</p>}
        </form>
      </section>
    </main>
  )
}

export default App
