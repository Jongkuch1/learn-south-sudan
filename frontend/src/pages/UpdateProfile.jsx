import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const UpdateProfile = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const handleUpdateName = () => {
    const newName = prompt('Enter new name:', user.name)
    if (newName && newName.trim()) {
      const updatedUser = { ...user, name: newName.trim() }
      
      // Update ssplp_registered_users
      const registeredUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
      const userIndex = registeredUsers.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        registeredUsers[userIndex].name = newName.trim()
        localStorage.setItem('ssplp_registered_users', JSON.stringify(registeredUsers))
      }
      
      // Update ssplp_user and context
      localStorage.setItem('ssplp_user', JSON.stringify(updatedUser))
      updateUser(updatedUser)
      
      alert('Name updated successfully!')
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Quick Profile Update</h1>
      <p>Current Name: <strong>{user?.name}</strong></p>
      <button 
        onClick={handleUpdateName}
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
        Update Name
      </button>
    </div>
  )
}

export default UpdateProfile
