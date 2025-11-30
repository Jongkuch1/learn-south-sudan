import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getAllSubjects } from '../../data/subjects'

const UserManagement = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    grade: 'Grade 9',
    subjects: []
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const demoEmails = ['student@ssplp.org', 'jane@ssplp.org', 'mike@ssplp.org']
    const allUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    
    // Remove duplicates based on email
    const uniqueUsers = allUsers.reduce((acc, current) => {
      const exists = acc.find(item => item.email === current.email)
      if (!exists && !demoEmails.includes(current.email)) {
        acc.push(current)
      }
      return acc
    }, [])
    
    setUsers(uniqueUsers)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    
    if (editingUser) {
      const index = allUsers.findIndex(u => u.id === editingUser.id)
      if (index !== -1) {
        allUsers[index] = { ...allUsers[index], ...formData }
        localStorage.setItem('ssplp_registered_users', JSON.stringify(allUsers))
        alert('User updated successfully!')
      }
    } else {
      if (allUsers.find(u => u.email === formData.email)) {
        alert('Email already exists!')
        return
      }
      allUsers.push({
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('ssplp_registered_users', JSON.stringify(allUsers))
      alert('User added successfully!')
    }
    
    setShowAddUser(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'student', grade: 'Grade 9', subjects: [] })
    loadUsers()
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      grade: user.grade || 'Grade 9',
      subjects: user.subjects || []
    })
    setShowAddUser(true)
  }

  const handleDelete = (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    const allUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    const filtered = allUsers.filter(u => u.id !== userId)
    localStorage.setItem('ssplp_registered_users', JSON.stringify(filtered))
    loadUsers()
  }

  const toggleSubject = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...prev.subjects, subjectId]
    }))
  }

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter)

  if (user?.role !== 'admin') {
    return <div className="container"><p>Access denied</p></div>
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>User Management</h1>
          <p>Manage students, teachers, and admins</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowAddUser(true); setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'student', grade: 'Grade 9', subjects: [] }) }}>
          <i className="fas fa-plus"></i> Add User
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>
          All ({users.length})
        </button>
        <button className={`btn ${filter === 'student' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('student')}>
          Students ({users.filter(u => u.role === 'student').length})
        </button>
        <button className={`btn ${filter === 'teacher' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('teacher')}>
          Teachers ({users.filter(u => u.role === 'teacher').length})
        </button>
        <button className={`btn ${filter === 'admin' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('admin')}>
          Admins ({users.filter(u => u.role === 'admin').length})
        </button>
      </div>

      {showAddUser && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required disabled={!!editingUser} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Password *</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Role *</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            {formData.role === 'student' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Grade</label>
                <select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
            )}
            {formData.role === 'teacher' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Assign Subjects</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {getAllSubjects().map(subject => (
                    <label key={subject.id} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', background: formData.subjects.includes(subject.id) ? '#e3f2fd' : 'transparent', borderRadius: '4px' }}>
                      <input type="checkbox" checked={formData.subjects.includes(subject.id)} onChange={() => toggleSubject(subject.id)} style={{ marginRight: '0.5rem' }} />
                      <i className={subject.icon} style={{ marginRight: '0.5rem', color: subject.color }}></i>
                      <span style={{ fontSize: '0.9rem' }}>{subject.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i> {editingUser ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowAddUser(false); setEditingUser(null) }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Grade/Subjects</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Created</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{u.name}</td>
                  <td style={{ padding: '1rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: u.role === 'admin' ? '#ff6b6b' : u.role === 'teacher' ? '#4ecdc4' : '#95e1d3', color: 'white', borderRadius: '12px', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {u.role === 'student' ? u.grade : u.role === 'teacher' ? `${(u.subjects || []).length} subjects` : '-'}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button className="btn btn-sm" onClick={() => handleEdit(u)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm" onClick={() => handleDelete(u.id)} style={{ padding: '0.5rem 1rem', background: '#ff6b6b', color: 'white' }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
