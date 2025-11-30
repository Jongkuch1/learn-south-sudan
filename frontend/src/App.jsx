import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { AuthProvider } from './contexts/AuthContext' // added
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/learning/Subjects'
import Learning from './pages/learning/Learning'
import Profile from './pages/Profile'
import Tutors from './pages/tutors/Tutors'
import Progress from './pages/progress/Progress'
import StudentProgress from './pages/teacher/StudentProgress'
import Resources from './pages/teacher/Resources'
import Quizzes from './pages/teacher/Quizzes'
import StudentQuizzes from './pages/student/Quizzes'
import TakeQuiz from './pages/student/TakeQuiz'
import Messages from './pages/Messages'
import Analytics from './pages/admin/Analytics'
import ResourceApproval from './pages/admin/ResourceApproval'
import UserManagement from './pages/admin/UserManagement'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import OfflineResources from './pages/OfflineResources'
import VirtualTutoring from './pages/VirtualTutoring'
import BookingCalendar from './pages/bookings/BookingCalendar'
import Availability from './pages/teacher/Availability'
import TakeAssignment from './pages/assignments/TakeAssignment'
import CreateAssignment from './pages/teacher/CreateAssignment'
import ClearStorage from './pages/ClearStorage'
import UpdateProfile from './pages/UpdateProfile'
import FixStudentName from './pages/FixStudentName'
import { useEffect } from 'react'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const { user } = useAuth()

  // Removed sample data loading - application now uses only real data

  return (
    <Layout>
      <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/subjects" 
              element={
                <PrivateRoute>
                  <Subjects />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/subjects/:subjectId" 
              element={
                <PrivateRoute>
                  <Learning />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tutors" 
              element={
                <PrivateRoute>
                  <Tutors />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <PrivateRoute>
                  <Progress />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <PrivateRoute>
                  {user?.role === 'teacher' || user?.role === 'admin' ? <StudentProgress /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/resources" 
              element={
                <PrivateRoute>
                  {user?.role === 'teacher' || user?.role === 'admin' ? <Resources /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/teacher/quizzes" 
              element={
                <PrivateRoute>
                  {user?.role === 'teacher' ? <Quizzes /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <PrivateRoute>
                  {user?.role === 'student' ? <StudentQuizzes /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/quiz/:quizId" 
              element={
                <PrivateRoute>
                  {user?.role === 'student' ? <TakeQuiz /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <PrivateRoute>
                  {user?.role === 'admin' ? <Analytics /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />

            <Route 
              path="/users" 
              element={
                <PrivateRoute>
                  {user?.role === 'admin' ? <UserManagement /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />

            <Route 
              path="/admin/resources" 
              element={
                <PrivateRoute>
                  {user?.role === 'admin' ? <ResourceApproval /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/teacher/resources" 
              element={
                <PrivateRoute>
                  {user?.role === 'teacher' ? <Resources /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tutoring" 
              element={
                <PrivateRoute>
                  <VirtualTutoring />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/offline" 
              element={
                <PrivateRoute>
                  <OfflineResources />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <PrivateRoute>
                  <BookingCalendar />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/availability" 
              element={
                <PrivateRoute>
                  {user?.role === 'teacher' ? <Availability /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/assignment/:assignmentId" 
              element={
                <PrivateRoute>
                  {user?.role === 'student' ? <TakeAssignment /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/teacher/create-assignment" 
              element={
                <PrivateRoute>
                  {user?.role === 'teacher' ? <CreateAssignment /> : <Navigate to="/login" />}
                </PrivateRoute>
              } 
            />
            <Route 
              path="/clear-storage" 
              element={<ClearStorage />} 
            />
            <Route 
              path="/update-profile" 
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/fix-student-name" 
              element={<FixStudentName />} 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
