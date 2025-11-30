import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { quizService } from '../../services/quizService'
import { activityService } from '../../services/activityService'

const TakeQuiz = () => {
  const { quizId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const quizData = quizService.getQuizById(quizId)
    if (quizData) {
      setQuiz(quizData)
      setAnswers(new Array(quizData.questions.length).fill(null))
      setTimeLeft(quizData.duration * 60)
    }
  }, [quizId])

  useEffect(() => {
    if (timeLeft > 0 && !result) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quiz && !result) {
      handleSubmit()
    }
  }, [timeLeft, result])

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    console.log('Submitting quiz...')
    console.log('User ID:', user.id)
    console.log('Quiz ID:', quiz.id)
    console.log('Answers:', answers)
    
    try {
      const quizResult = await quizService.submitQuiz(user.id, quiz.id, answers)
      console.log('Quiz result:', quizResult)
      
      if (quizResult) {
        setResult(quizResult)
        
        // Add activity
        await activityService.addActivity(user.id, {
          type: 'quiz',
          title: `Completed Quiz: ${quiz.title}`,
          description: `Score: ${quizResult.score}%`,
          subjectName: quiz.subjectName,
          score: quizResult.score
        })
        
        alert(`Quiz submitted! Your score: ${quizResult.score}%`)
      } else {
        alert('Error submitting quiz. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Error submitting quiz: ' + error.message)
    }
  }

  if (!quiz) return <div>Loading...</div>

  if (result) {
    const timeTaken = quiz.duration * 60 - timeLeft
    const minutes = Math.floor(timeTaken / 60)
    const seconds = timeTaken % 60
    
    return (
      <div className="quiz-result-page">
        <div className="container">
          <div className="result-card">
            <h1 className="result-title">Results</h1>
            <h2 className="student-name">{user.name}</h2>
            
            <div className="stats-section">
              <h3>Assessment Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item-result">
                  <div className="stat-number">{result.score}%</div>
                  <div className="stat-label">{result.correctCount} out of {result.totalQuestions} points</div>
                </div>
                <div className="stat-item-result">
                  <div className="stat-number">{result.correctCount}</div>
                  <div className="stat-label">Out of {result.totalQuestions} points</div>
                </div>
                <div className="stat-item-result">
                  <div className="stat-number">{minutes}:{seconds.toString().padStart(2, '0')}</div>
                  <div className="stat-label">Time for this attempt</div>
                </div>
              </div>
              <div className="grade-display">
                <strong>Grade: </strong>
                <span className={`grade-badge ${result.score >= 90 ? 'grade-a' : result.score >= 80 ? 'grade-b' : result.score >= 70 ? 'grade-c' : result.score >= 60 ? 'grade-d' : 'grade-f'}`}>
                  {result.score >= 90 ? 'A' : result.score >= 80 ? 'B' : result.score >= 70 ? 'C' : result.score >= 60 ? 'D' : 'F'}
                </span>
                <span className="grade-percentage">({result.score}%)</span>
              </div>
            </div>

            <div className="result-details">
              <h3>Your Answers:</h3>
              {quiz.questions.map((question, index) => {
                const userResult = result.results[index]
                return (
                  <div key={index} className="question-result">
                    <div className="question-result-header">
                      <span className="question-number">{index + 1}</span>
                      <span className="question-points">{userResult.isCorrect ? '1' : '0'} / 1 point</span>
                    </div>
                    <div className="question-type">Multiple Choice</div>
                    <p className="question-text">{question.question}</p>
                    
                    <div className="answer-options">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = userResult.userAnswer === optIndex
                        const isCorrectAnswer = userResult.correctAnswer === optIndex
                        
                        return (
                          <div 
                            key={optIndex} 
                            className={`answer-option ${
                              isCorrectAnswer ? 'correct-answer' : 
                              isUserAnswer && !isCorrectAnswer ? 'wrong-answer' : ''
                            }`}
                          >
                            {isCorrectAnswer && <span className="answer-label">Correct answer:</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="answer-label">Your answer:</span>}
                            {!isUserAnswer && !isCorrectAnswer && <span className="answer-label">Not Selected</span>}
                            <span>{option}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="btn btn-primary btn-large" onClick={() => navigate('/quizzes')}>
                Back to Quizzes
              </button>
              <button className="btn btn-secondary btn-large" onClick={() => navigate('/dashboard')}>
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="take-quiz-page">
      <div className="container">
        <div className="quiz-header">
          <h1>{quiz.title}</h1>
          <div className="quiz-info">
            <span><i className="fas fa-book"></i> {quiz.subjectName}</span>
            <span className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
              <i className="fas fa-clock"></i> {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <p>Question {currentQuestion + 1} of {quiz.questions.length}</p>
        </div>

        <div className="question-container">
          <h2>{question.question}</h2>
          <div className="options-list">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="option-radio">
                  {answers[currentQuestion] === index && <div className="radio-dot"></div>}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <i className="fas fa-arrow-left"></i> Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
            >
              Submit Quiz <i className="fas fa-check"></i>
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TakeQuiz
