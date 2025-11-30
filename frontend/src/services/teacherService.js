// Teacher service - manages classes, students, assignments
const CLASSES_KEY = 'ssplp_teacher_classes'
const ASSIGNMENTS_KEY = 'ssplp_teacher_assignments'
const STUDENTS_KEY = 'ssplp_teacher_students'

export const teacherService = {
  // Get teacher's classes
  getClasses: (teacherId) => {
    const stored = localStorage.getItem(`${CLASSES_KEY}_${teacherId}`)
    return stored ? JSON.parse(stored) : []
  },

  // Add new class
  addClass: (teacherId, classData) => {
    const classes = teacherService.getClasses(teacherId)
    const newClass = {
      id: Date.now(),
      students: [],
      createdAt: new Date().toISOString(),
      ...classData
    }
    classes.push(newClass)
    localStorage.setItem(`${CLASSES_KEY}_${teacherId}`, JSON.stringify(classes))
    return newClass
  },

  // Get assignments
  getAssignments: (teacherId) => {
    const stored = localStorage.getItem(`${ASSIGNMENTS_KEY}_${teacherId}`)
    return stored ? JSON.parse(stored) : []
  },

  // Add assignment
  addAssignment: (teacherId, assignment) => {
    const assignments = teacherService.getAssignments(teacherId)
    const newAssignment = {
      id: Date.now(),
      submitted: 0,
      createdAt: new Date().toISOString(),
      ...assignment
    }
    assignments.push(newAssignment)
    localStorage.setItem(`${ASSIGNMENTS_KEY}_${teacherId}`, JSON.stringify(assignments))
    return newAssignment
  },

  // Update assignment submission
  updateSubmission: (teacherId, assignmentId) => {
    const assignments = teacherService.getAssignments(teacherId)
    const assignment = assignments.find(a => a.id === assignmentId)
    if (assignment) {
      assignment.submitted = Math.min(assignment.submitted + 1, assignment.total)
      localStorage.setItem(`${ASSIGNMENTS_KEY}_${teacherId}`, JSON.stringify(assignments))
    }
    return assignment
  },

  // Get students
  getStudents: (teacherId) => {
    const stored = localStorage.getItem(`${STUDENTS_KEY}_${teacherId}`)
    return stored ? JSON.parse(stored) : []
  },

  // Add student
  addStudent: (teacherId, student) => {
    const students = teacherService.getStudents(teacherId)
    const newStudent = {
      id: Date.now(),
      enrolledAt: new Date().toISOString(),
      ...student
    }
    students.push(newStudent)
    localStorage.setItem(`${STUDENTS_KEY}_${teacherId}`, JSON.stringify(students))
    return newStudent
  },

  // Get stats
  getStats: (teacherId) => {
    const classes = teacherService.getClasses(teacherId)
    const students = teacherService.getStudents(teacherId)
    
    // Get all registered students (excluding demo accounts)
    const allUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    const demoEmails = ['student@ssplp.org', 'jane@ssplp.org', 'mike@ssplp.org']
    const allStudents = allUsers.filter(u => u.role === 'student' && !demoEmails.includes(u.email))
    
    // Get tutoring sessions for this week
    const sessions = JSON.parse(localStorage.getItem('tutoring_sessions') || '[]')
    const teacherSessions = sessions.filter(s => s.teacherId == teacherId)
    
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    
    const sessionsThisWeek = teacherSessions.filter(s => {
      const sessionDate = new Date(s.date)
      return sessionDate >= weekStart && sessionDate < weekEnd
    }).length
    
    return {
      totalStudents: allStudents.length,
      activeClasses: classes.length,
      sessionsThisWeek,
      averageRating: 4.8
    }
  }
}
