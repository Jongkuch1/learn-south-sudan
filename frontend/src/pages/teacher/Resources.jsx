import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { resourceService } from '../../services/resourceService'
import { getAllSubjects, getSubjectById } from '../../data/subjects'
import { activityService } from '../../services/activityService'

const Resources = () => {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    type: 'document',
    url: '',
    file: null
  })

  const subjects = getAllSubjects()
  const [teacherSubjects, setTeacherSubjects] = useState([])

  useEffect(() => {
    // Get latest user data with subjects
    const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
    const currentUser = users.find(u => u.id === user?.id)
    setTeacherSubjects(currentUser?.subjects || [])
    loadResources()
  }, [user])

  const loadResources = async () => {
    if (user) {
      const allResources = user.role === 'admin' 
        ? await resourceService.getAllResources()
        : await resourceService.getResourcesByTeacher(user.id)
      
      setResources(allResources)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, file: file, url: reader.result }))
      }
      reader.onerror = () => {
        alert('Error reading file. Please try again or use a URL instead.')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.url && !formData.file) {
      alert('Please upload a file or enter a URL')
      return
    }

    
    const subjectId = formData.subjectId
    const subject = subjects.find(s => s.id === parseInt(subjectId))
    
    try {
      await resourceService.addResource({
        title: formData.title,
        description: formData.description,
        subjectId: subjectId,
        subject: subjectId.toString(),
        type: formData.type,
        url: formData.url,
        fileName: formData.file?.name,
        teacherId: user.id,
        teacherName: user.name,
        subjectName: subject.name,
        status: 'pending'
      })

      activityService.addActivity(user.id, {
        type: 'resource',
        title: 'Uploaded Resource',
        description: `${formData.title} for ${subject.name}`
      })

      alert('Resource uploaded successfully! Waiting for admin approval.')
      setFormData({ title: '', description: '', subjectId: '', type: 'document', url: '', file: null })
      setShowUploadForm(false)
      await loadResources()
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        alert('Storage quota exceeded. Your file is too large for direct upload.\n\nPlease use cloud storage instead:\n1. Upload to YouTube/Google Drive/Dropbox\n2. Get shareable link\n3. Paste link in URL field')
      } else {
        alert('Failed to upload resource: ' + error.message)
      }
      console.error('Upload error:', error)
    }
  }

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      await resourceService.deleteResource(resourceId)
      await loadResources()
    }
  }

  return (
    <div className="resources-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Learning Resources</h1>
            <p>Upload and manage learning materials</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={loadResources}>
              <i className="fas fa-sync"></i> Refresh
            </button>
            <button className="btn btn-primary" onClick={() => setShowUploadForm(!showUploadForm)}>
              <i className="fas fa-plus"></i> Upload Resource
            </button>
          </div>
        </div>

        {showUploadForm && (
          <div className="upload-form">
            <h2>Upload New Resource</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Algebra Chapter 1 Notes"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the resource"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <select name="subjectId" value={formData.subjectId} onChange={handleChange} required>
                    <option value="">Select Subject</option>
                    {(user.role === 'admin' ? subjects : subjects.filter(s => teacherSubjects.includes(s.id))).map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="link">External Link</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>URL/Link (YouTube, Google Drive, Dropbox, etc.)</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                  required={!formData.file}
                />
              </div>

              <div className="form-group">
                <label>Or Upload Small File (Documents under 5MB)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.mp4,.mp3,.wav,video/*,audio/*"
                  onChange={handleFileChange}
                />
                {formData.file && <p style={{ marginTop: '5px', color: '#28a745' }}><i className="fas fa-check"></i> File selected: {formData.file.name}</p>}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#2196F3', marginTop: '10px', background: '#e3f2fd', padding: '10px', borderRadius: '5px', border: '1px solid #2196F3' }}>
                <strong>💡 Tip:</strong> For videos and large files (over 10MB), upload to YouTube, Google Drive, or Dropbox first, then paste the shareable link above for better performance.
              </p>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Upload Resource</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="resources-list">
          {resources.length === 0 ? (
            <div className="no-data">
              <i className="fas fa-folder-open"></i>
              <p>No resources uploaded yet. Click "Upload Resource" to add your first resource.</p>
            </div>
          ) : (
            <div className="resources-grid">
              {resources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-icon">
                    <i className={`fas fa-${resource.type === 'video' ? 'video' : resource.type === 'audio' ? 'headphones' : resource.type === 'link' ? 'link' : 'file-alt'}`}></i>
                  </div>
                  <h3>{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  <div className="resource-meta">
                    <span className="subject-badge">{resource.subjectName}</span>
                    <span className="type-badge">{resource.type}</span>
                    <span className={`status-badge ${resource.status || 'approved'}`}>{resource.status || 'approved'}</span>
                  </div>
                  <div className="resource-actions">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                      <i className="fas fa-external-link-alt"></i> View
                    </a>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(resource.id)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Resources
