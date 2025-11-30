import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { tutoringService } from '../services/tutoringService'
import { subjects } from '../data/subjects'
import './VirtualTutoring.css'

const VirtualTutoring = () => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [requests, setRequests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [students, setStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    date: '',
    time: '',
    duration: '60',
    notes: ''
  })

  useEffect(() => {
    if (user) {
      loadData()
      loadStudents()
    }
  }, [user])

  const loadStudents = () => {
    try {
      const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
      // Filter out demo accounts and only show real registered students
      const demoEmails = ['student@ssplp.org', 'jane@ssplp.org', 'mike@ssplp.org']
      const studentList = users.filter(u => 
        u.role === 'student' && !demoEmails.includes(u.email)
      )
      setStudents(studentList)
    } catch (error) {
      console.error('Error loading students:', error)
      setStudents([])
    }
  }

  const loadData = () => {
    try {
      if (user?.role === 'student') {
        const allSessions = tutoringService.getAllSessions()
        const studentSessions = allSessions.filter(s => 
          String(s.studentId) === String(user.id)
        )
        console.log('All sessions:', allSessions)
        console.log('Student ID:', user.id)
        console.log('Filtered student sessions:', studentSessions)
        setSessions(studentSessions)
      } else if (user?.role === 'teacher') {
        setSessions(tutoringService.getSessionsByTeacher(user.id))
        setRequests(tutoringService.getPendingRequests())
      } else if (user?.role === 'admin') {
        setSessions(tutoringService.getAllSessions())
        setRequests(tutoringService.getAllRequests())
      }
    } catch (error) {
      console.error('Error loading tutoring data:', error)
      setSessions([])
      setRequests([])
    }
  }

  const toggleStudent = (student) => {
    setSelectedStudents(prev => {
      const exists = prev.find(s => s.id === student.id)
      if (exists) {
        return prev.filter(s => s.id !== student.id)
      } else {
        return [...prev, student]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.topic || !formData.date || !formData.time) {
      alert('Please fill in all required fields')
      return
    }
    
    try {
      if (selectedStudents.length === 0) {
        const session = tutoringService.createSession({
          teacherId: user.id,
          teacherName: user.name,
          studentId: 'Open Session',
          studentName: 'Open Session',
          subject: formData.subject,
          topic: formData.topic,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          notes: formData.notes
        })
        console.log('Created open session:', session)
        alert('Open session created successfully!')
      } else {
        let successCount = 0
        selectedStudents.forEach((student) => {
          try {
            const session = tutoringService.createSession({
              teacherId: user.id,
              teacherName: user.name,
              studentId: student.id,
              studentName: student.name,
              subject: formData.subject,
              topic: formData.topic,
              date: formData.date,
              time: formData.time,
              duration: formData.duration,
              notes: formData.notes
            })
            console.log('Created session for student:', student.id, student.name, session)
            successCount++
          } catch (err) {
            console.error('Error creating session for student:', student.name, err)
          }
        })
        alert(`${successCount} session(s) scheduled successfully! Students will see this in their dashboard.`)
      }
      setShowForm(false)
      setFormData({ subject: '', topic: '', date: '', time: '', duration: '60', notes: '' })
      setSelectedStudents([])
      loadData()
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Error: ' + (error.message || 'Failed to create session. Please try again.'))
    }
  }

  const handleApprove = (requestId) => {
    const request = requests.find(r => r.id === requestId)
    const date = prompt('Enter session date (YYYY-MM-DD):')
    const time = prompt('Enter session time (HH:MM):')
    if (date && time) {
      tutoringService.approveRequest(requestId, user.id, {
        teacherName: user.name,
        date,
        time,
        duration: '60'
      })
      alert('Request approved and session scheduled!')
      loadData()
    }
  }

  const handleReject = (requestId) => {
    if (confirm('Reject this tutoring request?')) {
      tutoringService.rejectRequest(requestId)
      loadData()
    }
  }

  const handleCancel = (sessionId) => {
    if (confirm('Cancel this session?')) {
      tutoringService.cancelSession(sessionId)
      loadData()
    }
  }

  const handleComplete = (sessionId) => {
    tutoringService.completeSession(sessionId)
    alert('Session marked as completed!')
    loadData()
  }

  if (!user) {
    return (
      <div className="tutoring-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#87CEEB' }}></i>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tutoring-page">
      <div className="container">
        <div className="page-header">
          <h1><i className="fas fa-chalkboard-teacher"></i> Virtual Tutoring</h1>
          {(user.role === 'teacher' || user.role === 'admin') && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <i className="fas fa-plus"></i> {showForm ? 'Cancel' : 'Schedule Session'}
            </button>
          )}
        </div>

        {showForm && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: '2rem', border: '3px solid #87CEEB' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#87CEEB', fontSize: '1.5rem' }}>Schedule Tutoring Session</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Subject *</label>
                <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}>
                  <option value="">Select Subject</option>
                  {subjects.compulsory.concat(subjects.science, subjects.arts).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Topic *</label>
                <input type="text" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Select Students (Optional)</label>
                {students.length === 0 ? (
                  <p style={{ color: '#999', fontStyle: 'italic', padding: '0.75rem' }}>No students registered yet</p>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '2px solid #e0e0e0', borderRadius: '8px', padding: '0.5rem' }}>
                    {students.map(student => (
                      <label key={student.id} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px', background: selectedStudents.some(s => s.id === student.id) ? '#e3f2fd' : 'transparent' }}>
                        <input
                          type="checkbox"
                          checked={selectedStudents.some(s => s.id === student.id)}
                          onChange={() => toggleStudent(student)}
                          style={{ marginRight: '0.75rem', width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', color: '#333' }}>{student.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>{student.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {selectedStudents.length > 0 && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#e3f2fd', borderRadius: '4px', color: '#1976d2', fontSize: '0.9rem' }}>
                    <i className="fas fa-users"></i> {selectedStudents.length} student(s) selected
                  </div>
                )}
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
                  <i className="fas fa-info-circle"></i> Leave blank for open session, or select multiple students
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} required style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Time *</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Duration</label>
                <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Notes (Optional)</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="3" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}></textarea>
              </div>
              <button type="submit" style={{ width: '100%', padding: '1rem', background: '#87CEEB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' }}>Create Session</button>
            </form>
          </div>
        )}

        {(user?.role === 'teacher' || user?.role === 'admin') && requests.length > 0 && (
          <div className="tutoring-section">
            <h2><i className="fas fa-inbox"></i> Pending Requests</h2>
            <div className="requests-list">
              {requests.map(request => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <h4>{request.studentName}</h4>
                    <span className={`status-badge ${request.status}`}>{request.status}</span>
                  </div>
                  <p><strong>Subject:</strong> {request.subject}</p>
                  <p><strong>Topic:</strong> {request.topic}</p>
                  {request.notes && <p><strong>Notes:</strong> {request.notes}</p>}
                  <small>Requested: {new Date(request.createdAt).toLocaleString()}</small>
                  {request.status === 'pending' && (
                    <div className="request-actions">
                      <button className="btn btn-success btn-sm" onClick={() => handleApprove(request.id)}>
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleReject(request.id)}>
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tutoring-section">
          <h2><i className="fas fa-calendar-alt"></i> {user?.role === 'student' ? 'My Sessions' : 'Scheduled Sessions'}</h2>
          {sessions.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-times" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>No tutoring sessions scheduled</h3>
              <p style={{ color: '#999', marginBottom: '1.5rem' }}>Get started by scheduling your first tutoring session</p>
              
              {user?.role === 'teacher' || user?.role === 'admin' ? (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowForm(true)}
                    style={{ marginBottom: '1rem', padding: '1rem 2rem', fontSize: '1.1rem' }}
                  >
                    <i className="fas fa-plus-circle"></i> Schedule Your First Session
                  </button>
                  <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginTop: '1.5rem' }}>
                    <h4 style={{ color: '#87CEEB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-lightbulb"></i> Quick Start Guide
                    </h4>
                    <ol style={{ paddingLeft: '1.5rem', color: '#555', lineHeight: '1.8' }}>
                      <li>Click "Schedule Your First Session" button above</li>
                      <li>Select a subject and enter the topic you'll teach</li>
                      <li>Choose date and time for the session</li>
                      <li>Optionally add student name or leave blank for open session</li>
                      <li>Click "Create Session" and you're done!</li>
                    </ol>
                    <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                      <i className="fas fa-info-circle"></i> Students will be able to see and join your scheduled sessions.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <i className="fas fa-info-circle" style={{ fontSize: '3rem', color: '#87CEEB', marginBottom: '1rem' }}></i>
                    <h4 style={{ color: '#333', marginBottom: '1rem' }}>Waiting for Teacher to Schedule Sessions</h4>
                    <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                      Your teachers will schedule virtual tutoring sessions for you. Once a session is scheduled, it will appear here and you'll be able to join the meeting.
                    </p>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '2px solid #87CEEB', textAlign: 'left' }}>
                      <h5 style={{ color: '#87CEEB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-lightbulb"></i> What You Can Do
                      </h5>
                      <ul style={{ paddingLeft: '1.5rem', color: '#555', lineHeight: '1.8', marginBottom: 0 }}>
                        <li>Check this page regularly for new sessions</li>
                        <li>Contact your teacher via Messages if you need help</li>
                        <li>When a session appears, click "Join Meeting" to attend</li>
                        <li>Be ready 5 minutes before the scheduled time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="sessions-list">
              {sessions.map(session => (
                <div key={session.id} className={`session-card ${session.status}`}>
                  <div className="session-header">
                    <div>
                      <h4>{session.subject}</h4>
                      <p className="session-topic">{session.topic}</p>
                    </div>
                    <span className={`status-badge ${session.status}`}>{session.status}</span>
                  </div>
                  <div className="session-details">
                    <div className="detail-item">
                      <i className="fas fa-user-graduate"></i>
                      <span>{user?.role === 'student' ? `Teacher: ${session.teacherName}` : `Student: ${session.studentName || session.studentId}`}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>{session.time} ({session.duration} min)</span>
                    </div>
                  </div>
                  {session.notes && <p className="session-notes"><strong>Notes:</strong> {session.notes}</p>}
                  {session.status === 'scheduled' && (
                    <div className="session-actions">
                      <a href="https://meet.google.com/zce-wnss-vvr" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        <i className="fas fa-video"></i> Join Meeting
                      </a>
                      {(user?.role === 'teacher' || user?.role === 'admin') && (
                        <button className="btn btn-success btn-sm" onClick={() => handleComplete(session.id)}>
                          <i className="fas fa-check-circle"></i> Complete
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(session.id)}>
                        <i className="fas fa-ban"></i> Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VirtualTutoring
