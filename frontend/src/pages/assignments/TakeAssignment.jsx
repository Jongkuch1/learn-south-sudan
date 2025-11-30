import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './TakeAssignment.css';

const TakeAssignment = () => {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('ssplp_teacher_assignments_')) {
        const assignments = JSON.parse(localStorage.getItem(key) || '[]');
        const found = assignments.find(a => a.id === parseInt(assignmentId));
        if (found) {
          setAssignment(found);
        }
      }
    });
  }, [assignmentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Submitting assignment...');
    console.log('Assignment:', assignment);
    console.log('Answers:', answers);
    
    try {
      const submission = {
        id: Date.now(),
        assignmentId: assignment.id,
        studentId: user.id,
        studentName: user.name,
        answers,
        submittedAt: new Date().toISOString()
      };

      let submissions = JSON.parse(localStorage.getItem('ssplp_assignment_submissions') || '[]');
      
      // Limit to 50 submissions
      if (submissions.length >= 50) {
        submissions = submissions.slice(-49);
      }
      
      submissions.push(submission);
      localStorage.setItem('ssplp_assignment_submissions', JSON.stringify(submissions));
      
      console.log('Assignment submitted successfully');
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment: ' + error.message);
    }
  };

  if (!assignment) return <div className="container" style={{ padding: '3rem 0' }}>Loading...</div>;

  if (submitted) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div style={{ background: '#d1e7dd', padding: '2rem', borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
          <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: '#0f5132', marginBottom: '1rem' }}></i>
          <h2 style={{ color: '#0f5132' }}>Assignment Submitted!</h2>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="take-assignment-page">
      <div className="container">
        <div className="assignment-header">
          <h1>{assignment.title}</h1>
          <div className="assignment-info">
            <p><i className="fas fa-chalkboard"></i> <strong>Class:</strong> {assignment.class}</p>
            <p><i className="fas fa-book"></i> <strong>Subject:</strong> {assignment.subject}</p>
            <p><i className="fas fa-calendar"></i> <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
            <p><i className="fas fa-user"></i> <strong>Teacher:</strong> {assignment.teacherName}</p>
          </div>
          {assignment.instructions && (
            <div className="instructions">
              <h3><i className="fas fa-info-circle"></i> Instructions</h3>
              <p>{assignment.instructions}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="assignment-form">
          {assignment.questions && assignment.questions.length > 0 ? (
            <div className="questions-section">
              <h2>Questions ({assignment.questions.length})</h2>
              {assignment.questions.map((question, index) => (
                <div key={question.id} className="question-card">
                  <div className="question-header">
                    <h3>Question {index + 1}</h3>
                    <span className="points-badge">{question.points} points</span>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <div className="answer-area">
                    <label>Your Answer:</label>
                    <textarea
                      rows="6"
                      value={answers[question.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      placeholder="Type your answer here..."
                      required
                    />
                  </div>
                </div>
              ))}
              <div className="total-points">
                <strong>Total Points: {assignment.questions.reduce((sum, q) => sum + (q.points || 0), 0)}</strong>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>Your Answer</label>
              <textarea
                rows="10"
                value={answers.answer || ''}
                onChange={(e) => setAnswers({ ...answers, answer: e.target.value })}
                placeholder="Type your answer here..."
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-paper-plane"></i> Submit Assignment
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeAssignment;
