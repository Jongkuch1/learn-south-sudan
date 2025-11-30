import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import StudentDashboard from '../components/dashboard/StudentDashboard'
import TeacherDashboard from '../components/dashboard/TeacherDashboard'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import '../styles/dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard key={user?.name} user={user} />
      case 'teacher':
        return <TeacherDashboard key={user?.name} user={user} />
      case 'admin':
        return <AdminDashboard key={user?.name} user={user} />
      default:
        return <StudentDashboard key={user?.name} user={user} />
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        {renderDashboard()}
      </div>
    </div>
  )
}

export default Dashboard
