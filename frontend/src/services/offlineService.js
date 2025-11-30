// Offline Learning Service
const STORAGE_KEY = 'offline_content'
const SYNC_QUEUE_KEY = 'sync_queue'

export const offlineService = {
  // Download content for offline access
  downloadContent(userId, subjectId, content) {
    const data = this.getOfflineData(userId)
    if (!data[subjectId]) data[subjectId] = []
    
    const exists = data[subjectId].find(c => c.id === content.id)
    if (!exists) {
      data[subjectId].push({
        ...content,
        downloadedAt: new Date().toISOString()
      })
      this.saveOfflineData(userId, data)
    }
    return true
  },

  // Get offline content
  getOfflineContent(userId, subjectId = null) {
    const data = this.getOfflineData(userId)
    return subjectId ? (data[subjectId] || []) : data
  },

  // Remove offline content
  removeOfflineContent(userId, subjectId, contentId) {
    const data = this.getOfflineData(userId)
    if (data[subjectId]) {
      data[subjectId] = data[subjectId].filter(c => c.id !== contentId)
      this.saveOfflineData(userId, data)
    }
  },

  // Queue progress for sync
  queueSync(userId, syncData) {
    const queue = this.getSyncQueue(userId)
    queue.push({
      ...syncData,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem(`${SYNC_QUEUE_KEY}_${userId}`, JSON.stringify(queue))
  },

  // Sync queued data when online
  syncData(userId) {
    const queue = this.getSyncQueue(userId)
    if (queue.length === 0) return { synced: 0 }
    
    // Process sync queue
    queue.forEach(item => {
      if (item.type === 'progress') {
        // Sync progress data
      } else if (item.type === 'quiz') {
        // Sync quiz results
      }
    })
    
    localStorage.removeItem(`${SYNC_QUEUE_KEY}_${userId}`)
    return { synced: queue.length }
  },

  getSyncQueue(userId) {
    const stored = localStorage.getItem(`${SYNC_QUEUE_KEY}_${userId}`)
    return stored ? JSON.parse(stored) : []
  },

  getOfflineData(userId) {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    return stored ? JSON.parse(stored) : {}
  },

  saveOfflineData(userId, data) {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(data))
  },

  isOnline() {
    return navigator.onLine
  }
}
