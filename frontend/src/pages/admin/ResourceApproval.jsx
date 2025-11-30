import React, { useState, useEffect } from 'react'
import { resourceService } from '../../services/resourceService'

const ResourceApproval = () => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    const allResources = await resourceService.getAllResources()
    setResources(allResources)
  }

  const handleApprove = async (resourceId) => {
    await resourceService.updateResourceStatus(resourceId, 'approved')
    alert('Resource approved successfully!')
    await loadResources()
  }

  const handleReject = async (resourceId) => {
    if (window.confirm('Are you sure you want to reject this resource?')) {
      await resourceService.deleteResource(resourceId)
      alert('Resource rejected and removed.')
      await loadResources()
    }
  }

  const pendingResources = resources.filter(r => r.status === 'pending')
  const approvedResources = resources.filter(r => r.status === 'approved')

  return (
    <div className="resource-approval-page">
      <div className="container">
        <h1>Resource Approval</h1>
        <p>Review and approve teacher-uploaded resources</p>

        <div className="approval-section">
          <h2>Pending Approval ({pendingResources.length})</h2>
          {pendingResources.length === 0 ? (
            <div className="no-data">
              <i className="fas fa-check-circle"></i>
              <p>No pending resources</p>
            </div>
          ) : (
            <div className="resources-grid">
              {pendingResources.map(resource => (
                <div key={resource.id} className="resource-card pending">
                  <div className="resource-icon">
                    <i className={`fas fa-${resource.type === 'video' ? 'video' : resource.type === 'audio' ? 'headphones' : resource.type === 'link' ? 'link' : 'file-alt'}`}></i>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-meta">
                    <span className="subject-badge">{resource.subjectName}</span>
                    <span className="type-badge">{resource.type}</span>
                  </div>
                  <p className="teacher-info">By: {resource.teacherName}</p>
                  <div className="resource-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {resource.url && (
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fas fa-eye"></i> Preview
                      </a>
                    )}
                    <button 
                      className="btn btn-sm btn-success" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApprove(resource.id)
                      }}
                    >
                      <i className="fas fa-check"></i> Approve
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReject(resource.id)
                      }}
                    >
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="approval-section" style={{ marginTop: '3rem' }}>
          <h2>Approved Resources ({approvedResources.length})</h2>
          {approvedResources.length === 0 ? (
            <div className="no-data">
              <p>No approved resources yet</p>
            </div>
          ) : (
            <div className="resources-grid">
              {approvedResources.map(resource => (
                <div key={resource.id} className="resource-card approved">
                  <div className="resource-icon">
                    <i className={`fas fa-${resource.type === 'video' ? 'video' : resource.type === 'audio' ? 'headphones' : resource.type === 'link' ? 'link' : 'file-alt'}`}></i>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-meta">
                    <span className="subject-badge">{resource.subjectName}</span>
                    <span className="type-badge">{resource.type}</span>
                    <span className="status-badge approved">Approved</span>
                  </div>
                  <p className="teacher-info">By: {resource.teacherName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResourceApproval
