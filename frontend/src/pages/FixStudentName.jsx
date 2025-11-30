import React from 'react'
import { useNavigate } from 'react-router-dom'

const FixStudentName = () => {
  const navigate = useNavigate()

  const handleFix = () => {
    // Get registered users
    const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    
    // Find or create student@ssplp.org account
    const studentIndex = users.findIndex(u => u.email === 'student@ssplp.org')
    
    if (studentIndex !== -1) {
      // Update existing
      users[studentIndex].name = 'Jongkuch'
      users[studentIndex].password = 'student123'
    } else {
      // Add new
      users.push({
        id: 'student-1',
        email: 'student@ssplp.org',
        password: 'student123',
        name: 'Jongkuch',
        role: 'student',
        grade: 'Grade 10'
      })
    }
    
    localStorage.setItem('ssplp_registered_users', JSON.stringify(users))
    
    // Update current session if logged in as this user
    const currentUser = JSON.parse(localStorage.getItem('ssplp_user') || '{}')
    if (currentUser.email === 'student@ssplp.org') {
      currentUser.name = 'Jongkuch'
      localStorage.setItem('ssplp_user', JSON.stringify(currentUser))
    }
    
    alert('Student name fixed! Please logout and login again.')
    navigate('/dashboard')
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Fix Student Name</h1>
      <p>This will update student@ssplp.org name to "Jongkuch"</p>
      <button 
        onClick={handleFix}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Fix Name
      </button>
    </div>
  )
}

export default FixStudentName
