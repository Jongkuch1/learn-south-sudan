import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { progressService } from '../../services/progressService'
import { quizService } from '../../services/quizService'
import { resourceService } from '../../services/resourceService'
import { messagingService } from '../../services/messagingService'
import { activityService } from '../../services/activityService'
import { useLanguage } from '../../contexts/LanguageContext'
import { getAllSubjects } from '../../data/subjects'
import './Analytics.css'

const Analytics = () => {
  const { t } = useLanguage()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    try {
      // Get all users from both registered users and hardcoded demo accounts
      const registeredUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
      const demoUsers = [
        { id: 'student-1', name: 'John Doe', email: 'student@ssplp.org', role: 'student' },
        { id: 'teacher-1', name: 'Sarah Michael', email: 'teacher@ssplp.org', role: 'teacher' },
        { id: 'admin-1', name: 'Admin User', email: 'admin@ssplp.org', role: 'admin' }
      ]
      const allUsers = [...demoUsers, ...registeredUsers]
      const students = allUsers.filter(u => u.role === 'student')
      const teachers = allUsers.filter(u => u.role === 'teacher')
    
    const allQuizzes = quizService.getAllQuizzes()
    const allResults = quizService.getAllResults()
    const avgQuizScore = allResults.length > 0 
      ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length)
      : 0

    // Get all resources including generated ones
    const allResources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]')
    const resourcesByType = {
      document: allResources.filter(r => r.type === 'document').length,
      video: allResources.filter(r => r.type === 'video').length,
      audio: allResources.filter(r => r.type === 'audio').length,
      link: allResources.filter(r => r.type === 'link').length
    }

    // Get all messages
    const allMessages = JSON.parse(localStorage.getItem('ssplp_messages') || '[]')
    const messagesThisWeek = allMessages.filter(m => {
      const msgDate = new Date(m.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return msgDate > weekAgo
    }).length

    // Calculate active users based on quiz participation
    const activeStudents = students.filter(s => {
      const studentResults = allResults.filter(r => r.userId === s.id)
      return studentResults.length > 0
    }).length

    const activeTeachers = teachers.filter(t => {
      const teacherQuizzes = allQuizzes.filter(q => q.createdBy === t.id)
      const teacherResources = allResources.filter(r => r.teacherId === t.id)
      return teacherQuizzes.length > 0 || teacherResources.length > 0
    }).length

    setAnalytics({
      overview: {
        totalUsers: allUsers.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        activeStudents,
        activeTeachers,
        engagementRate: students.length > 0 ? Math.round((activeStudents / students.length) * 100) : 0
      },
      learning: {
        totalQuizzes: allQuizzes.length,
        quizzesTaken: allResults.length,
        avgQuizScore,
        totalResources: allResources.length,
        resourcesByType
      },
      communication: {
        totalMessages: allMessages.length,
        messagesThisWeek,
        activeConversations: new Set(allMessages.map(m => `${m.senderId}-${m.receiverId}`)).size
      },
      topPerformers: calculateTopSubjects(allResults)
    })
    } catch (error) {
      console.error('Error loading analytics:', error)
      // Set default analytics if error
      setAnalytics({
        overview: { totalUsers: 0, totalStudents: 0, totalTeachers: 0, activeStudents: 0, activeTeachers: 0, engagementRate: 0 },
        learning: { totalQuizzes: 0, quizzesTaken: 0, avgQuizScore: 0, totalResources: 0, resourcesByType: { document: 0, video: 0, audio: 0, link: 0 } },
        communication: { totalMessages: 0, messagesThisWeek: 0, activeConversations: 0 },
        topPerformers: []
      })
    }
  }

  const calculateTopSubjects = (results) => {
    if (results.length === 0) return []
    
    const subjectScores = {}
    results.forEach(r => {
      if (!subjectScores[r.subjectId]) {
        subjectScores[r.subjectId] = { total: 0, count: 0, students: new Set() }
      }
      subjectScores[r.subjectId].total += r.score
      subjectScores[r.subjectId].count++
      subjectScores[r.subjectId].students.add(r.userId)
    })

    const subjects = getAllSubjects()
    return Object.entries(subjectScores)
      .map(([subjectId, data]) => {
        const subject = subjects.find(s => s.id === parseInt(subjectId))
        return {
          subject: subject ? subject.name : `Subject ${subjectId}`,
          avgScore: Math.round(data.total / data.count),
          students: data.students.size
        }
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5)
  }

  if (!analytics) {
    return (
      <div className="analytics-page">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#667eea' }}></i>
          <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-page">
      <div className="container">
        <h1>{t('platformAnalytics')}</h1>
        <p>{t('comprehensiveMetrics')}</p>

        <div className="analytics-section">
          <h2>{t('userOverview')}</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <i className="fas fa-users"></i>
              <h3>{analytics.overview.totalUsers}</h3>
              <p>{t('totalUsers')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-user-graduate"></i>
              <h3>{analytics.overview.totalStudents}</h3>
              <p>{t('students')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-chalkboard-teacher"></i>
              <h3>{analytics.overview.totalTeachers}</h3>
              <p>{t('activeTeachers')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-chart-line"></i>
              <h3>{analytics.overview.engagementRate}%</h3>
              <p>{t('engagementRate')}</p>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h2>{t('learningMetrics')}</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <i className="fas fa-clipboard-list"></i>
              <h3>{analytics.learning.totalQuizzes}</h3>
              <p>{t('totalQuizzes')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-check-circle"></i>
              <h3>{analytics.learning.quizzesTaken}</h3>
              <p>{t('quizzesCompleted')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-star"></i>
              <h3>{analytics.learning.avgQuizScore}%</h3>
              <p>{t('avgQuizScore')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-folder"></i>
              <h3>{analytics.learning.totalResources}</h3>
              <p>{t('learningResources')}</p>
            </div>
          </div>

          <div className="resource-breakdown">
            <h3>{t('resourcesByType')}</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <i className="fas fa-file-alt"></i>
                <span>{t('documents')}: {analytics.learning.resourcesByType.document}</span>
              </div>
              <div className="breakdown-item">
                <i className="fas fa-video"></i>
                <span>{t('videos')}: {analytics.learning.resourcesByType.video}</span>
              </div>
              <div className="breakdown-item">
                <i className="fas fa-headphones"></i>
                <span>{t('audio')}: {analytics.learning.resourcesByType.audio}</span>
              </div>
              <div className="breakdown-item">
                <i className="fas fa-link"></i>
                <span>{t('links')}: {analytics.learning.resourcesByType.link}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h2>{t('communicationMetrics')}</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <i className="fas fa-comments"></i>
              <h3>{analytics.communication.totalMessages}</h3>
              <p>{t('totalMessages')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-calendar-week"></i>
              <h3>{analytics.communication.messagesThisWeek}</h3>
              <p>{t('messagesThisWeek')}</p>
            </div>
            <div className="analytics-card">
              <i className="fas fa-user-friends"></i>
              <h3>{analytics.communication.activeConversations}</h3>
              <p>{t('activeConversations')}</p>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h2>{t('topPerformingSubjects')}</h2>
          {analytics.topPerformers.length === 0 ? (
            <p>{t('noDataAvailable')}</p>
          ) : (
            <div className="performers-list">
              {analytics.topPerformers.map((subject, index) => (
                <div key={index} className="performer-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="performer-info">
                    <strong>{subject.subject}</strong>
                    <p>{subject.students} {t('students')} • {t('avg')}: {subject.avgScore}%</p>
                  </div>
                  <div className="performer-score">{subject.avgScore}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
