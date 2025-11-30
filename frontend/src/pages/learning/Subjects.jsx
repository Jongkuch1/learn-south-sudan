import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { subjects, getAllSubjects } from '../../data/subjects'
import { progressService } from '../../services/progressService'
import { quizService } from '../../services/quizService'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Subjects = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [progress, setProgress] = useState({})
  const [activeTab, setActiveTab] = useState('subjects')
  const [quizzes, setQuizzes] = useState([])
  const [completedQuizzes, setCompletedQuizzes] = useState([])
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    if (user) {
      const userProgress = progressService.getProgress(user.id)
      setProgress(userProgress)
      const allQuizzes = quizService.getAllQuizzes()
      const results = quizService.getUserResults(user.id)
      setQuizzes(allQuizzes)
      setCompletedQuizzes(results)
      try {
        const tutoringService = require('../../services/tutoringService').tutoringService
        const userSessions = tutoringService.getUserSessions(user.id, user.role)
        setSessions(userSessions)
      } catch (error) {
        console.error('Error loading sessions:', error)
        setSessions([])
      }
    }
  }, [user])

  const getFilteredSubjects = () => {
    // Teachers only see their assigned subjects
    if (user?.role === 'teacher' && user?.subjects && user.subjects.length > 0) {
      return {
        compulsory: subjects.compulsory.filter(s => user.subjects.includes(s.id)),
        science: subjects.science.filter(s => user.subjects.includes(s.id)),
        arts: subjects.arts.filter(s => user.subjects.includes(s.id))
      }
    }
    // Students and admins see all subjects
    return subjects
  }

  const filteredSubjects = getFilteredSubjects()

  // Show message if teacher has no subjects assigned
  if (user?.role === 'teacher' && (!user?.subjects || user.subjects.length === 0)) {
    return (
      <div className="subjects-page">
        <div className="container">
          <div className="no-data" style={{ marginTop: '50px', textAlign: 'center' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '48px', color: '#ff6b6b' }}></i>
            <h2>No Subjects Assigned</h2>
            <p>You haven&apos;t been assigned any teaching subjects yet.</p>
            <p>Please contact the administrator.</p>
          </div>
        </div>
      </div>
    )
  }

  const isCompleted = (quizId) => {
    return completedQuizzes.some(r => r.quizId === quizId)
  }

  const getQuizScore = (quizId) => {
    const result = completedQuizzes.find(r => r.quizId === quizId)
    return result ? result.score : null
  }

  if (!user) return <div className="container"><p>Loading...</p></div>

  return (
    <div className="subjects-page">
      <div className="container">
        <div className="page-tabs">
          {user.role === 'student' && (
            <button 
              className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              <i className="fas fa-book"></i> {t('mySubjects')}
            </button>
          )}
          {user.role === 'teacher' && (
            <>
            <button 
              className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              <i className="fas fa-book"></i> {t('mySubjects')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <i className="fas fa-clipboard-list"></i> {t('quizzes')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tutoring' ? 'active' : ''}`}
              onClick={() => setActiveTab('tutoring')}
            >
              <i className="fas fa-video"></i> {t('virtualTutoring')}
            </button>
            </>
          )}
        </div>

        {activeTab === 'subjects' ? (
        <>
        <h1>{t('mySubjects')}</h1>
        <p>{t('southSudanCurriculum')}</p>

        {filteredSubjects.compulsory.length > 0 && (
        <div className="subject-category">
          <h2 className="category-title">{t('compulsorySubjects')}</h2>
          <div className="subjects-grid">
            {filteredSubjects.compulsory.map(subject => (
              <Link key={subject.id} to={`/subjects/${subject.id}`} className="subject-card">
                <div className="subject-icon" style={{ color: subject.color }}>
                  <i className={subject.icon}></i>
                </div>
                <h3>{t(subject.nameKey)}</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress[subject.id] || 0}%`, backgroundColor: subject.color }}></div>
                </div>
                <p>{progress[subject.id] || 0}% {t('complete')}</p>
              </Link>
            ))}
          </div>
        </div>
        )}

        {filteredSubjects.science.length > 0 && (
        <div className="subject-category">
          <h2 className="category-title">{t('scienceSection')}</h2>
          <div className="subjects-grid">
            {filteredSubjects.science.map(subject => (
              <Link key={subject.id} to={`/subjects/${subject.id}`} className="subject-card">
                <div className="subject-icon" style={{ color: subject.color }}>
                  <i className={subject.icon}></i>
                </div>
                <h3>{t(subject.nameKey)}</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress[subject.id] || 0}%`, backgroundColor: subject.color }}></div>
                </div>
                <p>{progress[subject.id] || 0}% {t('complete')}</p>
              </Link>
            ))}
          </div>
        </div>
        )}

        {filteredSubjects.arts.length > 0 && (
        <div className="subject-category">
          <h2 className="category-title">{t('artsSection')}</h2>
          <div className="subjects-grid">
            {filteredSubjects.arts.map(subject => (
              <Link key={subject.id} to={`/subjects/${subject.id}`} className="subject-card">
                <div className="subject-icon" style={{ color: subject.color }}>
                  <i className={subject.icon}></i>
                </div>
                <h3>{t(subject.nameKey)}</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress[subject.id] || 0}%`, backgroundColor: subject.color }}></div>
                </div>
                <p>{progress[subject.id] || 0}% {t('complete')}</p>
              </Link>
            ))}
          </div>
        </div>
        )}
        </>
        ) : activeTab === 'quizzes' ? (
          <div className="quizzes-content">
            <h1>{t('quizzes')}</h1>
            <p>Test your knowledge with quizzes</p>

            {quizzes.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-clipboard-list"></i>
                <p>No quizzes available yet</p>
              </div>
            ) : (
              <div className="resources-grid">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="quiz-card">
                    <h3>{quiz.title}</h3>
                    <p className="quiz-teacher">By: {quiz.teacherName}</p>
                    <div className="quiz-meta">
                      <span><i className="fas fa-book"></i> {quiz.subject}</span>
                      <span><i className="fas fa-question-circle"></i> {quiz.questions.length} questions</span>
                      <span><i className="fas fa-clock"></i> {quiz.timeLimit} min</span>
                    </div>
                    {isCompleted(quiz.id) ? (
                      <div>
                        <div className="completed-badge">
                          <i className="fas fa-check-circle"></i> Completed
                        </div>
                        <div className="quiz-score">
                          <span>Your Score:</span>
                          <strong>{getQuizScore(quiz.id)}%</strong>
                        </div>
                      </div>
                    ) : (
                      <button className="btn btn-primary" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                        {t('takeQuiz')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'tutoring' ? (
          <div className="tutoring-content">
            <h1>{t('virtualTutoring')}</h1>
            <p>Schedule and manage your tutoring sessions</p>

            {sessions.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-video-slash"></i>
                <p>{t('noSessionsScheduled')}</p>
              </div>
            ) : (
              <div className="sessions-list">
                {sessions.map(session => (
                  <div key={session.id} className={`session-card ${session.status}`}>
                    <div className="session-header">
                      <h3>{session.title}</h3>
                      <span className={`status-badge ${session.status}`}>{session.status}</span>
                    </div>
                    <div className="session-details">
                      <p><i className="fas fa-book"></i> {session.subject}</p>
                      <p><i className="fas fa-calendar"></i> {session.date}</p>
                      <p><i className="fas fa-clock"></i> {session.time} ({session.duration})</p>
                      <p><i className="fas fa-users"></i> {session.type === 'group' ? t('groupSession') : t('individualSession')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Subjects
