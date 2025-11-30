import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { activityService } from '../../services/activityService'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminDashboard = ({ user }) => {
  const { t } = useLanguage()
  const [data, setData] = useState(null)

  useEffect(() => {
    const stats = adminService.getPlatformStats()
    const recentRegs = adminService.getRecentRegistrations(4)
    const topSubjects = adminService.getTopPerformingSubjects()
    const alerts = adminService.getSystemAlerts()
    
    setData({
      stats,
      platformStats: {
        activeUsers: stats.activeUsers,
        coursesCompleted: stats.coursesCompleted,
        averageScore: stats.averageScore,
        supportTickets: stats.supportTickets
      },
      recentRegistrations: recentRegs,
      topPerformingSubjects: topSubjects,
      systemAlerts: alerts
    })
  }, [])

  const handleAddAlert = () => {
    const type = prompt('Alert type (info/warning/success):')
    const title = prompt('Alert title:')
    const description = prompt('Alert description:')
    
    if (type && title && description) {
      adminService.addAlert({ type, title, description, time: 'Just now' })
      
      // Send notification to all users
      const allUsers = adminService.getAllUsers()
      const notificationService = require('../../services/notificationService').notificationService
      allUsers.forEach(u => {
        if (u.id !== user.id) {
          notificationService.createNotification(u.id, {
            type: 'alert',
            title: title,
            message: description
          })
        }
      })
      
      window.location.reload()
    }
  }

  if (!data) return <div>{t('loading')}</div>

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>{t('adminDashboard')}</h1>
        <p>{t('welcomeBackUser')}, {user.name} - {t('systemOverview')}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-box">
          <i className="fas fa-users"></i>
          <div>
            <h3>{data.stats.totalStudents.toLocaleString()}</h3>
            <p>{t('totalStudents')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-chalkboard-teacher"></i>
          <div>
            <h3>{data.stats.activeTeachers}</h3>
            <p>{t('activeTeachers')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-book"></i>
          <div>
            <h3>{data.stats.totalCourses}</h3>
            <p>{t('totalCourses')}</p>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-graduation-cap"></i>
          <div>
            <h3>{data.stats.completionRate}%</h3>
            <p>{t('completionRate')}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-users-cog"></i></div>
          <h3>{t('userManagement')}</h3>
          <p>{t('manageStudentsTeachersAdmins')}</p>
          <Link to="/users" className="btn btn-primary">{t('manageUsers')}</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-book-reader"></i></div>
          <h3>{t('contentManagement')}</h3>
          <p>{t('approveManageMaterials')}</p>
          <Link to="/admin/resources" className="btn btn-primary">{t('manageContent')}</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-cog"></i></div>
          <h3>Platform Settings</h3>
          <p>Performance and accessibility controls</p>
          <Link to="/settings" className="btn btn-primary">Settings</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <h3>{t('systemAlerts')}</h3>
          <p>{data.systemAlerts.length} {t('activeAlerts')}</p>
          <button className="btn btn-primary" onClick={handleAddAlert}>{t('addAlert')}</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-chalkboard-teacher"></i></div>
          <h3>{t('virtualTutoring') || 'Virtual Tutoring'}</h3>
          <p>{t('manageTutoringSessions') || 'Manage all tutoring sessions'}</p>
          <Link to="/tutoring" className="btn btn-primary">{t('viewSessions') || 'View Sessions'}</Link>
        </div>
      </div>

      <div className="platform-stats-section">
        <h2>{t('platformStatistics')}</h2>
        <div className="stats-grid">
          <div className="mini-stat">
            <i className="fas fa-user-clock"></i>
            <div>
              <h4>{data.platformStats.activeUsers.toLocaleString()}</h4>
              <p>{t('activeUsersToday')}</p>
            </div>
          </div>
          <div className="mini-stat">
            <i className="fas fa-check-double"></i>
            <div>
              <h4>{data.platformStats.coursesCompleted.toLocaleString()}</h4>
              <p>{t('coursesCompleted')}</p>
            </div>
          </div>
          <div className="mini-stat">
            <i className="fas fa-chart-line"></i>
            <div>
              <h4>{data.platformStats.averageScore}%</h4>
              <p>{t('platformAvgScore')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <h2>{t('recentRegistrations')}</h2>
          {data.recentRegistrations.length === 0 ? (
            <div className="no-data">
              <p>{t('noUserRegistrations')}</p>
            </div>
          ) : (
            <div className="data-table">
              {data.recentRegistrations.map(reg => (
                <div key={reg.id} className="table-row">
                  <span>{reg.name}</span>
                  <span>{reg.role}</span>
                  <span>{activityService.getTimeAgo(reg.time)}</span>
                  <span className={`status ${reg.status.toLowerCase()}`}>{reg.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-section">
          <h2>{t('topPerformingSubjects')}</h2>
          {data.topPerformingSubjects.length === 0 ? (
            <div className="no-data">
              <p>{t('noSubjectData')}</p>
            </div>
          ) : (
            <div className="subject-stats">
              {data.topPerformingSubjects.map((subject, index) => (
                <div key={index} className="subject-stat-item">
                  <strong>{subject.subject}</strong>
                  <div className="subject-details">
                    <span>{subject.students} {t('students')}</span>
                    <span className="avg-score">{t('avg')}: {subject.avgScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-section">
        <h2>{t('systemAlerts')}</h2>
        {data.systemAlerts.length === 0 ? (
          <div className="no-data">
            <p>{t('noSystemAlerts')}</p>
          </div>
        ) : (
          <div className="activity-list">
            {data.systemAlerts.map(alert => (
              <div key={alert.id} className={`activity-item ${alert.type}`}>
                <i className={`fas fa-${alert.type === 'info' ? 'info-circle' : alert.type === 'warning' ? 'exclamation-triangle' : 'check-circle'}`}></i>
                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.description} - {activityService.getTimeAgo(alert.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
