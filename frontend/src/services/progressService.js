// Progress tracking service - stores actual student progress
const STORAGE_KEY = 'ssplp_student_progress'

export const progressService = {
  // Get student progress for all subjects
  getProgress: (userId) => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with 0% for all subjects
    return {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 
      9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
    }
  },

  // Update progress for a specific subject
  updateProgress: (userId, subjectId, progress) => {
    const allProgress = progressService.getProgress(userId)
    allProgress[subjectId] = Math.min(100, Math.max(0, progress))
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(allProgress))
    return allProgress
  },

  // Calculate overall progress
  getOverallProgress: (userId) => {
    const progress = progressService.getProgress(userId)
    const values = Object.values(progress)
    const total = values.reduce((sum, val) => sum + val, 0)
    return Math.round(total / values.length)
  },

  // Get enrolled subjects (subjects with progress > 0)
  getEnrolledSubjects: (userId) => {
    const progress = progressService.getProgress(userId)
    return Object.entries(progress)
      .filter(([_, value]) => value > 0)
      .map(([id, _]) => parseInt(id))
  },

  // Get completed modules count
  getCompletedModules: (userId) => {
    const progress = progressService.getProgress(userId)
    return Object.values(progress).filter(p => p === 100).length
  }
}
