// Sample learning resources for demonstration
// Using verified embeddable educational videos
export const sampleResources = [
  // MATHEMATICS RESOURCES
  {
    id: Date.now() + 1,
    subject: '1',
    topic: 'Algebra',
    title: 'Algebra Basics - What is Algebra?',
    type: 'video',
    url: 'https://www.youtube.com/embed/Vm7H0VTlIco',
    description: 'Introduction to algebra concepts and solving equations',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 2,
    subject: '1',
    topic: 'Algebra',
    title: 'Algebra Notes - Variables and Expressions',
    type: 'document',
    url: 'https://example.com/algebra-notes.pdf',
    description: 'Study notes covering variables, expressions, and basic algebraic operations',
    content: 'ALGEBRA BASICS\n\n1. Variables: Letters that represent unknown numbers (x, y, z)\n2. Expressions: Combinations of numbers and variables (3x + 5)\n3. Equations: Mathematical statements showing equality (2x + 3 = 7)\n\nKey Concepts:\n- Like terms can be combined (3x + 2x = 5x)\n- Order of operations: PEMDAS\n- Solving equations: Isolate the variable',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 3,
    subject: '1',
    topic: 'Algebra',
    title: 'Linear Equations',
    type: 'video',
    url: 'https://www.youtube.com/embed/ORaRKpp7v7I',
    description: 'Learn to solve linear equations step by step',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 4,
    subject: '1',
    topic: 'Algebra',
    title: 'Linear Equations Study Notes',
    type: 'document',
    url: 'https://example.com/linear-equations.pdf',
    description: 'Comprehensive notes on solving linear equations',
    content: 'LINEAR EQUATIONS\n\nDefinition: An equation where the highest power of variable is 1\nExample: 2x + 5 = 13\n\nSteps to Solve:\n1. Simplify both sides\n2. Move variables to one side\n3. Move constants to other side\n4. Divide to isolate variable\n\nExample:\n2x + 5 = 13\n2x = 13 - 5\n2x = 8\nx = 4',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 5,
    subject: '1',
    topic: 'Geometry',
    title: 'Basic Geometry Concepts',
    type: 'video',
    url: 'https://www.youtube.com/embed/epqIi8THDZA',
    description: 'Understanding points, lines, angles, and shapes',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 6,
    subject: '1',
    topic: 'Geometry',
    title: 'Geometry Fundamentals Notes',
    type: 'document',
    url: 'https://example.com/geometry-notes.pdf',
    description: 'Essential geometry concepts and definitions',
    content: 'GEOMETRY BASICS\n\nKey Terms:\n- Point: A location in space\n- Line: Extends infinitely in both directions\n- Angle: Formed by two rays with common endpoint\n\nTypes of Angles:\n- Acute: Less than 90°\n- Right: Exactly 90°\n- Obtuse: Greater than 90°\n- Straight: 180°\n\nShapes:\n- Triangle: 3 sides, angles sum to 180°\n- Square: 4 equal sides, 4 right angles\n- Circle: All points equidistant from center',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 7,
    subject: '1',
    topic: 'Numbers',
    title: 'Fractions Explained',
    type: 'video',
    url: 'https://www.youtube.com/embed/FXZ2O1Lv-KE',
    description: 'Understanding fractions and how to work with them',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 8,
    subject: '1',
    topic: 'Numbers',
    title: 'Fractions Study Guide',
    type: 'document',
    url: 'https://example.com/fractions.pdf',
    description: 'Complete guide to working with fractions',
    content: 'FRACTIONS\n\nDefinition: Part of a whole\nFormat: Numerator/Denominator\n\nOperations:\n1. Addition: Same denominator - add numerators\n   Example: 1/4 + 2/4 = 3/4\n\n2. Subtraction: Same denominator - subtract numerators\n   Example: 3/4 - 1/4 = 2/4 = 1/2\n\n3. Multiplication: Multiply numerators and denominators\n   Example: 1/2 × 2/3 = 2/6 = 1/3\n\n4. Division: Flip second fraction and multiply\n   Example: 1/2 ÷ 2/3 = 1/2 × 3/2 = 3/4',
    teacherName: 'Math Platform',
    uploadedAt: new Date().toISOString()
  },

  // ENGLISH RESOURCES
  {
    id: Date.now() + 9,
    subject: '2',
    topic: 'Grammar',
    title: 'English Grammar Basics',
    type: 'video',
    url: 'https://www.youtube.com/embed/Mzv-N7LcJGk',
    description: 'Learn the fundamentals of English grammar',
    teacherName: 'English Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 10,
    subject: '2',
    topic: 'Grammar',
    title: 'Grammar Rules and Notes',
    type: 'document',
    url: 'https://example.com/grammar-notes.pdf',
    description: 'Essential English grammar rules',
    content: 'ENGLISH GRAMMAR\n\nParts of Speech:\n1. Noun: Person, place, thing (cat, school, joy)\n2. Verb: Action or state (run, is, think)\n3. Adjective: Describes noun (big, red, happy)\n4. Adverb: Describes verb (quickly, very, well)\n5. Pronoun: Replaces noun (he, she, it, they)\n\nSentence Structure:\n- Subject + Verb + Object\n- Example: The cat (S) ate (V) fish (O)\n\nTenses:\n- Present: I eat\n- Past: I ate\n- Future: I will eat',
    teacherName: 'English Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 11,
    subject: '2',
    topic: 'Grammar',
    title: 'Sentence Structure',
    type: 'video',
    url: 'https://www.youtube.com/embed/fdQb1OC4RCM',
    description: 'Understanding how to build proper sentences',
    teacherName: 'English Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 12,
    subject: '2',
    topic: 'Writing',
    title: 'Paragraph Writing',
    type: 'video',
    url: 'https://www.youtube.com/embed/0U98a0yphP4',
    description: 'How to write effective paragraphs',
    teacherName: 'English Platform',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 13,
    subject: '2',
    topic: 'Writing',
    title: 'Writing Skills Notes',
    type: 'document',
    url: 'https://example.com/writing-notes.pdf',
    description: 'Guide to effective writing',
    content: 'WRITING SKILLS\n\nParagraph Structure:\n1. Topic Sentence: Main idea\n2. Supporting Sentences: Details and examples\n3. Concluding Sentence: Summary\n\nEssay Structure:\n- Introduction: Hook + Thesis\n- Body Paragraphs: Arguments + Evidence\n- Conclusion: Restate thesis + Final thoughts\n\nWriting Tips:\n- Use clear, simple language\n- Vary sentence length\n- Check spelling and grammar\n- Read your work aloud',
    teacherName: 'English Platform',
    uploadedAt: new Date().toISOString()
  },

  // RELIGION RESOURCES
  {
    id: Date.now() + 14,
    subject: '3',
    topic: 'Christianity',
    title: 'Christianity Explained',
    type: 'video',
    url: 'https://www.youtube.com/embed/BNt5NKSse0Y',
    description: 'Introduction to Christian faith and beliefs',
    teacherName: 'Religious Education',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 15,
    subject: '3',
    topic: 'Christianity',
    title: 'Christianity Study Notes',
    type: 'document',
    url: 'https://example.com/christianity-notes.pdf',
    description: 'Key concepts in Christianity',
    content: 'CHRISTIANITY\n\nCore Beliefs:\n- One God in Trinity (Father, Son, Holy Spirit)\n- Jesus Christ is the Son of God\n- Salvation through faith in Jesus\n- The Bible is the holy scripture\n\nKey Teachings:\n- Love God and love your neighbor\n- Forgiveness and compassion\n- The Ten Commandments\n- The Golden Rule: Treat others as you want to be treated\n\nPractices:\n- Prayer and worship\n- Reading the Bible\n- Attending church\n- Helping others',
    teacherName: 'Religious Education',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 16,
    subject: '3',
    topic: 'Islam',
    title: 'Introduction to Islam',
    type: 'video',
    url: 'https://www.youtube.com/embed/VOUp3ZZ9t3A',
    description: 'Learn about Islamic faith and practices',
    teacherName: 'Religious Education',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 17,
    subject: '3',
    topic: 'Islam',
    title: 'Islam Study Notes',
    type: 'document',
    url: 'https://example.com/islam-notes.pdf',
    description: 'Understanding Islamic beliefs',
    content: 'ISLAM\n\nCore Beliefs:\n- One God (Allah)\n- Muhammad is the final prophet\n- The Quran is the holy book\n- Day of Judgment\n\nFive Pillars of Islam:\n1. Shahada: Declaration of faith\n2. Salah: Prayer five times daily\n3. Zakat: Giving to charity\n4. Sawm: Fasting during Ramadan\n5. Hajj: Pilgrimage to Mecca\n\nValues:\n- Peace and submission to God\n- Justice and equality\n- Compassion and mercy\n- Honesty and integrity',
    teacherName: 'Religious Education',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 18,
    subject: '3',
    topic: 'Values',
    title: 'Moral Values and Ethics',
    type: 'video',
    url: 'https://www.youtube.com/embed/Diuv3XZQXyc',
    description: 'Understanding right and wrong, ethics and morality',
    teacherName: 'Religious Education',
    uploadedAt: new Date().toISOString()
  },
  {
    id: Date.now() + 19,
    subject: '3',
    topic: 'Values',
    title: 'Ethics and Values Notes',
    type: 'document',
    url: 'https://example.com/ethics-notes.pdf',
    description: 'Guide to moral values and ethical living',
    content: 'MORAL VALUES AND ETHICS\n\nCore Values:\n- Honesty: Always tell the truth\n- Respect: Treat everyone with dignity\n- Responsibility: Be accountable for actions\n- Kindness: Show compassion to others\n- Integrity: Do what is right\n\nEthical Principles:\n- Do no harm\n- Be fair and just\n- Keep your promises\n- Help those in need\n- Respect differences\n\nPracticing Good Values:\n- Think before you act\n- Consider how your actions affect others\n- Stand up for what is right\n- Learn from mistakes',
    teacherName: 'Religious Education',
    uploadedAt: new Date().toISOString()
  }
]

// Function to load sample resources into localStorage
export const loadSampleResources = () => {
  const existingResources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]')
  
  // Remove old sample resources
  const sampleTeacherNames = ['Khan Academy', 'Math Antics', 'English Lessons', 'English Grammar', 
    'Reading Skills', 'Writing Skills', 'Academic Writing', 'Vocabulary Builder', 'Religious Studies', 
    'Bible Studies', 'Islamic Studies', 'Ethics Education', 'Character Education', 'Math Platform', 
    'English Platform', 'Religious Education']
  
  const teacherUploadedOnly = existingResources.filter(r => 
    !sampleTeacherNames.includes(r.teacherName)
  )
  
  // Add fresh sample resources
  const allResources = [...teacherUploadedOnly, ...sampleResources]
  localStorage.setItem('ssplp_resources', JSON.stringify(allResources))
  console.log('✅ Sample resources loaded successfully!')
  return true
}
