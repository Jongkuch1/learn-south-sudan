import React, { useState, useEffect } from 'react'
import { youtubeService } from '../../services/youtubeService'
import { useLanguage } from '../../contexts/LanguageContext'

const EnglishTopics = ({ user }) => {
  const { t } = useLanguage()
  const [selectedTopic, setSelectedTopic] = useState('introduction')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [channelInfo, setChannelInfo] = useState(null)

  const englishTopics = [
    { id: 'introduction', name: 'Introduction', icon: 'fas fa-play-circle' },
    { id: 'grammar', name: 'Grammar', icon: 'fas fa-spell-check' },
    { id: 'writing-skills', name: 'Writing Skills', icon: 'fas fa-pen' },
    { id: 'reading-comprehension', name: 'Reading Comprehension', icon: 'fas fa-book-reader' },
    { id: 'vocabulary', name: 'Vocabulary', icon: 'fas fa-language' },
    { id: 'speaking', name: 'Speaking', icon: 'fas fa-microphone' },
    { id: 'listening', name: 'Listening', icon: 'fas fa-headphones' },
    { id: 'literature', name: 'Literature', icon: 'fas fa-book-open' },
    { id: 'essay-writing', name: 'Essay Writing', icon: 'fas fa-edit' },
    { id: 'review', name: 'Review', icon: 'fas fa-clipboard-check' }
  ]

  useEffect(() => {
    loadTopicVideos(selectedTopic)
    loadChannelInfo()
  }, [selectedTopic])

  const loadChannelInfo = async () => {
    const info = await youtubeService.getChannelInfo('UCz4tgANd4yy8Oe0iXCdSWfA')
    setChannelInfo(info)
  }

  const loadTopicVideos = async (topic) => {
    setLoading(true)
    try {
      const videoList = await youtubeService.searchVideos(2, 6, topic) // Subject ID 2 = English
      setVideos(videoList)
      if (videoList.length > 0) {
        setSelectedVideo(videoList[0])
      }
    } catch (error) {
      console.error('Error loading topic videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentTopic = englishTopics.find(t => t.id === selectedTopic)

  return (
    <div className="english-topics-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-language"></i>
          English Language Topics
        </h2>
        <p>Explore specific English topics with curated video content</p>
        {channelInfo && (
          <div className="channel-info">
            <div className="channel-badge">
              <i className="fab fa-youtube"></i>
              <span>Powered by <strong>English with Lucy</strong></span>
              <span className="subscriber-count">
                {youtubeService.formatViewCount(parseInt(channelInfo.statistics.subscriberCount))} subscribers
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="topics-grid">
        {englishTopics.map(topic => (
          <button
            key={topic.id}
            className={`topic-card ${selectedTopic === topic.id ? 'active' : ''}`}
            onClick={() => setSelectedTopic(topic.id)}
          >
            <i className={topic.icon}></i>
            <span>{topic.name}</span>
          </button>
        ))}
      </div>

      <div className="topic-videos-container">
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading {currentTopic?.name} videos...</p>
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
                  <div className="topic-badge">
                    <i className={currentTopic?.icon}></i>
                    {currentTopic?.name}
                  </div>
                </div>
              </div>
            )}

            <div className="video-list">
              <h4>More {currentTopic?.name} Videos</h4>
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
    </div>
  )
}

export default EnglishTopics