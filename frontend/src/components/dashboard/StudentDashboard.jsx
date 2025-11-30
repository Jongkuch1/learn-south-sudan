import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../../services/dashboardService'
import { progressService } from '../../services/progressService'
import { activityService } from '../../services/activityService'
import { tutoringService } from '../../services/tutoringService'
import { useLanguage } from '../../contexts/LanguageContext'
import TeacherResources from './TeacherResources'

const AssignmentsList = ({ userId }) => {
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    const allAssignments = []
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('ssplp_teacher_assignments_')) {
        const teacherAssignments = JSON.parse(localStorage.getItem(key) || '[]')
        allAssignments.push(...teacherAssignments)
      }
    })
    setAssignments(allAssignments)
  }, [userId])

  if (assignments.length === 0) {
    return <div className="no-data"><p>No assignments available</p></div>
  }

  return (
    <div className="assignment-list">
      {assignments.map(assignment => (
        <div key={assignment.id} className="assignment-item">
          <strong>{assignment.title}</strong>
          <p>{assignment.class} - {assignment.submitted}/{assignment.total} submitted</p>
          <span className="due-date">Due: {assignment.dueDate}</span>
          <Link to={`/assignment/${assignment.id}`} className="btn btn-sm btn-primary" style={{ marginTop: '0.5rem' }}>
            <i className="fas fa-pencil-alt"></i> Take Assignment
          </Link>
        </div>
      ))}
    </div>
  )
}

const StudentDashboard = ({ user }) => {
  const { t } = useLanguage()
  const [data, setData] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const studentData = await dashboardService.getStudentData(user.id)
      const overallProgress = progressService.getOverallProgress(user.id)
      const enrolledCount = progressService.getEnrolledSubjects(user.id).length
      const completedModules = progressService.getCompletedModules(user.id)
      const recentActivities = activityService.getRecentActivities(user.id, 5)
      
      // Get all sessions and filter for this student (including their ID as string or number)
      const allSessions = tutoringService.getAllSessions()
      const studentSessions = allSessions.filter(s => {
        const sessionStudentId = String(s.studentId)
        const currentUserId = String(user.id)
        return sessionStudentId === currentUserId && s.status === 'scheduled'
      })
      const upcomingSessions = studentSessions
        .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
        .slice(0, 3)
      
      studentData.stats.overallProgress = overallProgress
      studentData.stats.activeCourses = enrolledCount
      studentData.stats.completedModules = completedModules
      studentData.recentActivity = recentActivities
      studentData.upcomingSessions = upcomingSessions
      
      setData(studentData)
    }
    
    loadData()
    
    // Refresh when window gains focus
    const handleFocus = () => loadData()
    window.addEventListener('focus', handleFocus)
    
    return () => window.removeEventListener('focus', handleFocus)
  }, [user.id, user.name])

  if (!data) return <div>{t('loading')}</div>

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>{t('welcomeBackUser')}, {user.name}!</h1>
        <p>{t('continueJourney')} - {user.grade}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-box">
          <i className="fas fa-book"></i>
          <div>
            <h3>{data.stats.activeCourses}</h3>
            <p>{t('activeCourses')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-chart-line"></i>
          <div>
            <h3>{data.stats.overallProgress}%</h3>
            <p>{t('overallProgress')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-trophy"></i>
          <div>
            <h3>{data.stats.completedModules}</h3>
            <p>{t('completedModules')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-star"></i>
          <div>
            <h3>{data?.stats?.quizAverage || 0}%</h3>
            <p>{t('quizAverage')}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-clipboard-list"></i></div>
          <h3>{t('quizzes') || 'Quizzes'}</h3>
          <p>Test your knowledge and track your progress</p>
          <Link to="/quizzes" className="btn btn-primary">Take Quizzes</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-chalkboard-teacher"></i></div>
          <h3>{t('findTutors')}</h3>
          <p>{t('getHelpFromExperts')}</p>
          <Link to="/tutors" className="btn btn-primary">{t('browseTutors')}</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-video"></i></div>
          <h3>Virtual Tutoring</h3>
          <p>{data.upcomingSessions?.length || 0} upcoming sessions</p>
          <Link to="/tutoring" className="btn btn-primary">View Sessions</Link>
        </div>
      </div>

      {data.upcomingSessions && data.upcomingSessions.length > 0 && (
        <div className="recent-activity-section" style={{ marginBottom: '2rem' }}>
          <h2><i className="fas fa-video"></i> Upcoming Tutoring Sessions</h2>
          <div className="activity-list">
            {data.upcomingSessions.map(session => (
              <div key={session.id} className="activity-item" style={{ background: '#e3f2fd', border: '2px solid #2196F3' }}>
                <i className="fas fa-chalkboard-teacher" style={{ color: '#2196F3', fontSize: '1.5rem' }}></i>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ wordBreak: 'break-word', color: '#1976d2' }}>{session.subject} - {session.topic}</strong>
                  <p style={{ wordBreak: 'break-word', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-user"></i> Teacher: {session.teacherName}
                  </p>
                  <p style={{ wordBreak: 'break-word', margin: 0, fontSize: '0.9rem' }}>
                    <i className="fas fa-calendar"></i> {new Date(session.date).toLocaleDateString()} at {session.time}
                  </p>
                </div>
                <a 
                  href="https://meet.google.com/zce-wnss-vvr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <i className="fas fa-video"></i> Join
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <TeacherResources user={user} />

      <div className="assignments-section">
        <h2><i className="fas fa-clipboard-list"></i> Available Assignments</h2>
        <AssignmentsList userId={user.id} />
      </div>

      <div className="recent-activity-section">
        <h2>{t('recentActivity')}</h2>
        {data.recentActivity.length === 0 ? (
          <div className="no-activity">
            <i className="fas fa-inbox"></i>
            <p>{t('noActivitiesYet')}</p>
          </div>
        ) : (
          <div className="activity-list">
            {data.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <i className={`fas fa-${activity.type === 'start' ? 'play-circle' : activity.type === 'progress' ? 'book-open' : 'trophy'}`}></i>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.subjectName} - {activityService.getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
