import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { profileService } from '../services/profileService'
import { useLanguage } from '../contexts/LanguageContext'

const Profile = () => {
  const { t } = useLanguage()
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    subject: '',
    avatar: '',
    biography: '',
    linkedin: '',
    twitter: '',
    github: ''
  })
  const [message, setMessage] = useState('')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (user) {
      // Clear old profile data that might have wrong name
      localStorage.removeItem(`ssplp_profile_${user.id}`)
      
      // Always use current user data from context
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        school: user.school || '',
        grade: user.grade || '',
        subject: user.subject || '',
        avatar: user.avatar || '',
        biography: '',
        linkedin: '',
        twitter: '',
        github: ''
      })
      
      // Load notifications
      const stored = localStorage.getItem(`notifications_${user.id}`)
      setNotifications(stored ? JSON.parse(stored) : [])
    }
  }, [user])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const updatedUser = { ...user, ...formData }
    
    // Update ssplp_registered_users
    const registeredUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    const userIndex = registeredUsers.findIndex(u => u.id === user.id || u.email === user.email)
    if (userIndex !== -1) {
      registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...formData }
      localStorage.setItem('ssplp_registered_users', JSON.stringify(registeredUsers))
    } else {
      // If not found, add the user
      registeredUsers.push({ ...user, ...formData, password: user.password || 'default123' })
      localStorage.setItem('ssplp_registered_users', JSON.stringify(registeredUsers))
    }
    
    // Update ssplp_user and context
    localStorage.setItem('ssplp_user', JSON.stringify(updatedUser))
    updateUser(updatedUser)
    
    setMessage('Profile updated successfully!')
    setIsEditing(false)
    
    setTimeout(() => window.location.reload(), 500)
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'notifications':
        return (
          <div className="tab-content">
            <h2>{t('notificationSettings')}</h2>
            <p className="section-description">Settings for <strong>Account</strong></p>

            {/* Course Activities */}
            <div className="notification-category">
              <h3>Course Activities notification preferences</h3>
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Course Activities</th>
                    <th>email<br/>{formData.email}</th>
                    <th>Push Notification<br/>For All Devices</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Due Date</strong>
                      <p>Assignment due date change</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Grading Policies</strong>
                      <p>Course grading policy change</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Course Content</strong>
                      <p>Change to course content: Page content, Quiz content, Assignment content</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Files</strong>
                      <p>New file added to your course</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Announcement</strong>
                      <p>New Announcement in your course</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Announcement Created By You</strong>
                      <p>Announcements created by you, Replies to announcements you've created</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Grading</strong>
                      <p>Includes: Assignment/submission grade entered/changed, Grade weight changed</p>
                      <p className="note">Include scores when alerting about grades. If your email is not an institution email this means sensitive content will be sent outside of the institution.</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Invitation</strong>
                      <p>Invitation for: Web conference, Group, Collaboration, Peer Review & reminder</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>All Submissions</strong>
                      <p>(Instructor and Admin only) Assignment submission/resubmission, except quizzes</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Late Grading</strong>
                      <p>(Instructor and Admin only) Late assignment submission</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Submission Comment</strong>
                      <p>Assignment submission comment</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Discussions */}
            <div className="notification-category">
              <h3>Discussions notification preferences</h3>
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Discussions</th>
                    <th>email<br/>{formData.email}</th>
                    <th>push</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>New Topic</strong>
                      <p>New Discussion topic in your course</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>New Reply</strong>
                      <p>New reply on a topic you're subscribed to</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>New Mention</strong>
                      <p>New Mention in a Discussion</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Conversations */}
            <div className="notification-category">
              <h3>Conversations notification preferences</h3>
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Conversations</th>
                    <th>email<br/>{formData.email}</th>
                    <th>push</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Added To Conversation</strong>
                      <p>You are added to a conversation</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Conversation Message</strong>
                      <p>New Inbox messages</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Conversations Created By Me</strong>
                      <p>You created a conversation</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scheduling */}
            <div className="notification-category">
              <h3>Scheduling notification preferences</h3>
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Scheduling</th>
                    <th>email<br/>{formData.email}</th>
                    <th>push</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Student Appointment Signups</strong>
                      <p>(Instructor and Admin only) Student appointment sign-up</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Appointment Signups</strong>
                      <p>New appointment on your calendar</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Appointment Cancellations</strong>
                      <p>Appointment cancellation</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Appointment Availability</strong>
                      <p>New appointment timeslots are available for signup</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Calendar</strong>
                      <p>New and changed items on your course calendar</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Groups */}
            <div className="notification-category">
              <h3>Groups notification preferences</h3>
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Groups</th>
                    <th>email<br/>{formData.email}</th>
                    <th>push</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Membership Update</strong>
                      <p>(Admin only) pending enrollment activated, Group enrollment accepted/rejected</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Alerts */}
            <div className="notification-category">
              <h3>Alerts notification preferences</h3>
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Alerts</th>
                    <th>email<br/>{formData.email}</th>
                    <th>push</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Administrative Notifications</strong>
                      <p>(Instructor and Admin only) Course enrollment, Report generated, Content export, Migration report, New account user, New student group</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Content Link Error</strong>
                      <p>(Instructor and Admin only) Location and content of a failed link that a student has interacted with</p>
                    </td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Global Announcements</strong>
                      <p>Institution-wide announcements (also displayed on Dashboard pages)</p>
                    </td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary">
                <i className="fas fa-save"></i> Update Preferences
              </button>
            </div>
          </div>
        )
      
      case 'profile':
        return (
          <div className="tab-content">
            <div className="profile-header-section">
              <div className="profile-avatar-large">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="avatar-img-xl" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <div className="profile-info">
                <h2>{formData.name}</h2>
                <p className="role-badge">{t(user?.role)}</p>
              </div>
              {!isEditing && (
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  <i className="fas fa-edit"></i> {t('editProfile')}
                </button>
              )}
            </div>

            {!isEditing ? (
              <>
                <div className="profile-section">
                  <h3><i className="fas fa-address-card"></i> {t('contact')}</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>{t('email')}</label>
                      <p>{formData.email}</p>
                    </div>
                    {formData.phone && (
                      <div className="info-item">
                        <label>{t('phone')}</label>
                        <p>{formData.phone}</p>
                      </div>
                    )}
                    {formData.school && (
                      <div className="info-item">
                        <label>{t('school')}</label>
                        <p>{formData.school}</p>
                      </div>
                    )}
                    {user?.role === 'student' && formData.grade && (
                      <div className="info-item">
                        <label>{t('grade')}</label>
                        <p>{formData.grade}</p>
                      </div>
                    )}
                    {user?.role === 'teacher' && formData.subject && (
                      <div className="info-item">
                        <label>{t('subject')}</label>
                        <p>{formData.subject}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-section">
                  <h3><i className="fas fa-user"></i> {user?.role === 'student' ? t('aboutMe') : user?.role === 'teacher' ? t('teachingPhilosophy') : t('biography')}</h3>
                  <p className="biography-text">
                    {formData.biography || 
                      (user?.role === 'student' ? t('shareLearningGoals') : 
                       user?.role === 'teacher' ? t('shareTeachingPhilosophy') : 
                       t('shareKnowledge'))}
                  </p>
                </div>

                <div className="profile-section">
                  <h3><i className="fas fa-link"></i> {t('links')}</h3>
                  <div className="links-list">
                    {formData.linkedin && (
                      <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fab fa-linkedin"></i> LinkedIn
                      </a>
                    )}
                    {formData.twitter && (
                      <a href={formData.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fab fa-twitter"></i> Twitter
                      </a>
                    )}
                    {formData.github && (
                      <a href={formData.github} target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fab fa-github"></i> GitHub
                      </a>
                    )}
                    {!formData.linkedin && !formData.twitter && !formData.github && (
                      <p className="empty-text">{t('noLinksAdded')}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="form-section">
                  <h3>{t('basicInformation')}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('fullName')}</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>{t('email')}</label>
                      <input type="email" name="email" value={formData.email} disabled />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('phone')}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+211 XXX XXX XXX" />
                    </div>
                    <div className="form-group">
                      <label>{t('school')}</label>
                      <input type="text" name="school" value={formData.school} onChange={handleChange} />
                    </div>
                  </div>
                  {user?.role === 'student' && (
                    <div className="form-group">
                      <label>{t('grade')}</label>
                      <select name="grade" value={formData.grade} onChange={handleChange}>
                        <option value="">{t('selectGrade')}</option>
                        <option value="Grade 9">{t('grade')} 9</option>
                        <option value="Grade 10">{t('grade')} 10</option>
                        <option value="Grade 11">{t('grade')} 11</option>
                        <option value="Grade 12">{t('grade')} 12</option>
                      </select>
                    </div>
                  )}
                  {user?.role === 'teacher' && (
                    <div className="form-group">
                      <label>{t('subjectSpecialization')}</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h3>{user?.role === 'student' ? t('aboutMe') : user?.role === 'teacher' ? t('teachingPhilosophy') : t('biography')}</h3>
                  <div className="form-group">
                    <textarea 
                      name="biography" 
                      value={formData.biography} 
                      onChange={handleChange} 
                      rows="4" 
                      placeholder={
                        user?.role === 'student' ? t('shareLearningGoals') : 
                        user?.role === 'teacher' ? t('shareTeachingPhilosophy') : 
                        t('shareKnowledge')
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h3>{t('socialLinks')}</h3>
                  <div className="form-group">
                    <label><i className="fab fa-linkedin"></i> LinkedIn</label>
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" />
                  </div>
                  <div className="form-group">
                    <label><i className="fab fa-twitter"></i> Twitter</label>
                    <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://twitter.com/yourhandle" />
                  </div>
                  <div className="form-group">
                    <label><i className="fab fa-github"></i> GitHub</label>
                    <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/yourusername" />
                  </div>
                </div>

                <div className="form-section">
                  <h3>{t('profilePhoto')}</h3>
                  <label htmlFor="avatar-upload" className="avatar-upload-btn">
                    <i className="fas fa-camera"></i> {t('changePhoto')}
                  </label>
                  <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> {t('saveChanges')}
                  </button>
                  <button type="button" className="btn" onClick={() => setIsEditing(false)}>{t('cancel')}</button>
                </div>
              </form>
            )}
          </div>
        )
      
      case 'files':
        const userFiles = JSON.parse(localStorage.getItem(`user_files_${user.id}`) || '[]')
        
        return (
          <div className="tab-content">
            <div className="files-header">
              <h2>{t('allMyFiles')}</h2>
              <button className="btn btn-primary" onClick={() => {
                const fileName = prompt('Enter file/folder name:')
                if (fileName) {
                  const files = JSON.parse(localStorage.getItem(`user_files_${user.id}`) || '[]')
                  files.push({
                    id: Date.now(),
                    name: fileName,
                    type: 'folder',
                    createdAt: new Date().toISOString()
                  })
                  localStorage.setItem(`user_files_${user.id}`, JSON.stringify(files))
                  window.location.reload()
                }
              }}>
                <i className="fas fa-plus"></i> {t('addFolder')}
              </button>
            </div>

            <div className="files-breadcrumb">
              <i className="fas fa-folder"></i> {t('allMyFiles')}
            </div>

            {userFiles.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-folder-open"></i>
                <p>{t('noFilesYet')}</p>
                <p className="empty-help">{t('clickAddFolder')}</p>
              </div>
            ) : (
              <div className="files-list">
                <table className="files-table">
                  <thead>
                    <tr>
                      <th>{t('name')}</th>
                      <th>{t('modified')}</th>
                      <th>{t('size')}</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userFiles.map(file => (
                      <tr key={file.id} className="folder-row">
                        <td>
                          <i className={`fas fa-${file.type === 'folder' ? 'folder' : 'file'}`}></i>
                          <strong>{file.name}</strong>
                        </td>
                        <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                        <td>-</td>
                        <td>
                          <button className="btn-icon" title="Delete" onClick={() => {
                            if (confirm('Delete this item?')) {
                              const files = JSON.parse(localStorage.getItem(`user_files_${user.id}`) || '[]')
                              const updated = files.filter(f => f.id !== file.id)
                              localStorage.setItem(`user_files_${user.id}`, JSON.stringify(updated))
                              window.location.reload()
                            }
                          }}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      
      case 'settings':
        return (
          <div className="tab-content">
            <h2>Settings</h2>
            
            <div className="settings-section">
              <h3><i className="fas fa-user-cog"></i> Account Settings</h3>
              
              <div className="setting-item">
                <label>Full Name</label>
                <strong>{formData.name}</strong>
              </div>

              <div className="setting-item">
                <label>Email</label>
                <strong>{formData.email}</strong>
              </div>

              <div className="setting-item">
                <label>Language</label>
                <select className="setting-select">
                  <option>English</option>
                  <option>Arabic</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Time Zone</label>
                <select className="setting-select">
                  <option>Juba (+03:00)</option>
                  <option>Nairobi (+03:00)</option>
                  <option>Cairo (+02:00)</option>
                </select>
              </div>
            </div>

            <div className="settings-section">
              <h3><i className="fas fa-bell"></i> Notifications</h3>
              
              <div className="setting-item">
                <label>Email Notifications</label>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="setting-item">
                <label>Push Notifications</label>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="setting-item">
                <label>SMS Notifications</label>
                <input type="checkbox" />
              </div>
            </div>

            <div className="settings-section">
              <h3><i className="fas fa-lock"></i> Privacy</h3>
              
              <div className="setting-item">
                <label>Show Profile to Others</label>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="setting-item">
                <label>Show Online Status</label>
                <input type="checkbox" defaultChecked />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary">
                <i className="fas fa-save"></i> Save Settings
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="profile-page-new">
      <div className="container">
        {message && (
          <div className="message success">
            <i className="fas fa-check-circle"></i>
            {message}
          </div>
        )}

        <div className="profile-tabs">
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <i className="fas fa-user"></i> {t('profile')}
          </button>
          {user?.role === 'student' && (
            <>
              <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
                <i className="fas fa-bell"></i> {t('notifications')}
              </button>
              <button className={activeTab === 'files' ? 'active' : ''} onClick={() => setActiveTab('files')}>
                <i className="fas fa-folder"></i> {t('myFiles')}
              </button>
            </>
          )}
          {user?.role === 'teacher' && (
            <>
              <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
                <i className="fas fa-bell"></i> {t('notifications')}
              </button>
              <button className={activeTab === 'files' ? 'active' : ''} onClick={() => setActiveTab('files')}>
                <i className="fas fa-folder"></i> {t('resources')}
              </button>
            </>
          )}
          {user?.role === 'admin' && (
            <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
              <i className="fas fa-bell"></i> {t('systemAlerts')}
            </button>
          )}
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <i className="fas fa-cog"></i> {t('settings')}
          </button>
        </div>

        <div className="profile-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default Profile
