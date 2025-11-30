// Generate comprehensive learning resources for each subject

const mathTopics = [
  { name: 'Algebra', lessons: ['Variables', 'Expressions', 'Equations', 'Inequalities', 'Functions', 'Graphs', 'Systems of Equations', 'Polynomials', 'Factoring', 'Quadratic Equations'] },
  { name: 'Geometry', lessons: ['Points and Lines', 'Angles', 'Triangles', 'Quadrilaterals', 'Circles', 'Polygons', 'Area', 'Perimeter', 'Volume', 'Surface Area'] },
  { name: 'Numbers', lessons: ['Integers', 'Fractions', 'Decimals', 'Percentages', 'Ratios', 'Proportions', 'Prime Numbers', 'Factors', 'Multiples', 'Powers'] },
  { name: 'Statistics', lessons: ['Data Collection', 'Mean', 'Median', 'Mode', 'Range', 'Graphs', 'Probability', 'Charts', 'Interpretation', 'Analysis'] },
  { name: 'Trigonometry', lessons: ['Sine', 'Cosine', 'Tangent', 'Angles', 'Right Triangles', 'Unit Circle', 'Identities', 'Equations', 'Applications', 'Graphs'] }
]

const englishTopics = [
  { name: 'Grammar', lessons: ['Nouns', 'Verbs', 'Adjectives', 'Adverbs', 'Pronouns', 'Prepositions', 'Conjunctions', 'Tenses', 'Subject-Verb Agreement', 'Punctuation'] },
  { name: 'Writing', lessons: ['Paragraphs', 'Essays', 'Letters', 'Reports', 'Summaries', 'Descriptions', 'Narratives', 'Arguments', 'Editing', 'Proofreading'] },
  { name: 'Reading', lessons: ['Comprehension', 'Main Ideas', 'Details', 'Inference', 'Context Clues', 'Vocabulary', 'Summarizing', 'Analysis', 'Critical Thinking', 'Speed Reading'] },
  { name: 'Literature', lessons: ['Poetry', 'Short Stories', 'Novels', 'Drama', 'Characters', 'Plot', 'Setting', 'Theme', 'Symbolism', 'Literary Devices'] },
  { name: 'Speaking', lessons: ['Pronunciation', 'Fluency', 'Presentations', 'Debates', 'Discussions', 'Interviews', 'Public Speaking', 'Confidence', 'Body Language', 'Listening'] }
]

const religionTopics = [
  { name: 'Christianity', lessons: ['Bible', 'Jesus Christ', 'Ten Commandments', 'Prayer', 'Worship', 'Sacraments', 'Parables', 'Miracles', 'Apostles', 'Church'] },
  { name: 'Islam', lessons: ['Quran', 'Prophet Muhammad', 'Five Pillars', 'Prayer', 'Fasting', 'Charity', 'Hajj', 'Beliefs', 'Practices', 'History'] },
  { name: 'Values', lessons: ['Honesty', 'Respect', 'Kindness', 'Responsibility', 'Integrity', 'Compassion', 'Justice', 'Tolerance', 'Peace', 'Love'] },
  { name: 'Ethics', lessons: ['Right and Wrong', 'Moral Choices', 'Conscience', 'Character', 'Virtues', 'Duties', 'Rights', 'Fairness', 'Truth', 'Wisdom'] },
  { name: 'World Religions', lessons: ['Buddhism', 'Hinduism', 'Judaism', 'Sikhism', 'Traditions', 'Beliefs', 'Practices', 'Festivals', 'Sacred Texts', 'Unity'] }
]

const mathVideoUrls = [
  'https://www.youtube.com/embed/Vm7H0VTlIco',
  'https://www.youtube.com/embed/ORaRKpp7v7I',
  'https://www.youtube.com/embed/epqIi8THDZA',
  'https://www.youtube.com/embed/FXZ2O1Lv-KE',
  'https://www.youtube.com/embed/Mzv-N7LcJGk'
]

const englishVideoUrls = [
  'https://www.youtube.com/embed/O-6q-siuMik',
  'https://www.youtube.com/embed/kEHWOaqHnf0',
  'https://www.youtube.com/embed/Unzc731iCUY',
  'https://www.youtube.com/embed/LE3e5m8V-Yw',
  'https://www.youtube.com/embed/8irSFvoyLHQ',
  'https://www.youtube.com/embed/QYbGw_p8A3s',
  'https://www.youtube.com/embed/zGOOOHsoQHo',
  'https://www.youtube.com/embed/Vn9jJHu_8wQ',
  'https://www.youtube.com/embed/xPlU4VHbxzM',
  'https://www.youtube.com/embed/TgQNn_vXi0E'
]

const religionVideoUrls = [
  'https://www.youtube.com/embed/m6dCxo7t_aE',
  'https://www.youtube.com/embed/BNt5NKSse0Y',
  'https://www.youtube.com/embed/VOUp3ZZ9t3A',
  'https://www.youtube.com/embed/Diuv3XZQXyc',
  'https://www.youtube.com/embed/KYAdko8Efv0'
]

export function generateResources() {
  const resources = []
  let id = Date.now()

  // Generate Mathematics Resources (10)
  mathTopics.slice(0, 2).forEach((topic, topicIndex) => {
    topic.lessons.slice(0, 5).forEach((lesson, lessonIndex) => {
      // Video
      resources.push({
        id: id++,
        subject: '1',
        topic: topic.name,
        title: `${lesson} - Video Lesson`,
        type: 'video',
        url: mathVideoUrls[(topicIndex * 10 + lessonIndex) % mathVideoUrls.length],
        description: `Learn about ${lesson.toLowerCase()} in ${topic.name.toLowerCase()}`,
        teacherName: 'Math Platform',
        uploadedAt: new Date().toISOString()
      })
      
      // Notes
      resources.push({
        id: id++,
        subject: '1',
        topic: topic.name,
        title: `${lesson} - Study Notes`,
        type: 'document',
        url: '#',
        description: `Comprehensive notes on ${lesson.toLowerCase()}`,
        content: `${topic.name.toUpperCase()} - ${lesson.toUpperCase()}\n\nKey Concepts:\n- Understanding ${lesson.toLowerCase()}\n- Important formulas and rules\n- Practice problems\n- Real-world applications\n\nStudy Tips:\n- Review examples carefully\n- Practice regularly\n- Ask questions when confused\n- Work through problems step by step`,
        teacherName: 'Math Platform',
        uploadedAt: new Date().toISOString()
      })
    })
  })

  // Generate English Resources (10)
  englishTopics.slice(0, 2).forEach((topic, topicIndex) => {
    topic.lessons.slice(0, 5).forEach((lesson, lessonIndex) => {
      // Video
      resources.push({
        id: id++,
        subject: '2',
        topic: topic.name,
        title: `${lesson} - Video Lesson`,
        type: 'video',
        url: englishVideoUrls[(topicIndex * 10 + lessonIndex) % englishVideoUrls.length],
        description: `Master ${lesson.toLowerCase()} in English ${topic.name.toLowerCase()}`,
        teacherName: 'Speak English With Tiffani',
        uploadedAt: new Date().toISOString()
      })
      
      // Notes
      resources.push({
        id: id++,
        subject: '2',
        topic: topic.name,
        title: `${lesson} - Study Guide`,
        type: 'document',
        url: '#',
        description: `Complete guide to ${lesson.toLowerCase()}`,
        content: `${topic.name.toUpperCase()} - ${lesson.toUpperCase()}\n\nLearning Objectives:\n- Understand ${lesson.toLowerCase()} concepts\n- Apply skills in practice\n- Improve communication\n- Build confidence\n\nKey Points:\n- Clear explanations\n- Examples and exercises\n- Common mistakes to avoid\n- Tips for improvement`,
        teacherName: 'English Platform',
        uploadedAt: new Date().toISOString()
      })
    })
  })

  // Generate Religion Resources (10)
  religionTopics.slice(0, 2).forEach((topic, topicIndex) => {
    topic.lessons.slice(0, 5).forEach((lesson, lessonIndex) => {
      // Video
      resources.push({
        id: id++,
        subject: '3',
        topic: topic.name,
        title: `${lesson} - Video Lesson`,
        type: 'video',
        url: religionVideoUrls[(topicIndex * 10 + lessonIndex) % religionVideoUrls.length],
        description: `Explore ${lesson.toLowerCase()} in ${topic.name}`,
        teacherName: 'Religious Education',
        uploadedAt: new Date().toISOString()
      })
      
      // Notes
      resources.push({
        id: id++,
        subject: '3',
        topic: topic.name,
        title: `${lesson} - Study Notes`,
        type: 'document',
        url: '#',
        description: `Understanding ${lesson.toLowerCase()}`,
        content: `${topic.name.toUpperCase()} - ${lesson.toUpperCase()}\n\nCore Teachings:\n- Fundamental beliefs about ${lesson.toLowerCase()}\n- Historical context\n- Practical applications\n- Moral lessons\n\nReflection Questions:\n- What does this teach us?\n- How can we apply this?\n- Why is this important?\n- What values does this promote?`,
        teacherName: 'Religious Education',
        uploadedAt: new Date().toISOString()
      })
    })
  })

  return resources
}

export function loadGeneratedResources() {
  const existingResources = JSON.parse(localStorage.getItem('ssplp_resources') || '[]')
  
  // Remove old sample resources
  const sampleTeacherNames = ['Math Platform', 'English Platform', 'Religious Education']
  const teacherUploadedOnly = existingResources.filter(r => 
    !sampleTeacherNames.includes(r.teacherName)
  )
  
  // Add generated resources
  const generatedResources = generateResources()
  const allResources = [...teacherUploadedOnly, ...generatedResources]
  
  localStorage.setItem('ssplp_resources', JSON.stringify(allResources))
  console.log(`✅ Loaded ${generatedResources.length} learning resources!`)
  console.log(`   - Mathematics: 10 resources`)
  console.log(`   - English: 10 resources`)
  console.log(`   - Religion: 10 resources`)
  return true
}
