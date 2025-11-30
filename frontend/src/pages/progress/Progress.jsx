import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { progressService } from '../../services/progressService'
import { activityService } from '../../services/activityService'
import { quizService } from '../../services/quizService'
import { getAllSubjects } from '../../data/subjects'
import { useLanguage } from '../../contexts/LanguageContext'

const Progress = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    const loadData = () => {
      if (user) {
        const overallProgress = progressService.getOverallProgress(user.id)
        const completedModules = progressService.getCompletedModules(user.id)
        const recentActivities = activityService.getRecentActivities(user.id, 10)
        const userProgress = progressService.getProgress(user.id)
        const subjects = getAllSubjects()
        
        // Get quiz results
        const quizResults = quizService.getUserResults(user.id)
        const quizAverage = quizResults.length > 0 
          ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
          : 0
        
        // Get subjects with progress
        const subjectsWithProgress = subjects.map(subject => ({
          ...subject,
          progress: userProgress[subject.id] || 0
        })).filter(s => s.progress > 0)

        setData({
          overallProgress,
          completedModules,
          recentActivities,
          subjectsWithProgress,
          quizResults,
          quizAverage
        })
      }
    }
    
    loadData()
    
    // Refresh when window gains focus
    const handleFocus = () => loadData()
    window.addEventListener('focus', handleFocus)
    
    return () => window.removeEventListener('focus', handleFocus)
  }, [user])

  if (!data) return <div>{t('loading')}</div>

  return (
    <div className="progress-page">
      <div className="container">
        <h1>{t('myProgress')}</h1>
        <p>{t('trackLearningJourney')}</p>

        <div className="progress-stats">
          <div className="stat-card">
            <h3>{t('overallProgress')}</h3>
            <div className="big-number">{data.overallProgress}%</div>
          </div>
          <div className="stat-card">
            <h3>{t('completedSubjects')}</h3>
            <div className="big-number">{data.completedModules}</div>
          </div>
          <div className="stat-card">
            <h3>{t('activeSubjects')}</h3>
            <div className="big-number">{data.subjectsWithProgress.length}</div>
          </div>
          <div className="stat-card">
            <h3>Quiz Average</h3>
            <div className="big-number">{data.quizAverage || 0}%</div>
            {data.quizResults.length > 0 && (
              <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                {data.quizResults.length} quiz{data.quizResults.length !== 1 ? 'zes' : ''} taken
              </small>
            )}
          </div>
        </div>

        {data.quizResults.length > 0 && (
          <div className="subjects-progress">
            <h2><i className="fas fa-clipboard-check"></i> Quiz Progress</h2>
            <div className="subjects-progress-list">
              {data.quizResults.map((result, index) => {
                const quiz = quizService.getQuizById(result.quizId)
                return (
                  <div key={result.id} className="subject-progress-item">
                    <div className="subject-info">
                      <div className="subject-icon-small" style={{ color: result.score >= 70 ? '#4CAF50' : '#FF9800' }}>
                        <i className="fas fa-clipboard-list"></i>
                      </div>
                      <div>
                        <strong>{quiz?.title || `Quiz ${index + 1}`}</strong>
                        <p>{quiz?.subjectName} - {new Date(result.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="quiz-result-badge">
                      <span className="result-score">{result.score}%</span>
                      <span className="result-points">{result.correctCount}/{result.totalQuestions}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {data.subjectsWithProgress.length > 0 && (
          <div className="subjects-progress">
            <h2>{t('subjectProgress')}</h2>
            <div className="subjects-progress-list">
              {data.subjectsWithProgress.map(subject => (
                <div key={subject.id} className="subject-progress-item">
                  <div className="subject-info">
                    <div className="subject-icon-small" style={{ color: subject.color }}>
                      <i className={subject.icon}></i>
                    </div>
                    <div>
                      <strong>{t(subject.nameKey)}</strong>
                      <p>{subject.progress}% {t('complete')}</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="recent-activity">
          <h2>{t('recentActivity')}</h2>
          {data.recentActivities.length === 0 ? (
            <div className="no-activity">
              <i className="fas fa-inbox"></i>
              <p>{t('noActivitiesYet')}</p>
            </div>
          ) : (
            <div className="activity-list">
              {data.recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <i className={`fas fa-${activity.type === 'start' ? 'play-circle' : activity.type === 'progress' ? 'book-open' : 'trophy'}`}></i>
                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.subjectName} - {activityService.getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Progress
