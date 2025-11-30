import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SSPLP</h3>
            <p>{t('platformDescription')}</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>{t('quickLinks')}</h4>
            <ul>
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/subjects">{t('learning')}</Link></li>
              <li><Link to="/tutors">{t('tutors')}</Link></li>
              <li><Link to="/progress">{t('progress')}</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>{t('contact')}</h4>
            <p><i className="fas fa-map-marker-alt"></i> Juba, South Sudan</p>
            <p><i className="fas fa-envelope"></i> info@ssplp.org</p>
            <p><i className="fas fa-phone"></i> +211 929 660 006</p>
          </div>
          
          <div className="footer-section">
            <h4>{t('dailyNewsletter')}</h4>
            <p>{t('newsletterDescription')}</p>
            {!subscribed ? (
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder={t('enterYourEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '8px', width: '100%' }}
                />
                <button
                  onClick={() => {
                    if (email) {
                      const subscribers = JSON.parse(localStorage.getItem('ssplp_newsletter_subscribers') || '[]')
                      subscribers.push({ email, date: new Date().toISOString() })
                      localStorage.setItem('ssplp_newsletter_subscribers', JSON.stringify(subscribers))
                      setSubscribed(true)
                      setEmail('')
                    }
                  }}
                  style={{ padding: '8px 16px', backgroundColor: '#87CEEB', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                >
                  {t('subscribe')}
                </button>
              </div>
            ) : (
              <p style={{ color: '#27AE60', fontWeight: 'bold' }}>
                <i className="fas fa-check-circle"></i> {t('successfullySubscribed')}
              </p>
            )}
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 SSPLP. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
