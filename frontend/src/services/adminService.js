// Admin service - manages platform-wide data
const USERS_KEY = 'ssplp_all_users'
const ALERTS_KEY = 'ssplp_system_alerts'

export const adminService = {
  // Get all registered users
  getAllUsers: () => {
    const stored = localStorage.getItem(USERS_KEY)
    const registeredUsers = localStorage.getItem('ssplp_registered_users')
    const allUsers = stored ? JSON.parse(stored) : []
    const registered = registeredUsers ? JSON.parse(registeredUsers) : []
    
    // Merge all users without duplicates
    const combined = [...allUsers, ...registered]
    const uniqueUsers = combined.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    )
    
    return uniqueUsers
  },

  // Get users by role
  getUsersByRole: (role) => {
    const users = adminService.getAllUsers()
    return users.filter(u => u.role === role)
  },

  // Get platform stats
  getPlatformStats: () => {
    const users = adminService.getAllUsers()
    const demoEmails = ['student@ssplp.org', 'jane@ssplp.org', 'mike@ssplp.org']
    const students = users.filter(u => u.role === 'student' && !demoEmails.includes(u.email))
    const teachers = users.filter(u => u.role === 'teacher')
    
    // Remove duplicates based on email
    const uniqueStudents = students.reduce((acc, current) => {
      const exists = acc.find(item => item.email === current.email)
      if (!exists) acc.push(current)
      return acc
    }, [])
    
    // Remove duplicates more aggressively - use Map for better deduplication
    const teacherMap = new Map()
    teachers.forEach(teacher => {
      if (teacher.email) {
        teacherMap.set(teacher.email, teacher)
      }
    })
    const uniqueTeachers = Array.from(teacherMap.values())
    
    // Calculate active users (users with any progress)
    let activeUsersToday = 0
    let totalProgress = 0
    let coursesCompleted = 0
    
    uniqueStudents.forEach(student => {
      const progressKey = `ssplp_student_progress_${student.id}`
      const progress = localStorage.getItem(progressKey)
      if (progress) {
        const progressData = JSON.parse(progress)
        const values = Object.values(progressData)
        const hasActivity = values.some(v => v > 0)
        if (hasActivity) activeUsersToday++
        
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length
        totalProgress += avg
        coursesCompleted += values.filter(v => v === 100).length
      }
    })
    
    const avgScore = uniqueStudents.length > 0 ? Math.round(totalProgress / uniqueStudents.length) : 0
    
    return {
      totalStudents: uniqueStudents.length,
      activeTeachers: uniqueTeachers.length,
      totalCourses: 15, // Fixed: 15 subjects in curriculum
      completionRate: avgScore,
      activeUsers: activeUsersToday,
      coursesCompleted,
      averageScore: avgScore,
      supportTickets: 0
    }
  },

  // Get recent registrations
  getRecentRegistrations: (limit = 10) => {
    const users = adminService.getAllUsers()
    return users
      .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
      .slice(0, limit)
      .map(user => ({
        id: user.id,
        name: user.name,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        time: user.registeredAt,
        status: user.status || 'Active'
      }))
  },

  // Get top performing subjects
  getTopPerformingSubjects: () => {
    const users = adminService.getUsersByRole('student')
    const subjectStats = {}
    
    // Initialize subjects
    const subjects = ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 
                     'Agriculture', 'Additional Mathematics', 'ICT', 'History', 
                     'Geography', 'Commerce', 'Accounting', 'Literature', 'Religion', 'Citizenship']
    
    subjects.forEach((subject, index) => {
      subjectStats[index + 1] = { name: subject, totalScore: 0, count: 0 }
    })
    
    // Calculate stats
    users.forEach(student => {
      const progressKey = `ssplp_student_progress_${student.id}`
      const progress = localStorage.getItem(progressKey)
      if (progress) {
        const progressData = JSON.parse(progress)
        Object.entries(progressData).forEach(([subjectId, score]) => {
          if (score > 0 && subjectStats[subjectId]) {
            subjectStats[subjectId].totalScore += score
            subjectStats[subjectId].count++
          }
        })
      }
    })
    
    // Calculate averages and sort
    return Object.values(subjectStats)
      .filter(s => s.count > 0)
      .map(s => ({
        subject: s.name,
        students: s.count,
        avgScore: Math.round(s.totalScore / s.count)
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5)
  },

  // Get system alerts
  getSystemAlerts: () => {
    const stored = localStorage.getItem(ALERTS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  // Add system alert
  addAlert: (alert) => {
    const alerts = adminService.getSystemAlerts()
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...alert
    }
    alerts.unshift(newAlert)
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(0, 20)))
    return newAlert
  },

  // Register user (called during registration)
  registerUser: (userData) => {
    const users = adminService.getAllUsers()
    const newUser = {
      id: Date.now(),
      registeredAt: new Date().toISOString(),
      status: 'Active',
      ...userData
    }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return newUser
  }
}
