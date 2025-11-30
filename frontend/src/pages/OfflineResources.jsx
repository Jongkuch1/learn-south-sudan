import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { offlineService } from '../services/offlineService'
import { subjects } from '../data/subjects'
import { useLanguage } from '../contexts/LanguageContext'

const OfflineResources = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [offlineContent, setOfflineContent] = useState({})
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [uploadedResources, setUploadedResources] = useState([])

  useEffect(() => {
    if (user) {
      const content = offlineService.getOfflineContent(user.id)
      setOfflineContent(content)
    }

    // Load teacher-uploaded resources
    const allResources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]')
    setUploadedResources(allResources)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [user])

  const handleDownload = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId)
    if (!subject) return

    const content = {
      id: `${subjectId}-${Date.now()}`,
      subjectId,
      subjectName: subject.name,
      type: 'subject_pack',
      size: '250 MB',
      resources: 1000
    }

    offlineService.downloadContent(user.id, subjectId, content)
    const updated = offlineService.getOfflineContent(user.id)
    setOfflineContent(updated)
    alert(`${subject.name} downloaded for offline access!`)
  }

  const getTextbookPDFs = (subjectName) => {
    const textbooks = {
      'Citizenship': [
        { name: 'Citizenship 2 Student Textbook', url: '/Secondary Citizenship 2 Student Textbook.pdf' },
        { name: 'Citizenship 3 Student Textbook', url: '/Secondary Citizenship 3 Student Textbook.pdf' }
      ],
      'English': [
        { name: 'English 4 Student Textbook', url: '/Secondary English 4 Student Textbook.pdf' }
      ]
    }
    return textbooks[subjectName] || []
  }

  const handleRemove = (subjectId, contentId) => {
    offlineService.removeOfflineContent(user.id, subjectId, contentId)
    const updated = offlineService.getOfflineContent(user.id)
    setOfflineContent(updated)
  }

  const handleSync = () => {
    const result = offlineService.syncData(user.id)
    alert(`Synced ${result.synced} items successfully!`)
  }

  const getTotalDownloaded = () => {
    return Object.values(offlineContent).reduce((sum, arr) => sum + arr.length, 0)
  }

  return (
    <div className="offline-resources-page">
      <div className="container">
        <div className="page-header">
          <h1><i className="fas fa-download"></i> {t('offlineResources') || 'Offline Resources'}</h1>
          <p>{t('downloadContentOffline') || 'Download content for offline learning'}</p>
        </div>

        <div className="connection-status">
          <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
            <i className={`fas fa-${isOnline ? 'wifi' : 'wifi-slash'}`}></i>
            {isOnline ? t('online') || 'Online' : t('offline') || 'Offline'}
          </div>
          {isOnline && getTotalDownloaded() > 0 && (
            <button className="btn btn-primary" onClick={handleSync}>
              <i className="fas fa-sync"></i> {t('syncData') || 'Sync Data'}
            </button>
          )}
        </div>

        <div className="offline-stats">
          <div className="stat-box">
            <i className="fas fa-download"></i>
            <div>
              <h3>{getTotalDownloaded()}</h3>
              <p>{t('downloadedPacks') || 'Downloaded Packs'}</p>
            </div>
          </div>
          <div className="stat-box">
            <i className="fas fa-book"></i>
            <div>
              <h3>{subjects.length}</h3>
              <p>{t('availableSubjects') || 'Available Subjects'}</p>
            </div>
          </div>
        </div>

        <div className="offline-sections">
          <div className="section">
            <h2><i className="fas fa-book"></i> {t('learningResources') || 'Learning Resources'}</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>Access materials uploaded by your teachers</p>
            <div className="subjects-grid">
              {subjects.map(subject => {
                const subjectResources = uploadedResources.filter(r => r.subject === subject.id.toString())
                const textbooks = getTextbookPDFs(subject.name)
                const totalResources = subjectResources.length + textbooks.length
                
                return (
                  <div 
                    key={subject.id} 
                    className="subject-card-offline"
                    onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="subject-icon" style={{ color: subject.color }}>
                      <i className={subject.icon}></i>
                    </div>
                    <h3>{subject.name}</h3>
                    <p>{totalResources} {t('resources') || 'resources'}</p>
                    {totalResources > 0 && (
                      <button className="btn btn-primary btn-sm">
                        <i className="fas fa-eye"></i> {t('viewResources') || 'View Resources'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {selectedSubject && (
            <div className="section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>
                  <i className={subjects.find(s => s.id === selectedSubject)?.icon}></i> {subjects.find(s => s.id === selectedSubject)?.name} Resources
                </h2>
                <button className="btn btn-secondary" onClick={() => setSelectedSubject(null)}>
                  <i className="fas fa-times"></i> Close
                </button>
              </div>
              <div className="downloads-list">
                {uploadedResources
                  .filter(r => r.subject === selectedSubject.toString())
                  .map(resource => (
                    <div key={resource.id} className="download-item">
                      <div className="download-icon" style={{ color: subjects.find(s => s.id === selectedSubject)?.color }}>
                        <i className={`fas fa-${resource.type === 'video' ? 'play-circle' : resource.type === 'document' ? 'file-pdf' : 'link'}`}></i>
                      </div>
                      <div className="download-info">
                        <h4>{resource.title}</h4>
                        <p>{resource.description}</p>
                        <small>
                          {resource.teacherName && <><i className="fas fa-user"></i> {resource.teacherName} • </>}
                          {resource.uploadedAt && new Date(resource.uploadedAt).toLocaleDateString()}
                        </small>
                      </div>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <i className="fas fa-external-link-alt"></i> {t('open') || 'Open'}
                      </a>
                    </div>
                  ))}
                {getTextbookPDFs(subjects.find(s => s.id === selectedSubject)?.name).map((textbook, idx) => (
                  <div key={`textbook-${idx}`} className="download-item">
                    <div className="download-icon" style={{ color: subjects.find(s => s.id === selectedSubject)?.color }}>
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="download-info">
                      <h4>{textbook.name}</h4>
                      <p>Official curriculum textbook</p>
                      <small><i className="fas fa-book"></i> PDF Textbook</small>
                    </div>
                    <a 
                      href={textbook.url} 
                      download
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fas fa-download"></i> {t('download') || 'Download'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {getTotalDownloaded() > 0 && (
            <div className="section">
              <h2><i className="fas fa-folder"></i> {t('myDownloads') || 'My Downloads'}</h2>
              <div className="downloads-list">
                {Object.entries(offlineContent).map(([subjectId, contents]) => 
                  contents.map(content => {
                    const subject = subjects.find(s => s.id === parseInt(subjectId))
                    return (
                      <div key={content.id} className="download-item">
                        <div className="download-icon" style={{ color: subject?.color }}>
                          <i className={subject?.icon || 'fas fa-book'}></i>
                        </div>
                        <div className="download-info">
                          <h4>{content.subjectName}</h4>
                          <p>{content.resources} {t('resources') || 'resources'} • {content.size}</p>
                          <small>{t('downloadedOn') || 'Downloaded on'}: {new Date(content.downloadedAt).toLocaleDateString()}</small>
                        </div>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleRemove(subjectId, content.id)}
                        >
                          <i className="fas fa-trash"></i> {t('remove') || 'Remove'}
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {!isOnline && (
          <div className="offline-notice">
            <i className="fas fa-info-circle"></i>
            <p>{t('offlineNotice') || 'You are currently offline. You can access your downloaded content but cannot download new materials.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OfflineResources
