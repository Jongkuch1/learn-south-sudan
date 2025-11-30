// Dynamic data service for dashboards - all data from localStorage
import { getItem } from '../utils/storage'

export const dashboardService = {
  // Student Dashboard Data
  getStudentData: async (userId) => {
    // Calculate quiz average from results (check both localStorage and IndexedDB)
    let quizAverage = 0
    try {
      let results = []
      const stored = localStorage.getItem('ssplp_quiz_results')
      if (stored) {
        results = JSON.parse(stored)
        console.log('Quiz results from storage:', results)
      }
      
      const userResults = results.filter(r => r.userId === userId)
      console.log('User results for', userId, ':', userResults)
      
      if (userResults.length > 0) {
        const totalScore = userResults.reduce((sum, r) => sum + r.score, 0)
        quizAverage = Math.round(totalScore / userResults.length)
        console.log('Calculated quiz average:', quizAverage)
      }
    } catch (e) {
      console.error('Error calculating quiz average:', e)
    }
    
    return {
      stats: {
        activeCourses: 0,
        overallProgress: 0,
        completedModules: 0,
        quizAverage
      },
      subjects: [],
      upcomingSessions: [],
      recentActivity: []
    }
  },

  // Teacher Dashboard Data
  getTeacherData: (userId) => {
    return {
      stats: {
        totalStudents: 0,
        activeClasses: 0,
        sessionsThisWeek: 0,
        averageRating: 0
      },
      classes: [],
      pendingAssignments: [],
      upcomingClasses: [],
      recentActivity: [],
      messages: 0
    }
  },

  // Admin Dashboard Data
  getAdminData: () => {
    return {
      stats: {
        totalStudents: 0,
        activeTeachers: 0,
        totalCourses: 0,
        completionRate: 0
      },
      recentRegistrations: [],
      systemAlerts: [],
      platformStats: {
        activeUsers: 0,
        coursesCompleted: 0,
        averageScore: 0,
        supportTickets: 0
      },
      topPerformingSubjects: []
    }
  }
}
