import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { getAllSubjects } from '../data/subjects'

const Home = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroSubtitle')}</p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">{t('goToDashboard')}</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">{t('signUp')}</Link>
                  <Link to="/login" className="btn btn-secondary">{t('signIn')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="subjects-preview">
        <div className="container">
          <h2 className="section-title">{t('curriculumTitle')}</h2>
          <p className="section-subtitle">{t('curriculumSubtitle')}</p>
          <div className="curriculum-sections">
            <div className="curriculum-section">
              <h3>{t('compulsorySubjectsCount')}</h3>
              <p>{t('compulsorySubjectsList')}</p>
            </div>
            <div className="curriculum-section">
              <h3>{t('scienceSectionCount')}</h3>
              <p>{t('scienceSectionList')}</p>
            </div>
            <div className="curriculum-section">
              <h3>{t('artsSectionCount')}</h3>
              <p>{t('artsSectionList')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">{t('featuresTitle')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-user-graduate"></i></div>
              <h3>{t('personalizedLearning')}</h3>
              <p>{t('personalizedLearningDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-chalkboard-teacher"></i></div>
              <h3>{t('expertTutoring')}</h3>
              <p>{t('expertTutoringDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-wifi"></i></div>
              <h3>{t('offlineAccess')}</h3>
              <p>{t('offlineAccessDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-language"></i></div>
              <h3>{t('multiLanguage')}</h3>
              <p>{t('multiLanguageDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSubtitle')}</p>
          {user ? (
            <Link to="/dashboard" className="btn btn-large btn-accent">{t('continueLearning')}</Link>
          ) : (
            <Link to="/register" className="btn btn-large btn-accent">{t('signUp')}</Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
