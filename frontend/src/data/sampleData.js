// Sample data to populate the application for demonstration
export function loadSampleData() {
  // Add sample users if they don't exist
  const existingUsers = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]')
  const sampleUsers = [
    { id: 'student-1', name: 'John Doe', email: 'student@ssplp.org', role: 'student', grade: 'Grade 10', subjects: [], createdAt: new Date().toISOString() },
    { id: 'student-2', name: 'Jane Smith', email: 'jane@ssplp.org', role: 'student', grade: 'Grade 11', subjects: [], createdAt: new Date().toISOString() },
    { id: 'student-3', name: 'Mike Johnson', email: 'mike@ssplp.org', role: 'student', grade: 'Grade 10', subjects: [], createdAt: new Date().toISOString() },
    { id: 'teacher-1', name: 'Sarah Michael', email: 'teacher@ssplp.org', role: 'teacher', subjects: [1, 2], createdAt: new Date().toISOString() },
    { id: 'admin-1', name: 'Admin User', email: 'admin@ssplp.org', role: 'admin', createdAt: new Date().toISOString() }
  ]
  
  // Merge users without duplicates
  const userEmails = existingUsers.map(u => u.email)
  const newUsers = sampleUsers.filter(u => !userEmails.includes(u.email))
  if (newUsers.length > 0) {
    localStorage.setItem('ssplp_registered_users', JSON.stringify([...existingUsers, ...newUsers]))
  }
  // Sample quiz results for student
  const sampleQuizResults = [
    {
      id: Date.now() - 86400000 * 5,
      userId: 'student-1',
      quizId: 1,
      subjectId: 1,
      score: 85,
      correctCount: 17,
      totalQuestions: 20,
      completedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: Date.now() - 86400000 * 3,
      userId: 'student-1',
      quizId: 2,
      subjectId: 2,
      score: 92,
      correctCount: 18,
      totalQuestions: 20,
      completedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: Date.now() - 86400000 * 1,
      userId: 'student-1',
      quizId: 3,
      subjectId: 5,
      score: 78,
      correctCount: 15,
      totalQuestions: 20,
      completedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ]

  // Sample quizzes
  const sampleQuizzes = [
    {
      id: 1,
      title: 'Algebra Basics',
      subjectId: 1,
      subject: 'Mathematics',
      description: 'Test your understanding of basic algebra concepts',
      timeLimit: 30,
      createdBy: 'teacher-1',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      questions: [
        {
          id: 1,
          question: 'What is 2x + 3 = 11? Solve for x.',
          options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
          correctAnswer: 1
        },
        {
          id: 2,
          question: 'Simplify: 3(x + 2)',
          options: ['3x + 2', '3x + 6', 'x + 6', '3x + 5'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 2,
      title: 'English Grammar',
      subjectId: 2,
      subject: 'English',
      description: 'Test your grammar knowledge',
      timeLimit: 25,
      createdBy: 'teacher-1',
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      questions: [
        {
          id: 1,
          question: 'Which is the correct past tense of "go"?',
          options: ['goed', 'went', 'gone', 'going'],
          correctAnswer: 1
        },
        {
          id: 2,
          question: 'Identify the noun: "The cat runs quickly"',
          options: ['The', 'cat', 'runs', 'quickly'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 3,
      title: 'Biology: Cell Structure',
      subjectId: 5,
      subject: 'Biology',
      description: 'Understanding cell components',
      timeLimit: 20,
      createdBy: 'teacher-1',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      questions: [
        {
          id: 1,
          question: 'What is the powerhouse of the cell?',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
          correctAnswer: 1
        },
        {
          id: 2,
          question: 'Which organelle controls cell activities?',
          options: ['Cytoplasm', 'Cell membrane', 'Nucleus', 'Vacuole'],
          correctAnswer: 2
        }
      ]
    }
  ]

  // Sample messages
  const sampleMessages = [
    { id: Date.now() - 1000, senderId: 'student-1', receiverId: 'teacher-1', text: 'Hello teacher, I have a question about algebra', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), read: true },
    { id: Date.now() - 2000, senderId: 'teacher-1', receiverId: 'student-1', text: 'Sure, what would you like to know?', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), read: true },
    { id: Date.now() - 3000, senderId: 'student-2', receiverId: 'teacher-1', text: 'Can you explain the homework?', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), read: false }
  ]

  // Save to localStorage
  try {
    // Save quiz results - only add if they don't exist
    const existingResults = JSON.parse(localStorage.getItem('ssplp_quiz_results') || '[]')
    const existingIds = existingResults.map(r => r.id)
    const newResults = sampleQuizResults.filter(r => !existingIds.includes(r.id))
    if (newResults.length > 0) {
      localStorage.setItem('ssplp_quiz_results', JSON.stringify([...existingResults, ...newResults]))
    }
    
    // Save quizzes
    const existingQuizzes = JSON.parse(localStorage.getItem('ssplp_quizzes') || '[]')
    const quizIds = existingQuizzes.map(q => q.id)
    const newQuizzes = sampleQuizzes.filter(q => !quizIds.includes(q.id))
    localStorage.setItem('ssplp_quizzes', JSON.stringify([...existingQuizzes, ...newQuizzes]))
    
    // Save messages
    const existingMessages = JSON.parse(localStorage.getItem('ssplp_messages') || '[]')
    const messageIds = existingMessages.map(m => m.id)
    const newMessages = sampleMessages.filter(m => !messageIds.includes(m.id))
    if (newMessages.length > 0) {
      localStorage.setItem('ssplp_messages', JSON.stringify([...existingMessages, ...newMessages]))
    }
    
    console.log('✅ Sample data loaded successfully!')
    console.log(`   - ${newUsers.length} new users`)
    console.log(`   - ${newResults.length} new quiz results added`)
    console.log(`   - ${newQuizzes.length} new quizzes`)
    console.log(`   - ${newMessages.length} new messages`)
    
    // Verify data was saved
    const savedResults = JSON.parse(localStorage.getItem('ssplp_quiz_results') || '[]')
    console.log(`   - Total quiz results in storage: ${savedResults.length}`)
    console.log(`   - Student-1 results: ${savedResults.filter(r => r.userId === 'student-1').length}`)
    return true
  } catch (error) {
    console.error('Failed to load sample data:', error)
    return false
  }
}
