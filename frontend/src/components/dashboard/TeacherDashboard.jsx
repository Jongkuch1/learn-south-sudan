import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { teacherService } from '../../services/teacherService'
import { activityService } from '../../services/activityService'
import { useLanguage } from '../../contexts/LanguageContext'
import { getSubjectById, getAllSubjects } from '../../data/subjects'

const TeacherDashboard = ({ user }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [showClassModal, setShowClassModal] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    students: '',
    schedule: '',
    days: [],
    time: ''
  })

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    const currentUser = users.find(u => u.id === user.id) || user
    
    const stats = teacherService.getStats(user.id)
    const classes = teacherService.getClasses(user.id)
    const assignments = teacherService.getAssignments(user.id)
    
    // Get real recent activities from assignments and sessions
    const sessions = JSON.parse(localStorage.getItem('tutoring_sessions') || '[]')
    const teacherSessions = sessions.filter(s => s.teacherId == user.id)
    
    const recentActivities = [
      ...assignments.slice(-3).map(a => ({
        id: `assign-${a.id}`,
        type: 'assignment',
        title: 'Created Assignment',
        description: `${a.title} for ${a.class}`,
        timestamp: a.createdAt
      })),
      ...teacherSessions.slice(-2).map(s => ({
        id: `session-${s.id}`,
        type: 'session',
        title: 'Scheduled Session',
        description: `${s.subject} with ${s.studentName}`,
        timestamp: s.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
    
    setData({
      stats,
      classes,
      pendingAssignments: assignments,
      recentActivity: recentActivities,
      userSubjects: currentUser.subjects || []
    })
  }, [user.id])

  const handleAddClass = () => {
    setShowClassModal(true)
  }

  const handleSaveClass = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('handleSaveClass called')
    console.log('newClass:', newClass)
    console.log('user:', user)
    
    if (!newClass.name || !newClass.subject || !newClass.students || newClass.days.length === 0 || !newClass.time) {
      alert('Please fill in all fields')
      return
    }
    
    try {
      console.log('Starting save process...')
      const schedule = `${newClass.days.join(', ')} at ${newClass.time}`
      console.log('Schedule:', schedule)
      
      const classData = {
        name: newClass.name,
        subject: newClass.subject,
        students: parseInt(newClass.students),
        schedule
      }
      console.log('Class data to save:', classData)
      
      const savedClass = teacherService.addClass(user.id, classData)
      console.log('Class saved successfully:', savedClass)
      
      // Reload data
      console.log('Reloading data...')
      const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
      const currentUser = users.find(u => u.id === user.id) || user
      const stats = teacherService.getStats(user.id)
      const classes = teacherService.getClasses(user.id)
      console.log('Classes after save:', classes)
      const assignments = teacherService.getAssignments(user.id)
      const sessions = JSON.parse(localStorage.getItem('tutoring_sessions') || '[]')
      const teacherSessions = sessions.filter(s => s.teacherId == user.id)
      const recentActivities = [
        ...assignments.slice(-3).map(a => ({
          id: `assign-${a.id}`,
          type: 'assignment',
          title: 'Created Assignment',
          description: `${a.title} for ${a.class}`,
          timestamp: a.createdAt
        })),
        ...teacherSessions.slice(-2).map(s => ({
          id: `session-${s.id}`,
          type: 'session',
          title: 'Scheduled Session',
          description: `${s.subject} with ${s.studentName}`,
          timestamp: s.createdAt
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
      
      console.log('Setting new data...')
      setData({
        stats,
        classes,
        pendingAssignments: assignments,
        recentActivity: recentActivities,
        userSubjects: currentUser.subjects || []
      })
      
      // Close modal and reset
      console.log('Closing modal...')
      setShowClassModal(false)
      setNewClass({ name: '', subject: '', students: '', schedule: '', days: [], time: '' })
      
      alert('✓ Class added successfully!')
      console.log('Save complete!')
    } catch (error) {
      console.error('ERROR in handleSaveClass:', error)
      console.error('Error stack:', error.stack)
      alert(`Failed to save class: ${error.message}`)
    }
  }

  const toggleDay = (day) => {
    setNewClass(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  const handleAddAssignment = () => {
    navigate('/teacher/create-assignment')
  }

  if (!data) return <div>{t('loading')}</div>

  return (
    <div className="teacher-dashboard">
      {showClassModal && (
        <div 
          className="modal-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="modal-content" 
            style={{ 
              maxWidth: '500px',
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1001
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Add New Class</h2>
              <button 
                type="button" 
                onClick={() => setShowClassModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '0',
                  width: '30px',
                  height: '30px'
                }}
              >
                ×
              </button>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Class Name *</label>
              <input
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                type="text"
                placeholder="e.g., Grade 10 Mathematics"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Subject *</label>
              <select
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              >
                <option value="">Select Subject</option>
                {getAllSubjects().map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Number of Students *</label>
              <input
                type="number"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g., 30"
                value={newClass.students}
                onChange={(e) => setNewClass({ ...newClass, students: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Class Days *</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '8px 16px',
                      border: '2px solid #007bff',
                      background: newClass.days.includes(day) ? '#007bff' : 'white',
                      color: newClass.days.includes(day) ? 'white' : '#007bff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Class Time *</label>
              <input
                type="time"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                value={newClass.time}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-primary" onClick={handleSaveClass}>
                <i className="fas fa-save"></i> Save Class
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowClassModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1>{t('welcomeBackUser')}, {user.name}!</h1>
        {data.userSubjects && data.userSubjects.length > 0 ? (
          <p>
            {data.userSubjects.map(id => getSubjectById(parseInt(id))?.name).filter(Boolean).join(', ')} {t('teacher') || 'Teacher'}
          </p>
        ) : (
          <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>
              <i className="fas fa-exclamation-triangle"></i> No Subjects Assigned
            </h3>
            <p style={{ margin: 0, color: '#856404' }}>You haven't been assigned any teaching subjects yet. Please contact the administrator.</p>
          </div>
        )}
      </div>

      <div className="dashboard-stats">
        <div className="stat-box">
          <i className="fas fa-users"></i>
          <div>
            <h3>{data.stats.totalStudents}</h3>
            <p>{t('totalStudents')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-chalkboard"></i>
          <div>
            <h3>{data.stats.activeClasses}</h3>
            <p>{t('activeClasses')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-calendar-check"></i>
          <div>
            <h3>{data.stats.sessionsThisWeek}</h3>
            <p>{t('sessionsThisWeek')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-star"></i>
          <div>
            <h3>{data.stats.averageRating}</h3>
            <p>{t('averageRating')}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-users"></i></div>
          <h3>{t('studentProgress')}</h3>
          <p>{t('viewAllStudentPerformance')}</p>
          <Link to="/students" className="btn btn-primary">{t('viewStudents')}</Link>
        </div>



        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-clipboard-list"></i></div>
          <h3>{t('assignments')}</h3>
          <p>{data.pendingAssignments.length} {t('pendingAssignments')}</p>
          <button className="btn btn-primary" onClick={handleAddAssignment}>{t('createAssignment')}</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-question-circle"></i></div>
          <h3>Quizzes</h3>
          <p>Create and manage quizzes</p>
          <Link to="/teacher/quizzes" className="btn btn-primary">Manage Quizzes</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-folder-open"></i></div>
          <h3>Resources</h3>
          <p>Upload and manage learning resources</p>
          <Link to="/resources" className="btn btn-primary">Manage Resources</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-chalkboard-teacher"></i></div>
          <h3>Virtual Tutoring</h3>
          <p>Schedule and manage tutoring sessions</p>
          <Link to="/tutoring" className="btn btn-primary">Manage Sessions</Link>
        </div>


      </div>

      <div className="teacher-sections">
        <div className="section-card">
          <h2>{t('assignments') || 'Assignments'}</h2>
          {data.pendingAssignments.length === 0 ? (
            <div className="no-data">
              <p>No assignments yet. Click "Create Assignment" to add one.</p>
            </div>
          ) : (
            <div className="assignment-list">
              {data.pendingAssignments.map(assignment => (
                <div key={assignment.id} className="assignment-item">
                  <strong style={{ wordBreak: 'break-word' }}>{assignment.title}</strong>
                  <p style={{ wordBreak: 'break-word' }}>{assignment.class} - {assignment.subject}</p>
                  <span className="due-date">{t('due')}: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="recent-activity-section">
        <h2>{t('recentActivity')}</h2>
        {data.recentActivity.length === 0 ? (
          <div className="no-activity">
            <i className="fas fa-inbox"></i>
            <p>{t('noRecentActivities')}</p>
          </div>
        ) : (
          <div className="activity-list">
            {data.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <i className={`fas fa-${activity.type === 'assignment' ? 'clipboard-list' : 'chalkboard-teacher'}`}></i>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ wordBreak: 'break-word' }}>{activity.title}</strong>
                  <p style={{ wordBreak: 'break-word' }}>{activity.description} - {activityService.getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard
