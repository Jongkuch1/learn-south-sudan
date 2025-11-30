import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSubjectById } from '../../data/subjects'
import { progressService } from '../../services/progressService'
import { activityService } from '../../services/activityService'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Learning = () => {
  const { t } = useLanguage()
  const { subjectId } = useParams()
  const { user } = useAuth()
  const [subject, setSubject] = useState(null)
  const [progress, setProgress] = useState(0)
  const [resourcesByTopic, setResourcesByTopic] = useState({})
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)

  useEffect(() => {
    const subjectData = getSubjectById(subjectId)
    setSubject(subjectData)
    
    if (user) {
      const userProgress = progressService.getProgress(user.id)
      setProgress(userProgress[subjectId] || 0)
    }
    
    // Load teacher-uploaded resources only
    if (subjectData) {
      const allResources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]')
      const subjectResources = allResources.filter(resource => 
        resource.subject === subjectData.id.toString()
      )
      
      // Add English grammar playlist if subject is English
      if (subjectData.id === 2) {
        subjectResources.push({
          id: 'english-grammar-playlist',
          title: 'English Grammar Complete Course',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=O-6q-siuMik&list=PL6CQ7apI_8PjSBN8BxukW5Z76k8lRMQEf',
          description: 'Complete English grammar video series covering all essential topics',
          subject: '2',
          topic: 'Grammar',
          teacherName: 'SSPLP',
          uploadedAt: new Date().toISOString()
        })
      }
      
      // Group resources by topic (if topic field exists) or create a general topic
      const grouped = {}
      if (subjectResources.length > 0) {
        subjectResources.forEach(resource => {
          const topic = resource.topic || 'General Resources'
          if (!grouped[topic]) {
            grouped[topic] = []
          }
          grouped[topic].push({
            id: resource.id,
            title: resource.title,
            type: resource.type,
            url: resource.url,
            description: resource.description,
            teacherName: resource.teacherName,
            uploadedAt: resource.uploadedAt
          })
        })
      }
      
      setResourcesByTopic(grouped)
    }
  }, [subjectId, user])

  const getAllResources = () => {
    const allRes = []
    Object.keys(resourcesByTopic).forEach(topic => {
      resourcesByTopic[topic].forEach(res => {
        allRes.push({ ...res, topic })
      })
    })
    return allRes
  }

  const handleResourceClick = (resource) => {
    setSelectedResource(resource)
    
    if (user && subject) {
      const isFirstTime = progress === 0
      const newProgress = Math.min(progress + 10, 100)
      progressService.updateProgress(user.id, subject.id, newProgress)
      setProgress(newProgress)
      
      if (isFirstTime) {
        activityService.addActivity(user.id, {
          type: 'start',
          title: `Started ${subject.name}`,
          subjectName: subject.name,
          subjectId: subject.id
        })
      } else if (newProgress === 100) {
        activityService.addActivity(user.id, {
          type: 'complete',
          title: `Completed ${subject.name}`,
          subjectName: subject.name,
          subjectId: subject.id
        })
      }
    }
  }

  const handleNextLesson = () => {
    const allResources = getAllResources()
    const currentIndex = allResources.findIndex(r => r.id === selectedResource.id)
    if (currentIndex < allResources.length - 1) {
      handleResourceClick(allResources[currentIndex + 1])
    }
  }

  const handlePreviousLesson = () => {
    const allResources = getAllResources()
    const currentIndex = allResources.findIndex(r => r.id === selectedResource.id)
    if (currentIndex > 0) {
      handleResourceClick(allResources[currentIndex - 1])
    }
  }

  const handleDownload = (resource) => {
    if (resource.url.startsWith('data:')) {
      // Handle base64 file download
      const link = document.createElement('a')
      link.href = resource.url
      link.download = resource.fileName || `${resource.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Handle external URL
      window.open(resource.url, '_blank')
    }
  }

  if (!subject) return <div>{t('loading')}</div>

  return (
    <div className="learning-page">
      <div className="container">
        <div className="learning-header">
          <div className="subject-icon-large" style={{ color: subject.color }}>
            <i className={subject.icon}></i>
          </div>
          <h1>{subject.name}</h1>
          <p className="subject-category">{subject.category.toUpperCase()} Section</p>
        </div>

        <div className="progress-section">
          <h3>Your Progress</h3>
          <div className="progress-bar-large">
            <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: subject.color }}></div>
          </div>
          <p>{progress}% Complete</p>
        </div>

        <div className="learning-content">
          {selectedResource ? (
            <div className="video-player-section">
              <button className="btn btn-secondary" onClick={() => setSelectedResource(null)}>
                <i className="fas fa-arrow-left"></i> {t('backToResources')}
              </button>
              <div className="video-player">
                {selectedResource.type === 'video' ? (
                  <div className="video-link-viewer">
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <i className="fas fa-play-circle" style={{ fontSize: '80px', color: subject.color, marginBottom: '20px' }}></i>
                      <h3 style={{ marginBottom: '15px' }}>{selectedResource.title}</h3>
                      <p style={{ color: '#666', marginBottom: '25px' }}>{selectedResource.description}</p>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => window.open(selectedResource.url.replace('/embed/', '/watch?v='), '_blank')}
                        style={{ padding: '12px 30px', fontSize: '16px' }}
                      >
                        <i className="fas fa-external-link-alt"></i> Watch Video on YouTube
                      </button>
                      <p style={{ marginTop: '15px', fontSize: '14px', color: '#999' }}>
                        Video will open in a new tab
                      </p>
                    </div>
                  </div>
                ) : selectedResource.type === 'document' ? (
                  <div className="document-viewer" style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'left' }}>
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                      <i className="fas fa-file-alt" style={{ fontSize: '60px', color: subject.color }}></i>
                      <h3 style={{ marginTop: '15px' }}>{selectedResource.title}</h3>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '15px', color: '#333' }}>
                      {selectedResource.content || selectedResource.description}
                    </div>
                  </div>
                ) : (
                  <div className="document-viewer">
                    <i className="fas fa-file"></i>
                    <h3>{selectedResource.title}</h3>
                    <p>{selectedResource.description}</p>
                  </div>
                )}
              </div>
              <div className="resource-info">
                <div>
                  <h3>{selectedResource.title}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>
                    <i className="fas fa-folder"></i> {selectedResource.topic || 'General'}
                  </p>
                  <p>{selectedResource.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handlePreviousLesson}
                    disabled={getAllResources().findIndex(r => r.id === selectedResource.id) === 0}
                  >
                    <i className="fas fa-chevron-left"></i> Previous Lesson
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleNextLesson}
                    disabled={getAllResources().findIndex(r => r.id === selectedResource.id) === getAllResources().length - 1}
                  >
                    Next Lesson <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="resources-header">
                <h2>{t('learningResources')}</h2>
              </div>
              
              {Object.keys(resourcesByTopic).length === 0 ? (
                <div className="no-resources">
                  <i className="fas fa-folder-open"></i>
                  <h3>No Resources Available</h3>
                  <p>Your teachers haven't uploaded any resources for this subject yet.</p>
                  <p>Please check back later or contact your teacher.</p>
                </div>
              ) : (
                <div className="modules-list">
                  {Object.keys(resourcesByTopic).map((topic, index) => (
                    <div key={topic} className="module-item">
                      <div className="module-header" onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}>
                        <div className="module-left">
                          <i className={`fas fa-chevron-${selectedTopic === topic ? 'down' : 'right'}`}></i>
                          <span className="module-title">{topic}</span>
                        </div>
                      </div>
                      {selectedTopic === topic && (
                        <div className="module-content">
                          <div className="resources-list">
                            {resourcesByTopic[topic].map(resource => (
                              <div key={resource.id} className="resource-item-canvas">
                                <div className="resource-icon-small">
                                  <i className={`fas fa-${resource.type === 'video' ? 'play-circle' : resource.type === 'document' ? 'file-pdf' : resource.type === 'audio' ? 'volume-up' : 'external-link-alt'}`}></i>
                                </div>
                                <div className="resource-details-canvas" style={{ flex: 1 }}>
                                  <h4>{resource.title}</h4>
                                  <p>{resource.description}</p>
                                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
                                    {resource.teacherName && (
                                      <span><i className="fas fa-user"></i> {resource.teacherName}</span>
                                    )}
                                    {resource.uploadedAt && (
                                      <span><i className="fas fa-clock"></i> {new Date(resource.uploadedAt).toLocaleDateString()}</span>
                                    )}
                                  </div>
                                </div>
                                <button 
                                  className="btn btn-primary btn-sm"
                                  style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleResourceClick(resource)
                                  }}
                                >
                                  {resource.type === 'video' && <><i className="fas fa-play"></i> Watch</>}
                                  {resource.type === 'document' && <><i className="fas fa-book-open"></i> Read</>}
                                  {resource.type === 'audio' && <><i className="fas fa-volume-up"></i> Listen</>}
                                  {resource.type === 'link' && <><i className="fas fa-external-link-alt"></i> Open</>}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              

            </>
          )}
          {progress === 100 && (
            <div className="completion-badge">
              <i className="fas fa-trophy"></i>
              <p>{t('subjectCompleted')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Learning
