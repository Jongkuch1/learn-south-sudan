// Notification Service
const STORAGE_KEY = 'notifications'

export const notificationService = {
  // Create notification
  createNotification(userId, notification) {
    const notifications = this.getUserNotifications(userId)
    const newNotification = {
      id: `notif_${Date.now()}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    }
    notifications.unshift(newNotification)
    this.saveNotifications(userId, notifications)
    
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png'
      })
    }
    
    return newNotification
  },

  // Get user notifications
  getUserNotifications(userId) {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    return stored ? JSON.parse(stored) : []
  },

  // Mark as read
  markAsRead(userId, notificationId) {
    const notifications = this.getUserNotifications(userId)
    const notif = notifications.find(n => n.id === notificationId)
    if (notif) {
      notif.read = true
      this.saveNotifications(userId, notifications)
    }
  },

  // Mark all as read
  markAllAsRead(userId) {
    const notifications = this.getUserNotifications(userId)
    notifications.forEach(n => n.read = true)
    this.saveNotifications(userId, notifications)
  },

  // Get unread count
  getUnreadCount(userId) {
    const notifications = this.getUserNotifications(userId)
    return notifications.filter(n => !n.read).length
  },

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  },

  // Send reminder for upcoming session
  sendSessionReminder(userId, session) {
    this.createNotification(userId, {
      type: 'reminder',
      title: 'Upcoming Tutoring Session',
      message: `Your session "${session.title}" starts in 30 minutes`,
      link: '/tutoring'
    })
  },

  // Send new lesson notification
  sendNewLessonNotification(userId, lesson) {
    this.createNotification(userId, {
      type: 'lesson',
      title: 'New Lesson Available',
      message: `Check out the new lesson: ${lesson.title}`,
      link: `/learning/${lesson.subjectId}`
    })
  },

  saveNotifications(userId, notifications) {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(notifications))
  }
}
