import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { tutoringService } from '../services/tutoringService'
import { adminService } from '../services/adminService'
import { useLanguage } from '../contexts/LanguageContext'

const Tutoring = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])

  useEffect(() => {
    if (user) {
      loadSessions()
      if (user.role === 'teacher') {
        const allUsers = adminService.getAllUsers()
        setStudents(allUsers.filter(u => u.role === 'student'))
      } else if (user.role === 'student') {
        const allUsers = adminService.getAllUsers()
        setTeachers(allUsers.filter(u => u.role === 'teacher'))
      }
    }
  }, [user])

  const loadSessions = () => {
    const userSessions = tutoringService.getUserSessions(user.id, user.role)
    setSessions(userSessions)
  }

  const handleCreateSession = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    if (user.role === 'teacher') {
      const studentIds = formData.get('students').split(',').map(s => s.trim())
      tutoringService.createSession(user.id, studentIds, {
        title: formData.get('title'),
        subject: formData.get('subject'),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: formData.get('duration'),
        type: formData.get('type')
      })
    } else {
      tutoringService.createSession(formData.get('teacher'), [user.id], {
        title: formData.get('title'),
        subject: formData.get('subject'),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: formData.get('duration'),
        type: 'individual'
      })
    }
    
    setShowCreateModal(false)
    loadSessions()
  }

  const handleJoinSession = (sessionId) => {
    const link = tutoringService.generateMeetingLink(sessionId)
    window.open(link, '_blank')
    tutoringService.updateSessionStatus(sessionId, 'in-progress')
    loadSessions()
  }

  const handleCompleteSession = (sessionId) => {
    tutoringService.updateSessionStatus(sessionId, 'completed')
    loadSessions()
  }

  return (
    <div className="tutoring-page">
      <div className="container">
        <div className="tutoring-header">
          <h1>{t('virtualTutoring')}</h1>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <i className="fas fa-plus"></i> {t('scheduleSession')}
          </button>
        </div>

        <div className="sessions-list">
          {sessions.length === 0 ? (
            <div className="no-sessions">
              <i className="fas fa-video-slash"></i>
              <p>{t('noSessionsScheduled')}</p>
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.id} className={`session-card ${session.status}`}>
                <div className="session-header">
                  <h3>{session.title}</h3>
                  <span className={`status-badge ${session.status}`}>{session.status}</span>
                </div>
                <div className="session-details">
                  <p><i className="fas fa-book"></i> {session.subject}</p>
                  <p><i className="fas fa-calendar"></i> {session.date}</p>
                  <p><i className="fas fa-clock"></i> {session.time} ({session.duration})</p>
                  <p><i className="fas fa-users"></i> {session.type === 'group' ? t('groupSession') : t('individualSession')}</p>
                </div>
                <div className="session-actions">
                  {session.status === 'scheduled' && (
                    <button className="btn btn-primary" onClick={() => handleJoinSession(session.id)}>
                      <i className="fas fa-video"></i> {t('joinSession')}
                    </button>
                  )}
                  {session.status === 'in-progress' && user.role === 'teacher' && (
                    <button className="btn btn-success" onClick={() => handleCompleteSession(session.id)}>
                      <i className="fas fa-check"></i> {t('completeSession')}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{t('scheduleSession')}</h2>
              <form onSubmit={handleCreateSession}>
                <input type="text" name="title" placeholder={t('sessionTitle')} required />
                <input type="text" name="subject" placeholder={t('subject')} required />
                <input type="date" name="date" required />
                <input type="time" name="time" required />
                <input type="text" name="duration" placeholder="Duration (e.g., 1 hour)" required />
                
                {user.role === 'teacher' ? (
                  <>
                    <select name="type" required>
                      <option value="individual">{t('individualSession')}</option>
                      <option value="group">{t('groupSession')}</option>
                    </select>
                    <input type="text" name="students" placeholder="Student IDs (comma-separated)" required />
                  </>
                ) : (
                  <select name="teacher" required>
                    <option value="">{t('selectTeacher')}</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </select>
                )}
                
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary">{t('schedule')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tutoring
