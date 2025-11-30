// Activity tracking service - stores actual student activities
import { setItem, getItem } from '../utils/storage'

const STORAGE_KEY = 'ssplp_student_activity'

export const activityService = {
  // Get all activities for a user
  getActivities: (userId) => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      return []
    }
  },

  // Add new activity
  addActivity: async (userId, activity) => {
    try {
      const activities = activityService.getActivities(userId)
      const newActivity = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...activity
      }
      activities.unshift(newActivity) // Add to beginning
      
      // Keep only last 10 activities to save space
      const trimmed = activities.slice(0, 10)
      
      // Use resilient storage
      await setItem(`${STORAGE_KEY}_${userId}`, trimmed)
      return newActivity
    } catch (e) {
      console.warn('Could not save activity:', e)
      return activity
    }
  },

  // Get recent activities (last N)
  getRecentActivities: (userId, count = 10) => {
    const activities = activityService.getActivities(userId)
    return activities.slice(0, count)
  },

  // Format time ago
  getTimeAgo: (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
}
