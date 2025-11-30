// Security and Privacy Service
export const securityService = {
  // Encrypt sensitive data (basic implementation)
  encrypt(data) {
    return btoa(JSON.stringify(data))
  },

  // Decrypt data
  decrypt(encryptedData) {
    try {
      return JSON.parse(atob(encryptedData))
    } catch {
      return null
    }
  },

  // Validate password strength
  validatePassword(password) {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    
    return {
      valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: [
        password.length < minLength && 'Password must be at least 8 characters',
        !hasUpperCase && 'Password must contain uppercase letter',
        !hasLowerCase && 'Password must contain lowercase letter',
        !hasNumbers && 'Password must contain number'
      ].filter(Boolean)
    }
  },

  // Sanitize user input
  sanitizeInput(input) {
    return input.replace(/[<>]/g, '')
  },

  // Check child protection compliance
  isChildProtected(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.id === userId)
    return user && user.role === 'student'
  },

  // Log security event
  logSecurityEvent(event) {
    const logs = this.getSecurityLogs()
    logs.push({
      ...event,
      timestamp: new Date().toISOString()
    })
    if (logs.length > 100) logs.shift()
    localStorage.setItem('security_logs', JSON.stringify(logs))
  },

  getSecurityLogs() {
    const stored = localStorage.getItem('security_logs')
    return stored ? JSON.parse(stored) : []
  },

  // Privacy settings
  updatePrivacySettings(userId, settings) {
    localStorage.setItem(`privacy_${userId}`, JSON.stringify(settings))
  },

  getPrivacySettings(userId) {
    const stored = localStorage.getItem(`privacy_${userId}`)
    return stored ? JSON.parse(stored) : {
      shareProgress: false,
      allowMessages: true,
      showProfile: false
    }
  }
}
