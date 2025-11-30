export const subjects = {
  compulsory: [
    { id: 1, name: 'Mathematics', nameKey: 'mathematics', icon: 'fas fa-calculator', color: '#FF6B6B', category: 'compulsory' },
    { id: 2, name: 'English', nameKey: 'english', icon: 'fas fa-language', color: '#45B7D1', category: 'compulsory' },
    { id: 3, name: 'Religion', nameKey: 'religion', icon: 'fas fa-book-bible', color: '#96CEB4', category: 'compulsory' },
    { id: 4, name: 'Citizenship', nameKey: 'citizenship', icon: 'fas fa-flag', color: '#FFA07A', category: 'compulsory' }
  ],
  science: [
    { id: 5, name: 'Biology', nameKey: 'biology', icon: 'fas fa-dna', color: '#4ECDC4', category: 'science' },
    { id: 6, name: 'Physics', nameKey: 'physics', icon: 'fas fa-atom', color: '#9B59B6', category: 'science' },
    { id: 7, name: 'Chemistry', nameKey: 'chemistry', icon: 'fas fa-flask', color: '#E74C3C', category: 'science' },
    { id: 8, name: 'Agriculture', nameKey: 'agriculture', icon: 'fas fa-seedling', color: '#27AE60', category: 'science' },
    { id: 9, name: 'Additional Mathematics', nameKey: 'additionalMathematics', icon: 'fas fa-square-root-alt', color: '#E67E22', category: 'science' },
    { id: 10, name: 'ICT', nameKey: 'ict', icon: 'fas fa-laptop-code', color: '#3498DB', category: 'science' }
  ],
  arts: [
    { id: 11, name: 'History', nameKey: 'history', icon: 'fas fa-landmark', color: '#8E44AD', category: 'arts' },
    { id: 12, name: 'Geography', nameKey: 'geography', icon: 'fas fa-globe-africa', color: '#16A085', category: 'arts' },
    { id: 13, name: 'Commerce', nameKey: 'commerce', icon: 'fas fa-briefcase', color: '#2C3E50', category: 'arts' },
    { id: 14, name: 'Accounting', nameKey: 'accounting', icon: 'fas fa-file-invoice-dollar', color: '#D35400', category: 'arts' },
    { id: 15, name: 'Literature', nameKey: 'literature', icon: 'fas fa-book-open', color: '#C0392B', category: 'arts' }
  ]
}

export const getAllSubjects = () => {
  return [...subjects.compulsory, ...subjects.science, ...subjects.arts]
}

export const getSubjectsByCategory = (category) => {
  return subjects[category] || []
}

export const getSubjectById = (id) => {
  return getAllSubjects().find(subject => subject.id === parseInt(id))
}
