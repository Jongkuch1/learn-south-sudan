import React, { useState, useEffect } from 'react'
import { getAllSubjects } from '../../data/subjects'
import { useLanguage } from '../../contexts/LanguageContext'
import { resourceService } from '../../services/resourceService'

const TeacherResources = ({ user }) => {
  const { t } = useLanguage()
  const [selectedSubject, setSelectedSubject] = useState(1)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  
  const subjects = getAllSubjects()

  useEffect(() => {
    loadTeacherResources(selectedSubject)
  }, [selectedSubject])

  const loadTeacherResources = async (subjectId) => {
    setLoading(true)
    try {
      const allResources = await resourceService.getAllResources()
      const subjectResources = allResources.filter(resource => 
        (resource.subjectId === subjectId.toString() || resource.subject === subjectId.toString()) && 
        resource.status === 'approved'
      )
      setResources(subjectResources)
    } catch (error) {
      console.error('Error loading resources:', error)
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return 'fas fa-play-circle'
      case 'document': return 'fas fa-file-pdf'
      case 'audio': return 'fas fa-volume-up'
      case 'link': return 'fas fa-external-link-alt'
      default: return 'fas fa-file'
    }
  }

  const currentSubject = subjects.find(s => s.id === selectedSubject)

  return (
    <div className="teacher-resources-section">
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--text)' }}>Learning Resources</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Access materials uploaded by your teachers</p>

      <div className="subject-selector">
        <div className="subject-tabs">
          {subjects.map(subject => (
            <button
              key={subject.id}
              className={`subject-tab ${selectedSubject === subject.id ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subject.id)}
              style={{ borderColor: subject.color }}
            >
              <i className={subject.icon}></i>
              <span>{t(subject.nameKey) || subject.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="resources-container">
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading resources...</p>
          </div>
        ) : (
          <>
            <div className="resources-header">
              <h3>
                {currentSubject?.name} Resources
                <span className="resource-count">({resources.length} items)</span>
              </h3>
            </div>

            {resources.length === 0 ? (
              <div className="no-resources">
                <i className="fas fa-folder-open"></i>
                <h4>No resources available</h4>
                <p>Your teachers haven't uploaded any resources for this subject yet.</p>
              </div>
            ) : (
              <div className="dashboard-grid">
                {resources.map(resource => (
                  <div key={resource.id} className="dashboard-card">
                    <div className="card-icon">
                      <i className={getResourceIcon(resource.type)}></i>
                    </div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '8px', marginBottom: '12px', fontSize: '0.85rem', color: '#666' }}>
                      {resource.teacherName && (
                        <span><i className="fas fa-chalkboard-teacher"></i> {resource.teacherName}</span>
                      )}
                      {resource.uploadedAt && (
                        <span><i className="fas fa-calendar"></i> {new Date(resource.uploadedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {resource.url && (
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        {resource.type === 'video' && <><i className="fas fa-play"></i> Watch</>}
                        {resource.type === 'document' && <><i className="fas fa-download"></i> Download</>}
                        {resource.type === 'link' && <><i className="fas fa-external-link-alt"></i> Open</>}
                        {resource.type === 'audio' && <><i className="fas fa-volume-up"></i> Listen</>}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TeacherResources