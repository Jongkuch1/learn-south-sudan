import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { accessibilityService } from './services/accessibilityService'
import { performanceService } from './services/performanceService'
import './styles/global.css'
import './styles/accessibility.css'
import './styles/settings.css'
import './styles/offline.css'
import './styles/messaging.css'

// Initialize accessibility and performance services
accessibilityService.initialize()
performanceService.autoDetectBandwidth()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
