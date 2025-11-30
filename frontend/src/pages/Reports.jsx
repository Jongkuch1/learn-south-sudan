import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { reportService } from '../services/reportService'
import { useLanguage } from '../contexts/LanguageContext'
import { getAllSubjects } from '../data/subjects'

const Reports = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [reportType, setReportType] = useState('monthly')
  const [report, setReport] = useState(null)

  useEffect(() => {
    if (user) {
      generateReport()
    }
  }, [user, reportType])

  const generateReport = () => {
    console.log('Generating report for user:', user)
    if (user.role === 'teacher' || user.role === 'admin') {
      const reportData = reportType === 'monthly'
        ? reportService.generateTeacherMonthlyReport(user.id)
        : reportService.generateTeacherTermlyReport(user.id)
      console.log('Teacher/Admin Report Data:', reportData)
      setReport(reportData)
    } else {
      const reportData = reportType === 'monthly' 
        ? reportService.generateMonthlyReport(user.id)
        : reportService.generateTermlyReport(user.id)
      console.log('Student Report Data:', reportData)
      setReport(reportData)
    }
  }

  const downloadReport = () => {
    const content = JSON.stringify(report, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  if (!report) return <div>{t('loading')}</div>

  const subjects = getAllSubjects()

  return (
    <div className="reports-page">
      <div className="container">
        <div className="reports-header">
          <h1>{t('performanceReports')}</h1>
          <div className="report-controls">
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="monthly">{t('monthlyReport')}</option>
              <option value="termly">{t('termlyReport')}</option>
            </select>
            <button className="btn btn-primary" onClick={downloadReport}>
              <i className="fas fa-download"></i> {t('download')}
            </button>
          </div>
        </div>

        <div className="report-summary">
          <h2>{reportType === 'monthly' ? report.month : report.term}</h2>
          <div className="summary-stats">
            {(user.role === 'teacher' || user.role === 'admin') ? (
              <>
                <div className="summary-card">
                  <h3>{report.totalClasses}</h3>
                  <p>Total Classes</p>
                </div>
                <div className="summary-card">
                  <h3>{report.totalAssignments}</h3>
                  <p>Assignments Created</p>
                </div>
                <div className="summary-card">
                  <h3>{report.totalResources}</h3>
                  <p>Resources Uploaded</p>
                </div>
                <div className="summary-card">
                  <h3>{report.totalSubmissions}</h3>
                  <p>Student Submissions</p>
                </div>
              </>
            ) : (
              <>
                <div className="summary-card">
                  <h3>{report.overallProgress}%</h3>
                  <p>{t('overallProgress')}</p>
                </div>
                <div className="summary-card">
                  <h3>{report.quizzesCompleted}</h3>
                  <p>{t('quizzesCompleted')}</p>
                </div>
                <div className="summary-card">
                  <h3>{report.averageScore}%</h3>
                  <p>{t('averageScore')}</p>
                </div>
                {reportType === 'termly' && (
                  <div className="summary-card">
                    <h3>{report.completedSubjects}</h3>
                    <p>{t('completedSubjects')}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {user.role === 'student' && Object.keys(report.subjectsProgress).length > 0 && (
          <div className="report-section">
            <h3>{t('subjectProgress')}</h3>
            <div className="subjects-progress-list">
              {Object.entries(report.subjectsProgress).map(([subjectId, progress]) => {
                const subject = subjects.find(s => s.id === parseInt(subjectId))
                return subject ? (
                  <div key={subjectId} className="subject-progress-item">
                    <div className="subject-info">
                      <div className="subject-icon-small" style={{ color: subject.color }}>
                        <i className={subject.icon}></i>
                      </div>
                      <strong>{t(subject.nameKey)}</strong>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: subject.color }}></div>
                    </div>
                    <span>{progress}%</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {user.role === 'student' && report.topSubjects.length > 0 && (
          <div className="report-section">
            <h3>{t('topPerformingSubjects')}</h3>
            <div className="top-subjects">
              {report.topSubjects.map((item, index) => {
                const subject = subjects.find(s => s.id === item.subjectId)
                return subject ? (
                  <div key={item.subjectId} className="top-subject-item">
                    <span className="rank">#{index + 1}</span>
                    <span>{t(subject.nameKey)}</span>
                    <span className="score">{item.score}%</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {user.role === 'student' && report.needsImprovement.length > 0 && (
          <div className="report-section">
            <h3>{t('needsImprovement')}</h3>
            <div className="needs-improvement">
              {report.needsImprovement.map(item => {
                const subject = subjects.find(s => s.id === item.subjectId)
                return subject ? (
                  <div key={item.subjectId} className="improvement-item">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{t(subject.nameKey)}</span>
                    <span className="score">{item.score}%</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {reportType === 'termly' && report.recommendations.length > 0 && (
          <div className="report-section">
            <h3>{t('recommendations')}</h3>
            <ul className="recommendations-list">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
