// API Service - Connects frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Get auth token from localStorage
  getToken() {
    const user = JSON.parse(localStorage.getItem('ssplp_user') || '{}')
    return user.token
  }

  // Make API request
  async request(endpoint, options = {}) {
    const token = this.getToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'API request failed')
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  // Content endpoints
  async getVideos(subject, grade) {
    return this.request(`/content/videos/${subject}/${grade}`)
  }

  async getResources(subject, grade) {
    return this.request(`/content/resources/${subject}/${grade}`)
  }

  async getContentStats() {
    return this.request('/content/stats')
  }

  // Message endpoints
  async getConversations(userId) {
    return this.request(`/messages/conversations/${userId}`)
  }

  async sendMessage(messageData) {
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify(messageData)
    })
  }

  async getMessages(userId, otherUserId) {
    return this.request(`/messages/${userId}/${otherUserId}`)
  }

  // Verification endpoints
  async sendVerificationCode(data) {
    return this.request('/verification/send-code', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async verifyCode(data) {
    return this.request('/verification/verify-code', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Quiz endpoints
  async getQuizzes(subject, grade) {
    return this.request(`/quizzes/${subject}/${grade}`)
  }

  async submitQuiz(quizData) {
    return this.request('/quizzes/submit', {
      method: 'POST',
      body: JSON.stringify(quizData)
    })
  }

  // Analytics endpoints
  async getPlatformAnalytics() {
    return this.request('/analytics/platform')
  }

  async getUserAnalytics(userId) {
    return this.request(`/analytics/user/${userId}`)
  }

  // Module endpoints
  async getModules(subject, grade) {
    return this.request(`/modules/${subject}/${grade}`)
  }

  async getModuleProgress(userId, moduleId) {
    return this.request(`/modules/progress/${userId}/${moduleId}`)
  }

  async updateModuleProgress(progressData) {
    return this.request('/modules/progress', {
      method: 'POST',
      body: JSON.stringify(progressData)
    })
  }

  // Admin endpoints
  async getPendingUsers() {
    return this.request('/admin/pending-users')
  }

  async getAllUsers() {
    return this.request('/admin/users')
  }

  async approveUser(userId) {
    return this.request(`/admin/approve-user/${userId}`, {
      method: 'PUT'
    })
  }

  async rejectUser(userId) {
    return this.request(`/admin/reject-user/${userId}`, {
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService()
