import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './CreateAssignment.css'

const CreateAssignment = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    class: '',
    subject: '',
    dueDate: '',
    instructions: ''
  })
  const [questions, setQuestions] = useState([
    { id: 1, question: '', points: 10 }
  ])

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), question: '', points: 10 }])
  }

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const assignment = {
      id: Date.now(),
      ...formData,
      questions,
      teacherId: user.id,
      teacherName: user.name,
      createdAt: new Date().toISOString(),
      submitted: 0,
      total: 0
    }

    try {
      const key = `ssplp_teacher_assignments_${user.id}`
      let assignments = JSON.parse(localStorage.getItem(key) || '[]')
      
      // Keep only last 30 assignments
      assignments = assignments.slice(-29)
      assignments.push(assignment)
      
      localStorage.setItem(key, JSON.stringify(assignments))
      alert('Assignment created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving assignment:', error)
      // If quota exceeded, save only this assignment
      try {
        const key = `ssplp_teacher_assignments_${user.id}`
        localStorage.setItem(key, JSON.stringify([assignment]))
        alert('Assignment created successfully!')
        navigate('/dashboard')
      } catch (err) {
        alert('Error: Storage full. Please clear browser data.')
      }
    }
  }

  return (
    <div className="create-assignment-page">
      <div className="container">
        <div className="page-header">
          <h1><i className="fas fa-clipboard-list"></i> Create Assignment</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="form-section">
            <h2>Assignment Details</h2>
            
            <div className="form-group">
              <label>Assignment Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Chapter 5 Review Questions"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Class *</label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  placeholder="e.g., Grade 10A"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Instructions</label>
              <textarea
                rows="3"
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                placeholder="Provide instructions for students..."
              />
            </div>
          </div>

          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Questions</h2>
              <button type="button" className="btn btn-success" onClick={addQuestion}>
                <i className="fas fa-plus"></i> Add Question
              </button>
            </div>

            {questions.map((q, index) => (
              <div key={q.id} className="question-card">
                <div className="question-header">
                  <h3>Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeQuestion(q.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Question Text *</label>
                  <textarea
                    rows="4"
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                    placeholder="Enter your question here..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Points</label>
                  <input
                    type="number"
                    value={q.points}
                    onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value))}
                    min="1"
                    max="100"
                    style={{ width: '150px' }}
                  />
                </div>
              </div>
            ))}

            <div className="total-points">
              <strong>Total Points: {questions.reduce((sum, q) => sum + (q.points || 0), 0)}</strong>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg">
              <i className="fas fa-check"></i> Create Assignment
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAssignment
