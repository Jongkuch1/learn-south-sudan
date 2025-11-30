// Performance Report Service
import { progressService } from './progressService'
import { quizService } from './quizService'
import { activityService } from './activityService'

export const reportService = {
  // Generate monthly report
  generateMonthlyReport(userId) {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Get quiz results and calculate progress from actual data
    const quizResults = quizService.getUserResults(userId)
    console.log('Monthly Report - User ID:', userId)
    console.log('Monthly Report - Quiz Results:', quizResults)
    const monthQuizzes = quizResults.filter(r => new Date(r.completedAt) >= monthStart)
    
    // Calculate subject progress from quiz scores
    const subjectScores = {}
    quizResults.forEach(result => {
      if (!subjectScores[result.subjectId]) {
        subjectScores[result.subjectId] = []
      }
      subjectScores[result.subjectId].push(result.score)
    })
    
    const subjectsProgress = {}
    Object.keys(subjectScores).forEach(subjectId => {
      const scores = subjectScores[subjectId]
      subjectsProgress[subjectId] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    })
    
    // Calculate overall progress
    const allScores = Object.values(subjectsProgress)
    const overallProgress = allScores.length > 0 
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0
    
    return {
      period: 'monthly',
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      overallProgress,
      subjectsProgress,
      quizzesCompleted: monthQuizzes.length,
      averageScore: monthQuizzes.length > 0 
        ? Math.round(monthQuizzes.reduce((sum, q) => sum + q.score, 0) / monthQuizzes.length)
        : 0,
      topSubjects: this.getTopSubjects(subjectsProgress),
      needsImprovement: this.getNeedsImprovement(subjectsProgress),
      generatedAt: new Date().toISOString()
    }
  },

  // Generate termly report
  generateTermlyReport(userId) {
    const quizResults = quizService.getUserResults(userId)
    console.log('Termly Report - User ID:', userId)
    console.log('Termly Report - Quiz Results:', quizResults)
    
    // Calculate subject progress from quiz scores
    const subjectScores = {}
    quizResults.forEach(result => {
      if (!subjectScores[result.subjectId]) {
        subjectScores[result.subjectId] = []
      }
      subjectScores[result.subjectId].push(result.score)
    })
    
    const subjectsProgress = {}
    Object.keys(subjectScores).forEach(subjectId => {
      const scores = subjectScores[subjectId]
      subjectsProgress[subjectId] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    })
    
    // Calculate overall progress
    const allScores = Object.values(subjectsProgress)
    const overallProgress = allScores.length > 0 
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0
    
    const completedSubjects = Object.values(subjectsProgress).filter(p => p >= 80).length
    
    return {
      period: 'termly',
      term: this.getCurrentTerm(),
      overallProgress,
      subjectsProgress,
      quizzesCompleted: quizResults.length,
      averageScore: quizResults.length > 0
        ? Math.round(quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length)
        : 0,
      completedSubjects,
      topSubjects: this.getTopSubjects(subjectsProgress),
      needsImprovement: this.getNeedsImprovement(subjectsProgress),
      recommendations: this.generateRecommendations(subjectsProgress, quizResults),
      generatedAt: new Date().toISOString()
    }
  },

  getTopSubjects(progress) {
    return Object.entries(progress)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subjectId, score]) => ({ subjectId, score }))
  },

  getNeedsImprovement(progress) {
    return Object.entries(progress)
      .filter(([_, score]) => score < 50)
      .map(([subjectId, score]) => ({ subjectId, score }))
  },

  generateRecommendations(progress, quizResults) {
    const recommendations = []
    const avgScore = quizResults.length > 0
      ? quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length
      : 0
    
    if (avgScore < 60) {
      recommendations.push('Consider scheduling tutoring sessions for additional support')
    }
    if (Object.keys(progress).length < 3) {
      recommendations.push('Explore more subjects to broaden your knowledge')
    }
    return recommendations
  },

  getCurrentTerm() {
    const month = new Date().getMonth()
    if (month >= 0 && month <= 3) return 'Term 1'
    if (month >= 4 && month <= 7) return 'Term 2'
    return 'Term 3'
  },

  // Generate teacher monthly report
  generateTeacherMonthlyReport(teacherId) {
    const now = new Date()
    const classes = JSON.parse(localStorage.getItem(`ssplp_teacher_classes_${teacherId}`) || '[]')
    const assignments = JSON.parse(localStorage.getItem(`ssplp_teacher_assignments_${teacherId}`) || '[]')
    const resources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]').filter(r => r.teacherId === teacherId)
    const submissions = JSON.parse(localStorage.getItem('ssplp_assignment_submissions') || '[]')
    
    return {
      period: 'monthly',
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      overallProgress: classes.length > 0 ? 100 : 0,
      subjectsProgress: {},
      quizzesCompleted: assignments.length,
      averageScore: submissions.length > 0 ? Math.round((submissions.length / assignments.reduce((sum, a) => sum + a.total, 1)) * 100) : 0,
      topSubjects: [],
      needsImprovement: [],
      totalClasses: classes.length,
      totalAssignments: assignments.length,
      totalResources: resources.length,
      totalSubmissions: submissions.length,
      generatedAt: new Date().toISOString()
    }
  },

  // Generate teacher termly report
  generateTeacherTermlyReport(teacherId) {
    const classes = JSON.parse(localStorage.getItem(`ssplp_teacher_classes_${teacherId}`) || '[]')
    const assignments = JSON.parse(localStorage.getItem(`ssplp_teacher_assignments_${teacherId}`) || '[]')
    const resources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]').filter(r => r.teacherId === teacherId)
    const submissions = JSON.parse(localStorage.getItem('ssplp_assignment_submissions') || '[]')
    
    return {
      period: 'termly',
      term: this.getCurrentTerm(),
      overallProgress: classes.length > 0 ? 100 : 0,
      subjectsProgress: {},
      quizzesCompleted: assignments.length,
      averageScore: submissions.length > 0 ? Math.round((submissions.length / assignments.reduce((sum, a) => sum + a.total, 1)) * 100) : 0,
      completedSubjects: classes.length,
      topSubjects: [],
      needsImprovement: [],
      recommendations: [],
      totalClasses: classes.length,
      totalAssignments: assignments.length,
      totalResources: resources.length,
      totalSubmissions: submissions.length,
      generatedAt: new Date().toISOString()
    }
  }
}
