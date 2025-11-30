import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminService } from '../../services/adminService'
import { useLanguage } from '../../contexts/LanguageContext'
import { getAllSubjects } from '../../data/subjects'

const Register = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      return
    }


    
    setLoading(true)
    
    // Register user in admin system
    adminService.registerUser({
      name: formData.name,
      email: formData.email,
      role: formData.role
    })
    
    const result = await register(formData)
    
    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => navigate('/login'), 2000)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('createAccount')}</h2>
          <p>{t('joinSSPLP')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">{t('fullName')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('enterFullName')}
            />
          </div>
          
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
            <label htmlFor="role">{t('role')}</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">{t('student')}</option>
              <option value="teacher">{t('teacher')}</option>
            </select>
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
              placeholder={t('createPassword')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder={t('confirmYourPassword')}
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> {t('creatingAccount')}</> : t('signUp')}
          </button>
        </form>
        
        {error && <div className="message error"><i className="fas fa-exclamation-circle"></i> {error}</div>}
        {success && <div className="message success"><i className="fas fa-check-circle"></i> {success}</div>}
        
        <div className="auth-footer">
          <p>{t('alreadyHaveAccount')} <Link to="/login">{t('signIn')}</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register
