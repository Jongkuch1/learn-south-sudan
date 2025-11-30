import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { adminService } from '../../services/adminService'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const Tutors = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tutors, setTutors] = useState([])

  useEffect(() => {
    loadTutors()
  }, [])

  const loadTutors = () => {
    const allUsers = adminService.getAllUsers()
    const demoEmails = ['teacher@ssplp.org', 'admin@ssplp.org']
    const teachers = allUsers.filter(u => u.role === 'teacher' && !demoEmails.includes(u.email))
    
    // Remove duplicates based on email
    const uniqueTeachers = teachers.reduce((acc, current) => {
      const exists = acc.find(item => item.email === current.email)
      if (!exists) {
        acc.push(current)
      }
      return acc
    }, [])
    
    setTutors(uniqueTeachers)
  }

  const handleBookSession = (teacher) => {
    navigate('/messages', { state: { startChatWith: teacher } })
  }

  return (
    <div className="tutors-page">
      <div className="container">
        <h1>{t('findATutor')}</h1>
        <p>{t('connectWithExperts')}</p>

        <div className="tutors-grid">
          {tutors.length === 0 ? (
            <div className="no-tutors">
              <i className="fas fa-chalkboard-teacher"></i>
              <p>{t('noTeachersAvailable')}</p>
            </div>
          ) : (
            tutors.map(tutor => (
              <div key={tutor.id} className="tutor-card">
                <div className="tutor-avatar">
                  {tutor.avatar ? (
                    <img src={tutor.avatar} alt={tutor.name} />
                  ) : (
                    <i className="fas fa-user-circle"></i>
                  )}
                </div>
                <h3>{tutor.name}</h3>
                <p className="tutor-email">{tutor.email}</p>
                {tutor.specialization && (
                  <p className="tutor-subject">
                    <i className="fas fa-book"></i> {tutor.specialization}
                  </p>
                )}
                {tutor.school && (
                  <p className="tutor-school">
                    <i className="fas fa-school"></i> {tutor.school}
                  </p>
                )}
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleBookSession(tutor)}
                >
                  <i className="fas fa-comment"></i> {t('messageTeacher')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Tutors
