import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ssplp_token')
    const savedUser = localStorage.getItem('ssplp_user')
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('ssplp_token')
        localStorage.removeItem('ssplp_user')
      }
    }
    setLoading(false)
  }, [])

  // Listen for storage changes to update user data across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('ssplp_user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = async (email, password) => {
    // Check registered users first (includes updated demo accounts)
    const registeredUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    let foundUser = registeredUsers.find(u => u.email === email && u.password === password)
    
    // Demo account fallbacks with default credentials
    if (!foundUser && email === 'admin@ssplp.org' && password === 'admin123') {
      foundUser = { id: 'admin-1', name: 'Admin User', email: 'admin@ssplp.org', password: 'admin123', role: 'admin' }
    }
    if (!foundUser && email === 'teacher@ssplp.org' && password === 'teacher123') {
      foundUser = { id: 'teacher-1', name: 'Sarah Michael', email: 'teacher@ssplp.org', password: 'teacher123', role: 'teacher', subjects: [1, 2] }
    }
    if (!foundUser && email === 'student@ssplp.org' && password === 'student123') {
      foundUser = { id: 'student-1', name: 'John Doe', email: 'student@ssplp.org', password: 'student123', role: 'student', grade: 'Grade 10' }
    }
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        grade: foundUser.grade,
        subjects: foundUser.subjects || [],
        avatar: foundUser.avatar,
        phone: foundUser.phone,
        school: foundUser.school
      }
      setUser(userData)
      localStorage.setItem('ssplp_token', 'mock-token')
      localStorage.setItem('ssplp_user', JSON.stringify(userData))
      return { success: true, user: userData }
    }

    return { success: false, error: 'Invalid email or password' }
  }

  const register = async (userData) => {
    const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' }
    }
    
    users.push({
      id: Date.now(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role,
      grade: userData.role === 'student' ? 'Grade 9' : null,
      subjects: [],
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('ssplp_registered_users', JSON.stringify(users))
    
    return { success: true, message: 'Registration successful! Please login.' }
  }

  const logout = () => {
    localStorage.removeItem('ssplp_token')
    localStorage.removeItem('ssplp_user')
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    // Force a complete state update with new object reference
    const newUser = JSON.parse(JSON.stringify(updatedUser))
    setUser(newUser)
    localStorage.setItem('ssplp_user', JSON.stringify(newUser))
  }

  const value = { user, login, register, logout, updateUser, loading }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#87CEEB' }}></i>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
