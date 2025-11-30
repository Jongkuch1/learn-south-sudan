import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { progressService } from '../../services/progressService'
import { profileService } from '../../services/profileService'
import { getAllSubjects } from '../../data/subjects'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const StudentProgress = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewMode, setViewMode] = useState('students')
  const [showAssignSubject, setShowAssignSubject] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState([])

  useEffect(() => {
    const demoEmails = ['student@ssplp.org', 'jane@ssplp.org', 'mike@ssplp.org']
    const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    const allStudents = users.filter(u => u.role === 'student' && !demoEmails.includes(u.email))
    const studentsWithProgress = allStudents.map(student => ({
      ...student,
      overallProgress: progressService.getOverallProgress(student.id),
      completedSubjects: progressService.getCompletedModules(student.id),
      activeSubjects: progressService.getEnrolledSubjects(student.id).length,
      avatar: profileService.getAvatar(student.id)
    }))
    setStudents(studentsWithProgress)
    
    if (user?.role === 'admin') {
      const allTeachers = users.filter(u => u.role === 'teacher' && !demoEmails.includes(u.email))
      const teachersWithStats = allTeachers.map(teacher => {
        const classes = JSON.parse(localStorage.getItem(`ssplp_teacher_classes_${teacher.id}`) || '[]')
        const assignments = JSON.parse(localStorage.getItem(`ssplp_teacher_assignments_${teacher.id}`) || '[]')
        const resources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]').filter(r => r.teacherId === teacher.id)
        
        return {
          ...teacher,
          totalClasses: classes.length,
          totalAssignments: assignments.length,
          totalResources: resources.length,
          avatar: profileService.getAvatar(teacher.id)
        }
      })
      setTeachers(teachersWithStats)
    }
  }, [user])

  const viewUserDetails = (selectedUser) => {
    const userProgress = progressService.getProgress(selectedUser.id)
    const subjects = getAllSubjects()
    const subjectsWithProgress = subjects.map(subject => ({
      ...subject,
      progress: userProgress[subject.id] || 0
    })).filter(s => s.progress > 0)

    setSelectedUser({
      ...selectedUser,
      subjects: subjectsWithProgress
    })
    setSelectedSubjects(selectedUser.subjects || [])
  }

  const handleAssignSubjects = () => {
    const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    const userIndex = users.findIndex(u => u.id === selectedUser.id)
    if (userIndex !== -1) {
      users[userIndex].subjects = selectedSubjects
      localStorage.setItem('ssplp_registered_users', JSON.stringify(users))
      setSelectedUser({ ...selectedUser, subjects: selectedSubjects })
      setShowAssignSubject(false)
      alert('Subjects assigned successfully!')
      window.location.reload()
    }
  }

  const toggleSubject = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const currentList = viewMode === 'students' ? students : teachers

  return (
    <div className="student-progress-page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1>{user?.role === 'admin' ? 'User Progress' : 'Student Progress'}</h1>
            <p>Monitor and track {user?.role === 'admin' ? 'user' : 'student'} performance</p>
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {user?.role === 'admin' && (
          <div className="page-tabs">
            <button 
              className={`tab-btn ${viewMode === 'students' ? 'active' : ''}`}
              onClick={() => setViewMode('students')}
            >
              <i className="fas fa-user-graduate"></i> {t('students')}
            </button>
            <button 
              className={`tab-btn ${viewMode === 'teachers' ? 'active' : ''}`}
              onClick={() => setViewMode('teachers')}
            >
              <i className="fas fa-chalkboard-teacher"></i> {t('activeTeachers')}
            </button>
          </div>
        )}

        {!selectedUser ? (
          <div className="students-list">
            {currentList.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-users"></i>
                <p>No {viewMode} registered yet.</p>
              </div>
            ) : (
              <div className="students-grid">
                {currentList.map(student => (
                  <div key={student.id} className="student-card">
                    <div className="student-avatar">
                      {student.avatar ? (
                        <img src={student.avatar} alt={student.name} className="avatar-img" />
                      ) : (
                        <i className="fas fa-user-circle"></i>
                      )}
                    </div>
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                    <div className="student-stats">
                      {viewMode === 'students' ? (
                        <>
                          <div className="stat-item">
                            <strong>{student.overallProgress}%</strong>
                            <span>Overall</span>
                          </div>
                          <div className="stat-item">
                            <strong>{student.activeSubjects}</strong>
                            <span>Active</span>
                          </div>
                          <div className="stat-item">
                            <strong>{student.completedSubjects}</strong>
                            <span>Completed</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="stat-item">
                            <strong>{student.totalClasses || 0}</strong>
                            <span>Classes</span>
                          </div>
                          <div className="stat-item">
                            <strong>{student.totalAssignments || 0}</strong>
                            <span>Assignments</span>
                          </div>
                          <div className="stat-item">
                            <strong>{student.totalResources || 0}</strong>
                            <span>Resources</span>
                          </div>
                        </>
                      )}
                    </div>
                    <button className="btn btn-primary" onClick={() => viewUserDetails(student)}>
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="student-details">
            <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
              <i className="fas fa-arrow-left"></i> Back to {viewMode === 'students' ? 'Students' : 'Teachers'}
            </button>
            
            <div className="student-header">
              <div className="student-avatar-large">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="avatar-img-large" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h2>{selectedUser.name}</h2>
                <p>{selectedUser.email}</p>
                <span className="role-badge">{selectedUser.role}</span>
              </div>
              {user?.role === 'admin' && selectedUser.role === 'teacher' && (
                <button className="btn btn-primary" onClick={() => setShowAssignSubject(!showAssignSubject)}>
                  <i className="fas fa-book"></i> Assign Subjects
                </button>
              )}
            </div>

            {showAssignSubject && selectedUser.role === 'teacher' && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #87CEEB' }}>
                <h3 style={{ marginBottom: '1rem' }}>Assign Subjects to {selectedUser.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {getAllSubjects().map(subject => (
                    <label key={subject.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', background: selectedSubjects.includes(subject.id) ? '#e3f2fd' : 'white' }}>
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={() => toggleSubject(subject.id)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <i className={subject.icon} style={{ marginRight: '0.5rem', color: subject.color }}></i>
                      <span>{subject.name}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={handleAssignSubjects}>
                    <i className="fas fa-save"></i> Save
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowAssignSubject(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="progress-stats">
              {selectedUser.role === 'student' ? (
                <>
                  <div className="stat-card">
                    <h3>Overall Progress</h3>
                    <div className="big-number">{selectedUser.overallProgress}%</div>
                  </div>
                  <div className="stat-card">
                    <h3>Active Subjects</h3>
                    <div className="big-number">{selectedUser.activeSubjects}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Completed Subjects</h3>
                    <div className="big-number">{selectedUser.completedSubjects}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="stat-card">
                    <h3>Total Classes</h3>
                    <div className="big-number">{selectedUser.totalClasses || 0}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Assignments Created</h3>
                    <div className="big-number">{selectedUser.totalAssignments || 0}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Resources Uploaded</h3>
                    <div className="big-number">{selectedUser.totalResources || 0}</div>
                  </div>
                </>
              )}
            </div>

            {selectedUser.role === 'student' && (
              <div className="subjects-progress">
                <h2>Subject Progress</h2>
                {selectedUser.subjects.length === 0 ? (
                  <div className="no-data">
                    <p>User hasn't started any subjects yet.</p>
                  </div>
                ) : (
                  <div className="subjects-progress-list">
                    {selectedUser.subjects.map(subject => (
                      <div key={subject.id} className="subject-progress-item">
                        <div className="subject-info">
                          <div className="subject-icon-small" style={{ color: subject.color }}>
                            <i className={subject.icon}></i>
                          </div>
                          <div>
                            <strong>{subject.name}</strong>
                            <p>{subject.progress}% Complete</p>
                          </div>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentProgress
