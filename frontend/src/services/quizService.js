// Quiz service - manages quizzes and assessments
import { setItem, getItem } from '../utils/storage'

const QUIZZES_KEY = 'ssplp_quizzes'
const QUIZ_RESULTS_KEY = 'ssplp_quiz_results'

export const quizService = {
  // Get all quizzes
  getAllQuizzes: () => {
    const stored = localStorage.getItem(QUIZZES_KEY)
    return stored ? JSON.parse(stored) : []
  },

  // Get quizzes by subject
  getQuizzesBySubject: (subjectId) => {
    const quizzes = quizService.getAllQuizzes()
    return quizzes.filter(q => q.subjectId === parseInt(subjectId))
  },

  // Create quiz (teacher)
  createQuiz: (quizData) => {
    const quizzes = quizService.getAllQuizzes()
    const newQuiz = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...quizData
    }
    quizzes.push(newQuiz)
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes))
    return newQuiz
  },

  // Get quiz by ID
  getQuizById: (quizId) => {
    const quizzes = quizService.getAllQuizzes()
    return quizzes.find(q => q.id === parseInt(quizId))
  },

  // Submit quiz (student)
  submitQuiz: async (userId, quizId, answers) => {
    const quiz = quizService.getQuizById(quizId)
    if (!quiz) return null

    let correctCount = 0
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer
      if (isCorrect) correctCount++
      return {
        questionId: question.id || index,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect
      }
    })

    const score = Math.round((correctCount / quiz.questions.length) * 100)
    const result = {
      id: Date.now(),
      userId,
      quizId: parseInt(quizId),
      subjectId: quiz.subjectId,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
      completedAt: new Date().toISOString()
    }

    // Save result with resilient storage (falls back to IndexedDB on quota errors)
    try {
      // Get existing results
      let allResults = []
      try {
        const stored = localStorage.getItem(QUIZ_RESULTS_KEY)
        if (stored) allResults = JSON.parse(stored)
      } catch (e) {
        console.warn('Could not read existing results')
      }
      
      // Keep only last 20 results per user to save space
      const userResults = allResults.filter(r => r.userId === userId)
      const otherResults = allResults.filter(r => r.userId !== userId)
      
      if (userResults.length >= 20) {
        userResults.splice(0, userResults.length - 19)
      }
      
      userResults.push(result)
      const finalResults = [...otherResults, ...userResults]
      
      // Save using resilient storage
      await setItem(QUIZ_RESULTS_KEY, finalResults)
      console.log('Quiz result saved successfully')
    } catch (err) {
      console.error('Failed to save quiz result:', err)
      // Still return the result so UI can show it
    }

    return result
  },

  // Get all results
  getAllResults: () => {
    try {
      const stored = localStorage.getItem(QUIZ_RESULTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      console.warn('Could not read from localStorage, returning empty array')
      return []
    }
  },

  // Get user results
  getUserResults: (userId) => {
    const results = quizService.getAllResults()
    return results.filter(r => r.userId === userId)
  },

  // Get quiz results (for teachers)
  getQuizResults: (quizId) => {
    const results = quizService.getAllResults()
    return results.filter(r => r.quizId === parseInt(quizId))
  },

  // Delete quiz
  deleteQuiz: (quizId) => {
    const quizzes = quizService.getAllQuizzes()
    const filtered = quizzes.filter(q => q.id !== quizId)
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(filtered))
    return true
  }
}
