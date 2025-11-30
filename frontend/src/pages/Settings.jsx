import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { performanceService } from '../services/performanceService'
import { accessibilityService } from '../services/accessibilityService'

const Settings = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('performance')
  const [perfSettings, setPerfSettings] = useState(performanceService.getSettings())
  const [a11ySettings, setA11ySettings] = useState(accessibilityService.getSettings())
  const [connectionSpeed, setConnectionSpeed] = useState('checking...')
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    checkConnection()
    loadMetrics()
  }, [])

  const checkConnection = async () => {
    const speed = await performanceService.checkConnectionSpeed()
    setConnectionSpeed(speed)
  }

  const loadMetrics = () => {
    const m = performanceService.getMetrics()
    setMetrics(m)
  }

  const handlePerfChange = (key, value) => {
    const updated = { ...perfSettings, [key]: value }
    setPerfSettings(updated)
    performanceService.saveSettings(updated)
  }

  const handleA11yChange = (key, value) => {
    const updated = { ...a11ySettings, [key]: value }
    setA11ySettings(updated)
    accessibilityService.saveSettings(updated)
  }

  const enableLowBandwidth = () => {
    performanceService.enableLowBandwidthMode()
    setPerfSettings(performanceService.getSettings())
  }

  const disableLowBandwidth = () => {
    performanceService.disableLowBandwidthMode()
    setPerfSettings(performanceService.getSettings())
  }

  if (!user) return <div className="container"><p>Loading...</p></div>

  return (
    <div className="settings-page">
      <div className="container">
        <h1>{t('settings')}</h1>
        
        <div className="settings-tabs">
          <button 
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
          >
            <i className="fas fa-tachometer-alt"></i> Performance
          </button>
          <button 
            className={activeTab === 'accessibility' ? 'active' : ''}
            onClick={() => setActiveTab('accessibility')}
          >
            <i className="fas fa-universal-access"></i> Accessibility
          </button>
        </div>

        {activeTab === 'performance' && (
          <div className="settings-section">
            <h2>Performance Settings</h2>
            <p>Optimize the platform for your connection speed</p>

            <div className="settings-card">
              <h3>Connection Status</h3>
              <div className="status-info">
                <p><strong>Speed:</strong> <span className={`status-${connectionSpeed}`}>{connectionSpeed}</span></p>
                {metrics && (
                  <>
                    <p><strong>Page Load Time:</strong> {metrics.pageLoadTime ? `${metrics.pageLoadTime.toFixed(2)}s` : 'N/A'}</p>
                    <p><strong>Cache Size:</strong> {metrics.cacheSize}</p>
                  </>
                )}
              </div>
              <button className="btn btn-secondary" onClick={checkConnection}>
                <i className="fas fa-sync"></i> Check Connection
              </button>
            </div>

            <div className="settings-card">
              <h3>Low Bandwidth Mode</h3>
              <p>Reduces data usage for slower connections</p>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={perfSettings.lowBandwidthMode}
                    onChange={(e) => e.target.checked ? enableLowBandwidth() : disableLowBandwidth()}
                  />
                  <span className="slider"></span>
                </label>
                <span>{perfSettings.lowBandwidthMode ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="settings-card">
              <h3>Image Quality</h3>
              <select 
                value={perfSettings.imageQuality}
                onChange={(e) => handlePerfChange('imageQuality', e.target.value)}
                className="form-control"
              >
                <option value="low">Low (Faster)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Slower)</option>
              </select>
            </div>

            <div className="settings-card">
              <h3>Auto-play Videos</h3>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={perfSettings.autoPlayVideos}
                    onChange={(e) => handlePerfChange('autoPlayVideos', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span>{perfSettings.autoPlayVideos ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="settings-card">
              <h3>Content Caching</h3>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={perfSettings.cacheEnabled}
                    onChange={(e) => handlePerfChange('cacheEnabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span>{perfSettings.cacheEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="settings-section">
            <h2>Accessibility Settings</h2>
            <p>Customize the platform for your needs (WCAG 2.1 AA)</p>

            <div className="settings-card">
              <h3>High Contrast Mode</h3>
              <p>Increases contrast for better visibility</p>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={a11ySettings.highContrast}
                    onChange={(e) => handleA11yChange('highContrast', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span>{a11ySettings.highContrast ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="settings-card">
              <h3>Font Size</h3>
              <select 
                value={a11ySettings.fontSize}
                onChange={(e) => handleA11yChange('fontSize', e.target.value)}
                className="form-control"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </select>
            </div>

            <div className="settings-card">
              <h3>Reduced Motion</h3>
              <p>Minimizes animations and transitions</p>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={a11ySettings.reducedMotion}
                    onChange={(e) => handleA11yChange('reducedMotion', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span>{a11ySettings.reducedMotion ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="settings-card">
              <h3>Keyboard Navigation</h3>
              <p>Enhanced keyboard navigation support</p>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={a11ySettings.keyboardNavigation}
                    onChange={(e) => handleA11yChange('keyboardNavigation', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span>{a11ySettings.keyboardNavigation ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="settings-card">
              <h3>Focus Indicators</h3>
              <p>Shows clear focus outlines for navigation</p>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={a11ySettings.focusIndicators}
                    onChange={(e) => handleA11yChange('focusIndicators', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span>{a11ySettings.focusIndicators ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="settings-card">
              <h3>Screen Reader Support</h3>
              <p>Optimized for screen reader users</p>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={a11ySettings.screenReader}
                    onChange={(e) => handleA11yChange('screenReader', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span>{a11ySettings.screenReader ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
