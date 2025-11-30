const SESSIONS_KEY = 'tutoring_sessions'
const REQUESTS_KEY = 'tutoring_requests'

export const tutoringService = {
  // Create tutoring session (Teacher/Admin)
  createSession(session) {
    const sessions = this.getAllSessions()
    const newSession = {
      id: Date.now().toString(),
      ...session,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }
    sessions.push(newSession)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
    return newSession
  },

  // Get all sessions
  getAllSessions() {
    const stored = localStorage.getItem(SESSIONS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  // Get sessions by teacher
  getSessionsByTeacher(teacherId) {
    return this.getAllSessions().filter(s => s.teacherId === teacherId)
  },

  // Get sessions by student
  getSessionsByStudent(studentId) {
    const allSessions = this.getAllSessions()
    return allSessions.filter(s => 
      String(s.studentId) === String(studentId) || s.studentId === studentId
    )
  },

  // Update session
  updateSession(sessionId, updates) {
    const sessions = this.getAllSessions()
    const index = sessions.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates }
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
      return sessions[index]
    }
    return null
  },

  // Cancel session
  cancelSession(sessionId) {
    return this.updateSession(sessionId, { status: 'cancelled' })
  },

  // Complete session
  completeSession(sessionId) {
    return this.updateSession(sessionId, { status: 'completed' })
  },

  // Delete session
  deleteSession(sessionId) {
    const sessions = this.getAllSessions().filter(s => s.id !== sessionId)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  },

  // Request tutoring (Student)
  createRequest(request) {
    const requests = this.getAllRequests()
    const newRequest = {
      id: Date.now().toString(),
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    requests.push(newRequest)
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
    return newRequest
  },

  // Get all requests
  getAllRequests() {
    const stored = localStorage.getItem(REQUESTS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  // Get pending requests
  getPendingRequests() {
    return this.getAllRequests().filter(r => r.status === 'pending')
  },

  // Approve request and create session
  approveRequest(requestId, teacherId, sessionDetails) {
    const requests = this.getAllRequests()
    const request = requests.find(r => r.id === requestId)
    if (request) {
      request.status = 'approved'
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
      
      return this.createSession({
        ...sessionDetails,
        studentId: request.studentId,
        teacherId,
        subject: request.subject,
        topic: request.topic
      })
    }
    return null
  },

  // Reject request
  rejectRequest(requestId) {
    const requests = this.getAllRequests()
    const index = requests.findIndex(r => r.id === requestId)
    if (index !== -1) {
      requests[index].status = 'rejected'
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
      return requests[index]
    }
    return null
  }
}
