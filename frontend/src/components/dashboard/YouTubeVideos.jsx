import React, { useState, useEffect } from 'react'
import { youtubeService } from '../../services/youtubeService'
import { getAllSubjects } from '../../data/subjects'
import { useLanguage } from '../../contexts/LanguageContext'

const YouTubeVideos = ({ user }) => {
  const { t } = useLanguage()
  const [selectedSubject, setSelectedSubject] = useState(1)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  
  const subjects = getAllSubjects()

  useEffect(() => {
    loadVideos(selectedSubject)
  }, [selectedSubject])

  const loadVideos = async (subjectId) => {
    setLoading(true)
    try {
      const videoList = await youtubeService.searchVideos(subjectId, 6)
      setVideos(videoList)
      if (videoList.length > 0) {
        setSelectedVideo(videoList[0])
      }
    } catch (error) {
      console.error('Error loading videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId)
    setSelectedVideo(null)
  }

  const currentSubject = subjects.find(s => s.id === selectedSubject)

  return (
    <div className="youtube-videos-section">
      <div className="section-header">
        <h2>
          <i className="fab fa-youtube"></i>
          {t('educationalVideos') || 'Educational Videos'}
        </h2>
        <p>{t('watchCurriculumVideos') || 'Watch curriculum-aligned videos for your subjects'}</p>
      </div>

      <div className="subject-selector">
        <div className="subject-tabs">
          {subjects.slice(0, 8).map(subject => (
            <button
              key={subject.id}
              className={`subject-tab ${selectedSubject === subject.id ? 'active' : ''}`}
              onClick={() => handleSubjectChange(subject.id)}
              style={{ borderColor: subject.color }}
            >
              <i className={subject.icon}></i>
              <span>{t(subject.nameKey) || subject.name}</span>
            </button>
          ))}
        </div>
        
        {subjects.length > 8 && (
          <select 
            className="subject-dropdown"
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(parseInt(e.target.value))}
          >
            {subjects.slice(8).map(subject => (
              <option key={subject.id} value={subject.id}>
                {t(subject.nameKey) || subject.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="videos-container">
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>{t('loadingVideos') || 'Loading videos...'}</p>
          </div>
        ) : (
          <>
            {selectedVideo && (
              <div className="main-video">
                <div className="video-player">
                  <iframe
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
                <div className="video-info">
                  <h3>{selectedVideo.title}</h3>
                  <p className="channel-name">
                    <i className="fas fa-user-circle"></i>
                    {selectedVideo.channelTitle}
                  </p>
                  <p className="video-description">{selectedVideo.description}</p>
                </div>
              </div>
            )}

            <div className="video-list">
              <h4>
                {t('moreVideosFor') || 'More videos for'} {currentSubject?.name}
              </h4>
              <div className="video-grid">
                {videos.map(video => (
                  <div
                    key={video.id}
                    className={`video-card ${selectedVideo?.id === video.id ? 'active' : ''}`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                      <div className="play-overlay">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                    <div className="video-details">
                      <h5>{video.title}</h5>
                      <p className="channel">{video.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {videos.length === 0 && !loading && (
        <div className="no-videos">
          <i className="fab fa-youtube"></i>
          <h3>{t('noVideosFound') || 'No videos found'}</h3>
          <p>{t('tryDifferentSubject') || 'Try selecting a different subject'}</p>
        </div>
      )}
    </div>
  )
}

export default YouTubeVideos