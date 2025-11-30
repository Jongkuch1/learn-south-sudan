import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Login = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError(t('pleaseFillAllFields'))
      return
    }
    
    setLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      
      if (result && result.success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError(result?.error || 'Invalid credentials')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('welcomeBack')}</h2>
          <p>{t('signInToAccount')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('enterYourEmail')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={t('enterYourPassword')}
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> {t('signingIn')}</> : t('signIn')}
          </button>
        </form>
        
        {error && (
          <div className="message error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        
        <div className="auth-footer">
          <p>{t('dontHaveAccount')} <Link to="/register">{t('signUp')}</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
