import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { quizService } from '../../services/quizService'
import { useAuth } from '../../contexts/AuthContext'

const StudentQuizzes = () => {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [userResults, setUserResults] = useState([])

  useEffect(() => {
    const loadData = () => {
      const allQuizzes = quizService.getAllQuizzes()
      setQuizzes(allQuizzes)
      
      const results = quizService.getUserResults(user.id)
      console.log('User ID:', user.id)
      console.log('Quiz results loaded:', results)
      setUserResults(results)
    }
    
    loadData()
    
    // Refresh when window gains focus or visibility changes
    const handleFocus = () => loadData()
    const handleVisibility = () => {
      if (!document.hidden) loadData()
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [user.id])

  const getQuizStatus = (quizId) => {
    const result = userResults.find(r => r.quizId === quizId)
    console.log('Checking quiz', quizId, 'result:', result)
    return result ? { completed: true, score: result.score } : { completed: false }
  }

  const availableQuizzes = quizzes.filter(q => !getQuizStatus(q.id).completed)
  const completedQuizzes = quizzes.filter(q => getQuizStatus(q.id).completed)
  
  console.log('Available quizzes:', availableQuizzes.length)
  console.log('Completed quizzes:', completedQuizzes.length)

  return (
    <div className="student-quizzes-page">
      <div className="container">
        <h1>Available Quizzes</h1>
        <p>Test your knowledge and track your progress</p>

        {quizzes.length === 0 ? (
          <div className="no-data">
            <i className="fas fa-clipboard-list"></i>
            <p>No quizzes available yet. Check back later!</p>
          </div>
        ) : (
          <>
            {availableQuizzes.length > 0 && (
              <div className="quizzes-grid">
                {availableQuizzes.map(quiz => (
                  <div key={quiz.id} className="quiz-card">
                    <h3>{quiz.title}</h3>
                    <p className="quiz-teacher">By {quiz.teacherName}</p>
                    <div className="quiz-meta">
                      <span><i className="fas fa-book"></i> {quiz.subjectName}</span>
                      <span><i className="fas fa-question-circle"></i> {quiz.questions.length} questions</span>
                      <span><i className="fas fa-clock"></i> {quiz.duration} min</span>
                    </div>
                    <Link to={`/quiz/${quiz.id}`} className="btn btn-primary">
                      <i className="fas fa-play"></i> Start Quiz
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {completedQuizzes.length > 0 && (
              <div className="completed-quizzes-section">
                <h2><i className="fas fa-check-circle"></i> Completed Quizzes</h2>
                <div className="quizzes-grid">
                  {completedQuizzes.map(quiz => {
                    const status = getQuizStatus(quiz.id)
                    const result = userResults.find(r => r.quizId === quiz.id)
                    return (
                      <div key={quiz.id} className="quiz-card completed">
                        <div className="completed-badge">
                          <i className="fas fa-check-circle"></i> Completed
                        </div>
                        <h3>{quiz.title}</h3>
                        <p className="quiz-teacher">By {quiz.teacherName}</p>
                        <div className="quiz-meta">
                          <span><i className="fas fa-book"></i> {quiz.subjectName}</span>
                          <span><i className="fas fa-question-circle"></i> {quiz.questions.length} questions</span>
                          <span><i className="fas fa-calendar"></i> {new Date(result?.completedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="quiz-score">
                          <div className="score-info">
                            <span className="score-label">Your Score:</span>
                            <span className="score-value">{status.score}%</span>
                            <span className="score-grade">
                              Grade: {status.score >= 90 ? 'A' : status.score >= 80 ? 'B' : status.score >= 70 ? 'C' : status.score >= 60 ? 'D' : 'F'}
                            </span>
                          </div>
                          <Link to={`/quiz/${quiz.id}`} className="btn btn-secondary btn-sm">
                            <i className="fas fa-redo"></i> Retake Quiz
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StudentQuizzes
