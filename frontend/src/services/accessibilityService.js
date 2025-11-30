// Accessibility service for WCAG 2.1 AA compliance (NFR03)
const ACCESSIBILITY_KEY = 'ssplp_accessibility_settings'

export const accessibilityService = {
  // Get accessibility settings
  getSettings: () => {
    const stored = localStorage.getItem(ACCESSIBILITY_KEY)
    return stored ? JSON.parse(stored) : {
      highContrast: false,
      fontSize: 'medium',
      screenReader: false,
      keyboardNavigation: true,
      reducedMotion: false,
      focusIndicators: true,
      altTextEnabled: true
    }
  },

  // Save accessibility settings
  saveSettings: (settings) => {
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(settings))
    accessibilityService.applySettings(settings)
  },

  // Apply accessibility settings to DOM
  applySettings: (settings) => {
    const root = document.documentElement

    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Font size
    root.setAttribute('data-font-size', settings.fontSize)

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }
  },

  // Enable high contrast mode
  enableHighContrast: () => {
    const settings = accessibilityService.getSettings()
    settings.highContrast = true
    accessibilityService.saveSettings(settings)
  },

  // Set font size
  setFontSize: (size) => {
    const settings = accessibilityService.getSettings()
    settings.fontSize = size // 'small', 'medium', 'large', 'x-large'
    accessibilityService.saveSettings(settings)
  },

  // Enable screen reader support
  enableScreenReader: () => {
    const settings = accessibilityService.getSettings()
    settings.screenReader = true
    accessibilityService.saveSettings(settings)
  },

  // Add ARIA labels to elements
  addAriaLabel: (element, label) => {
    if (element) {
      element.setAttribute('aria-label', label)
    }
  },

  // Add ARIA live region
  addLiveRegion: (element, politeness = 'polite') => {
    if (element) {
      element.setAttribute('aria-live', politeness)
      element.setAttribute('aria-atomic', 'true')
    }
  },

  // Check color contrast ratio
  checkContrast: (foreground, background) => {
    // Simplified contrast check
    const getLuminance = (color) => {
      const rgb = parseInt(color.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = (rgb >> 0) & 0xff
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return {
      ratio: ratio.toFixed(2),
      passAA: ratio >= 4.5,
      passAAA: ratio >= 7
    }
  },

  // Enable keyboard navigation
  enableKeyboardNav: () => {
    document.addEventListener('keydown', (e) => {
      // Tab navigation
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav')
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]')
        modals.forEach(modal => modal.style.display = 'none')
      }
    })

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav')
    })
  },

  // Add skip to main content link
  addSkipLink: () => {
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.className = 'skip-link'
    skipLink.textContent = 'Skip to main content'
    skipLink.setAttribute('tabindex', '0')
    document.body.insertBefore(skipLink, document.body.firstChild)
  },

  // Announce to screen readers
  announce: (message, priority = 'polite') => {
    const announcer = document.getElementById('aria-announcer') || (() => {
      const div = document.createElement('div')
      div.id = 'aria-announcer'
      div.setAttribute('aria-live', priority)
      div.setAttribute('aria-atomic', 'true')
      div.className = 'sr-only'
      document.body.appendChild(div)
      return div
    })()
    
    announcer.textContent = message
    setTimeout(() => announcer.textContent = '', 1000)
  },

  // Initialize accessibility features
  initialize: () => {
    const settings = accessibilityService.getSettings()
    accessibilityService.applySettings(settings)
    accessibilityService.enableKeyboardNav()
    accessibilityService.addSkipLink()
  }
}
