// Performance optimization service for low-bandwidth conditions (NFR01)
const PERFORMANCE_KEY = 'ssplp_performance_settings'

export const performanceService = {
  // Get performance settings
  getSettings: () => {
    const stored = localStorage.getItem(PERFORMANCE_KEY)
    return stored ? JSON.parse(stored) : {
      lowBandwidthMode: false,
      imageQuality: 'high',
      autoPlayVideos: true,
      prefetchContent: true,
      cacheEnabled: true
    }
  },

  // Save performance settings
  saveSettings: (settings) => {
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(settings))
  },

  // Enable low bandwidth mode
  enableLowBandwidthMode: () => {
    const settings = performanceService.getSettings()
    settings.lowBandwidthMode = true
    settings.imageQuality = 'low'
    settings.autoPlayVideos = false
    settings.prefetchContent = false
    performanceService.saveSettings(settings)
  },

  // Disable low bandwidth mode
  disableLowBandwidthMode: () => {
    const settings = performanceService.getSettings()
    settings.lowBandwidthMode = false
    settings.imageQuality = 'high'
    settings.autoPlayVideos = true
    settings.prefetchContent = true
    performanceService.saveSettings(settings)
  },

  // Measure page load time
  measurePageLoad: () => {
    if (window.performance && window.performance.timing) {
      const perfData = window.performance.timing
      if (perfData.loadEventEnd && perfData.navigationStart) {
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
        return pageLoadTime / 1000
      }
    }
    if (window.performance && window.performance.getEntriesByType) {
      const navTiming = window.performance.getEntriesByType('navigation')[0]
      if (navTiming) {
        return navTiming.loadEventEnd / 1000
      }
    }
    return null
  },

  // Check connection speed
  checkConnectionSpeed: async () => {
    if (!navigator.onLine) return 'offline'
    
    const startTime = performance.now()
    try {
      const response = await fetch('/favicon.ico', { 
        cache: 'no-store',
        method: 'HEAD'
      })
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (duration < 100) return 'fast'
      if (duration < 300) return 'medium'
      return 'slow'
    } catch (error) {
      return 'offline'
    }
  },

  // Auto-detect and enable low bandwidth mode
  autoDetectBandwidth: async () => {
    const speed = await performanceService.checkConnectionSpeed()
    if (speed === 'slow' || speed === 'offline') {
      performanceService.enableLowBandwidthMode()
      return true
    }
    return false
  },

  // Lazy load images
  lazyLoadImage: (imgElement) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            observer.unobserve(img)
          }
        })
      })
      observer.observe(imgElement)
    } else {
      imgElement.src = imgElement.dataset.src
    }
  },

  // Compress data before storing
  compressData: (data) => {
    try {
      return JSON.stringify(data)
    } catch (error) {
      console.error('Compression error:', error)
      return data
    }
  },

  // Get performance metrics
  getMetrics: () => {
    const loadTime = performanceService.measurePageLoad()
    const settings = performanceService.getSettings()
    
    return {
      pageLoadTime: loadTime,
      lowBandwidthMode: settings.lowBandwidthMode,
      cacheSize: performanceService.getCacheSize(),
      timestamp: new Date().toISOString()
    }
  },

  // Get cache size
  getCacheSize: () => {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return (total / 1024).toFixed(2) + ' KB'
  }
}
