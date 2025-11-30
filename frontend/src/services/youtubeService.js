const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyDummy_Key_Replace_With_Real_Key'
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

// Subject-specific search terms for better video results
const subjectSearchTerms = {
  1: 'Grade 9 10 Mathematics South Sudan curriculum algebra geometry',
  2: 'Grade 9 10 English Language South Sudan grammar literature writing',
  3: 'Grade 9 10 Religion Religious Education South Sudan Christianity Islam',
  4: 'Grade 9 10 Citizenship Civics South Sudan government democracy',
  5: 'Grade 9 10 Biology South Sudan life science cells genetics',
  6: 'Grade 9 10 Physics South Sudan mechanics waves electricity',
  7: 'Grade 9 10 Chemistry South Sudan atoms molecules reactions',
  8: 'Grade 9 10 Agriculture South Sudan farming crops livestock',
  9: 'Grade 9 10 Additional Mathematics advanced algebra calculus',
  10: 'Grade 9 10 ICT Computer Science programming technology',
  11: 'Grade 9 10 History South Sudan African history world history',
  12: 'Grade 9 10 Geography South Sudan physical human geography',
  13: 'Grade 9 10 Commerce Business Studies economics trade',
  14: 'Grade 9 10 Accounting bookkeeping financial statements',
  15: 'Grade 9 10 Literature English literature poetry novels'
}

// English topic-specific search terms
const englishTopicSearchTerms = {
  'introduction': 'English Language Introduction Grade 9 10 basics fundamentals',
  'grammar': 'English Grammar Grade 9 10 tenses verbs nouns adjectives',
  'writing-skills': 'English Writing Skills Grade 9 10 essay paragraph composition',
  'reading-comprehension': 'English Reading Comprehension Grade 9 10 passages understanding',
  'vocabulary': 'English Vocabulary Grade 9 10 words meanings synonyms',
  'speaking': 'English Speaking Skills Grade 9 10 pronunciation conversation',
  'listening': 'English Listening Skills Grade 9 10 audio comprehension',
  'literature': 'English Literature Grade 9 10 poems stories novels analysis',
  'essay-writing': 'English Essay Writing Grade 9 10 structure argumentative',
  'review': 'English Review Grade 9 10 exam preparation practice'
}

class YouTubeService {
  async searchVideos(subjectId, maxResults = 10, topic = null) {
    try {
      let searchQuery
      let channelId = null
      
      if (subjectId === 2) {
        // English subject - use English with Lucy channel
        channelId = 'UCz4tgANd4yy8Oe0iXCdSWfA' // English with Lucy channel ID
        if (topic) {
          searchQuery = englishTopicSearchTerms[topic] || 'English learning'
        } else {
          searchQuery = 'English grammar vocabulary speaking'
        }
      } else {
        searchQuery = subjectSearchTerms[subjectId] || `Grade 9 10 education subject ${subjectId}`
      }
      
      let apiUrl = `${YOUTUBE_API_BASE_URL}/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `type=video&` +
        `videoDuration=medium&` +
        `videoDefinition=any&` +
        `maxResults=${maxResults}&` +
        `order=relevance&`
      
      if (channelId) {
        apiUrl += `channelId=${channelId}&`
      }
      
      apiUrl += `key=${YOUTUBE_API_KEY}`
      
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.items?.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
      })) || []
    } catch (error) {
      console.error('YouTube API Error:', error)
      return this.getFallbackVideos(subjectId)
    }
  }

  getFallbackVideos(subjectId) {
    // Fallback videos when API fails
    const fallbackVideos = {
      1: [{ // Mathematics
        id: 'demo-math-1',
        title: 'Grade 9 Mathematics - Algebra Basics',
        description: 'Learn fundamental algebra concepts for Grade 9 students',
        thumbnail: 'https://img.youtube.com/vi/demo/mqdefault.jpg',
        channelTitle: 'SSPLP Education',
        url: 'https://www.youtube.com/watch?v=demo',
        embedUrl: 'https://www.youtube.com/embed/demo'
      }],
      2: [{ // English
        id: 'demo-eng-1',
        title: 'Grade 9 English - Grammar Fundamentals',
        description: 'Essential grammar rules for Grade 9 English students',
        thumbnail: 'https://img.youtube.com/vi/demo/mqdefault.jpg',
        channelTitle: 'SSPLP Education',
        url: 'https://www.youtube.com/watch?v=demo',
        embedUrl: 'https://www.youtube.com/embed/demo'
      }]
    }
    
    return fallbackVideos[subjectId] || [{
      id: 'demo-general',
      title: 'Educational Content Coming Soon',
      description: 'Quality educational videos will be available soon',
      thumbnail: 'https://img.youtube.com/vi/demo/mqdefault.jpg',
      channelTitle: 'SSPLP Platform',
      url: '#',
      embedUrl: ''
    }]
  }

  async getVideoDetails(videoId) {
    try {
      const response = await fetch(
        `${YOUTUBE_API_BASE_URL}/videos?` +
        `part=snippet,statistics,contentDetails&` +
        `id=${videoId}&` +
        `key=${YOUTUBE_API_KEY}`
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      return data.items?.[0] || null
    } catch (error) {
      console.error('YouTube Video Details Error:', error)
      return null
    }
  }

  formatDuration(duration) {
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '0:00'
    
    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  formatViewCount(count) {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    }
    return `${count} views`
  }

  async getChannelInfo(channelId) {
    try {
      const response = await fetch(
        `${YOUTUBE_API_BASE_URL}/channels?` +
        `part=snippet,statistics&` +
        `id=${channelId}&` +
        `key=${YOUTUBE_API_KEY}`
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      return data.items?.[0] || null
    } catch (error) {
      console.error('YouTube Channel Info Error:', error)
      return null
    }
  }
}

export const youtubeService = new YouTubeService()