import { useEffect, useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard.jsx'
import { getBackendHealth, signInUser, signUpUser } from './services/authService.js'

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
        const data = await getBackendHealth()
        const dbState = data.database === 'connected' ? 'PostgreSQL connected' : 'Backend available'
        setBackendStatus(dbState)
      } catch {
        setBackendStatus('Backend unavailable')
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
      const data = mode === 'login' ? await signInUser(form) : await signUpUser(form)

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
      <Dashboard
        currentUser={currentUser}
        backendStatus={backendStatus}
        onLogout={logout}
      />
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
