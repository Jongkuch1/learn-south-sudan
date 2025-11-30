import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { messagingService } from '../../services/messagingService'
import { notificationService } from '../../services/notificationService'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userAvatar, setUserAvatar] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifCount, setNotifCount] = useState(0)
  const { user, logout } = useAuth()
  const { language, changeLanguage, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const currentUser = JSON.parse(localStorage.getItem('ssplp_user') || '{}')
      setUserAvatar(currentUser.avatar || null)
      
      const updateUnreadCount = () => {
        const count = messagingService.getUnreadCount(user.id)
        setUnreadCount(count)
        const nCount = notificationService.getUnreadCount(user.id)
        setNotifCount(nCount)
      }
      
      updateUnreadCount()
      const interval = setInterval(updateUnreadCount, 2000)
      
      // Listen for storage changes
      const handleStorage = () => {
        const updated = JSON.parse(localStorage.getItem('ssplp_user') || '{}')
        setUserAvatar(updated.avatar || null)
      }
      window.addEventListener('storage', handleStorage)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('storage', handleStorage)
      }
    }
  }, [user?.id, user?.name, user?.avatar])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const isActiveLink = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <img src="/logo.png" alt="SSPLP Logo" className="logo-image" />
          <span>SSPLP</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActiveLink('/dashboard')}`} onClick={() => setIsMenuOpen(false)}>
                {t('dashboard')}
              </Link>
              <Link to="/messages" className={`nav-link ${isActiveLink('/messages')}`} onClick={() => setIsMenuOpen(false)}>
                {t('messages')}
                {(unreadCount + notifCount) > 0 && <span className="notification-badge">{unreadCount + notifCount}</span>}
              </Link>
              {user.role !== 'admin' && (
                <Link to="/reports" className={`nav-link ${isActiveLink('/reports')}`} onClick={() => setIsMenuOpen(false)}>
                  {t('reports')}
                </Link>
              )}
              
              {user.role === 'student' && (
                <>
                  <Link to="/subjects" className={`nav-link ${isActiveLink('/subjects') || isActiveLink('/quizzes') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    {t('learning')}
                  </Link>
                  <Link to="/tutors" className={`nav-link ${isActiveLink('/tutors')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('tutors')}
                  </Link>
                  <Link to="/tutoring" className={`nav-link ${isActiveLink('/tutoring')}`} onClick={() => setIsMenuOpen(false)}>
                    Tutoring
                  </Link>
                  <Link to="/progress" className={`nav-link ${isActiveLink('/progress')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('progress')}
                  </Link>
                </>
              )}
              {user.role === 'teacher' && (
                <>
                  <Link to="/teacher/quizzes" className={`nav-link ${isActiveLink('/teacher/quizzes')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('quizzes')}
                  </Link>
                  <Link to="/students" className={`nav-link ${isActiveLink('/students')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('students')}
                  </Link>
                  <Link to="/teacher/resources" className={`nav-link ${isActiveLink('/teacher/resources')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('resources')}
                  </Link>
                  <Link to="/tutoring" className={`nav-link ${isActiveLink('/tutoring')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('tutoring')}
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/analytics" className={`nav-link ${isActiveLink('/analytics')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('analytics')}
                  </Link>
                  <Link to="/students" className={`nav-link ${isActiveLink('/students')}`} onClick={() => setIsMenuOpen(false)}>
                    {t('users')}
                  </Link>
                </>
              )}
              
              <div className="user-menu">
                <div className="dropdown">
                  <button className="dropdown-btn">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Avatar" className="nav-avatar" />
                    ) : (
                      <i className="fas fa-user-circle"></i>
                    )}
                    <span>{JSON.parse(localStorage.getItem('ssplp_user') || '{}').name || user.name}</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <div className="dropdown-content">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-user"></i>
                      {t('profile')}
                    </Link>
                    <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-bell"></i>
                      {t('notifications')}
                    </Link>
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-cog"></i>
                      {t('settings')}
                    </Link>
                    <button onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      {t('logout')}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-login" onClick={() => setIsMenuOpen(false)}>
                {t('signIn')}
              </Link>
              <Link to="/register" className="btn btn-signup" onClick={() => setIsMenuOpen(false)}>
                {t('signUp')}
              </Link>
            </div>
          )}
          
          <div className="language-switcher">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
              onClick={() => changeLanguage('ar')}
            >
              AR
            </button>
          </div>
        </div>

        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
