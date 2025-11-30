import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { notificationService } from '../services/notificationService'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (user) {
      loadNotifications()
      notificationService.requestPermission()
    }
  }, [user])

  const loadNotifications = () => {
    const notifs = notificationService.getUserNotifications(user.id)
    setNotifications(notifs)
  }

  const handleMarkAsRead = (notifId) => {
    notificationService.markAsRead(user.id, notifId)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead(user.id)
    loadNotifications()
  }

  const handleNotificationClick = (notif) => {
    handleMarkAsRead(notif.id)
    if (notif.link) navigate(notif.link)
  }

  const getIcon = (type) => {
    const icons = {
      reminder: 'fa-bell',
      lesson: 'fa-book',
      message: 'fa-envelope',
      quiz: 'fa-clipboard-check',
      session: 'fa-video'
    }
    return icons[type] || 'fa-info-circle'
  }

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <h1>{t('notifications')}</h1>
          {notifications.some(n => !n.read) && (
            <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
              {t('markAllRead')}
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <i className="fas fa-bell-slash"></i>
            <p>{t('noNotifications')}</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="notif-icon">
                  <i className={`fas ${getIcon(notif.type)}`}></i>
                </div>
                <div className="notif-content">
                  <h3>{notif.title}</h3>
                  <p>{notif.message}</p>
                  <span className="notif-time">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notif.read && <div className="unread-badge"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
