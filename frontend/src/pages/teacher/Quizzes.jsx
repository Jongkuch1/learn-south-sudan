import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { quizService } from '../../services/quizService'
import { getAllSubjects, getSubjectById } from '../../data/subjects'
import { activityService } from '../../services/activityService'

const Quizzes = () => {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    duration: 30,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  })

  const subjects = getAllSubjects()
  const teacherSubjects = user?.subjects || []

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = () => {
    const allQuizzes = quizService.getAllQuizzes()
    const teacherQuizzes = allQuizzes.filter(q => q.teacherId === user.id)
    setQuizzes(teacherQuizzes)
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[index][field] = value
    setFormData(prev => ({ ...prev, questions: newQuestions }))
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].options[oIndex] = value
    setFormData(prev => ({ ...prev, questions: newQuestions }))
  }

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    }))
  }

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, questions: newQuestions }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const subjectId = formData.subjectId
    const subject = subjects.find(s => s.id === parseInt(subjectId))
    
    const newQuiz = {
      ...formData,
      subjectId: parseInt(subjectId),
      teacherId: user.id,
      teacherName: user.name,
      subjectName: subject.name,
      questions: formData.questions.map((q, idx) => ({
        id: Date.now() + idx,
        ...q
      }))
    }
    
    quizService.createQuiz(newQuiz)
    alert('Quiz created successfully! Students can now see it in their Quizzes page.')

    activityService.addActivity(user.id, {
      type: 'quiz',
      title: 'Created Quiz',
      description: `${formData.title} for ${subject.name}`
    })

    setFormData({
      title: '',
      subjectId: '',
      duration: 30,
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    })
    setShowCreateForm(false)
    loadQuizzes()
  }

  const handleDelete = (quizId) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      quizService.deleteQuiz(quizId)
      loadQuizzes()
    }
  }

  const viewResults = (quizId) => {
    const results = quizService.getQuizResults(quizId)
    const avgScore = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0
    const details = results.map(r => `${r.userId}: ${r.score}%`).join('\n')
    alert(`Quiz Results:\n\nCompleted: ${results.length} students\nAverage Score: ${avgScore}%\n\n${details || 'No submissions yet'}`)
  }

  const getQuizStats = (quizId) => {
    const results = quizService.getQuizResults(quizId)
    return {
      completed: results.length,
      avgScore: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0
    }
  }

  return (
    <div className="quizzes-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Quizzes & Assessments</h1>
            <p>Create and manage quizzes for your students</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            <i className="fas fa-plus"></i> Create Quiz
          </button>
        </div>

        {showCreateForm && (
          <div className="quiz-form-container">
            <h2>Create New Quiz</h2>
            <form onSubmit={handleSubmit} className="quiz-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Quiz Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Algebra Chapter 1 Quiz"
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <select name="subjectId" value={formData.subjectId} onChange={handleChange} required>
                    <option value="">Select Subject</option>
                    {(user.role === 'admin' ? subjects : subjects.filter(s => teacherSubjects.includes(s.id))).map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="5"
                    max="180"
                    required
                  />
                </div>
              </div>

              <div className="questions-section">
                <h3>Questions</h3>
                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="question-card">
                    <div className="question-header">
                      <h4>Question {qIndex + 1}</h4>
                      {formData.questions.length > 1 && (
                        <button type="button" className="btn-icon" onClick={() => removeQuestion(qIndex)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Question Text</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        required
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="options-grid">
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-item">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswer === oIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            required
                            placeholder={`Option ${oIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button type="button" className="btn btn-secondary" onClick={addQuestion}>
                  <i className="fas fa-plus"></i> Add Question
                </button>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create Quiz</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="quizzes-list">
          {quizzes.length === 0 ? (
            <div className="no-data">
              <i className="fas fa-clipboard-list"></i>
              <p>No quizzes created yet. Click "Create Quiz" to add your first quiz.</p>
            </div>
          ) : (
            <div className="quizzes-grid">
              {quizzes.map(quiz => {
                const stats = getQuizStats(quiz.id)
                return (
                  <div key={quiz.id} className="quiz-card">
                    <h3>{quiz.title}</h3>
                    <div className="quiz-meta">
                      <span><i className="fas fa-book"></i> {quiz.subjectName}</span>
                      <span><i className="fas fa-question-circle"></i> {quiz.questions.length} questions</span>
                      <span><i className="fas fa-clock"></i> {quiz.duration} min</span>
                    </div>
                    <div className="quiz-stats">
                      <span><i className="fas fa-users"></i> {stats.completed} completed</span>
                      {stats.completed > 0 && <span><i className="fas fa-chart-line"></i> Avg: {stats.avgScore}%</span>}
                    </div>
                    <div className="quiz-actions">
                      <button className="btn btn-sm btn-primary" onClick={() => viewResults(quiz.id)}>
                        <i className="fas fa-chart-bar"></i> Results
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(quiz.id)}>
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quizzes
