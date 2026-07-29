import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)

      const res = await axios.post(`${API}/auth/login`, formData)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('username', res.data.username)
      navigate('/chat')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">Con<span>vex</span></div>
        <h2>Welcome back!</h2>
        <p className="auth-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}