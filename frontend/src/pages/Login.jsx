import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('teacher@ssplp.org') // example
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        // show error (data.error or generic)
        alert(data.error || 'Login failed')
        setSubmitting(false)
        return
      }
      // Expect data.token and data.user
      const { token, user } = data
      if (!token) {
        alert('Login did not return a token')
        setSubmitting(false)
        return
      }
      // Save token/user in AuthContext which also persists
      await auth.login({ token, user })
      // Redirect to dashboard
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error(err)
      alert('Network error during login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" disabled={submitting}>{submitting ? 'Signing In...' : 'Sign In'}</button>
    </form>
  )
}