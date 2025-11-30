// Adaptive Learning Engine Service
const STORAGE_KEY = 'adaptive_learning_data'

export const adaptiveLearningService = {
  // Analyze student performance and adjust difficulty
  analyzePerformance(userId, subjectId) {
    const data = this.getData(userId)
    const subjectData = data[subjectId] || { level: 'intermediate', scores: [] }
    
    if (subjectData.scores.length === 0) return 'intermediate'
    
    const avgScore = subjectData.scores.reduce((a, b) => a + b, 0) / subjectData.scores.length
    
    if (avgScore >= 85) return 'advanced'
    if (avgScore >= 60) return 'intermediate'
    return 'beginner'
  },

  // Record quiz/assessment score
  recordScore(userId, subjectId, score) {
    const data = this.getData(userId)
    if (!data[subjectId]) {
      data[subjectId] = { level: 'intermediate', scores: [] }
    }
    data[subjectId].scores.push(score)
    if (data[subjectId].scores.length > 10) {
      data[subjectId].scores.shift()
    }
    data[subjectId].level = this.analyzePerformance(userId, subjectId)
    this.saveData(userId, data)
  },

  // Get recommended content based on performance
  getRecommendedContent(userId, subjectId) {
    const level = this.analyzePerformance(userId, subjectId)
    return {
      level,
      topics: this.getTopicsForLevel(level),
      difficulty: level === 'advanced' ? 'hard' : level === 'intermediate' ? 'medium' : 'easy'
    }
  },

  getTopicsForLevel(level) {
    const topics = {
      beginner: ['Introduction', 'Fundamentals', 'Basic Concepts'],
      intermediate: ['Intermediate Topics', 'Problem Solving', 'Case Studies'],
      advanced: ['Advanced Topics', 'Real World Applications', 'Practice Sessions']
    }
    return topics[level] || topics.intermediate
  },

  getData(userId) {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    return stored ? JSON.parse(stored) : {}
  },

  saveData(userId, data) {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(data))
  }
}
