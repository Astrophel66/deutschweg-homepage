import { Routes, Route } from "react-router-dom"
import { useAuth } from "./context/AuthContext.jsx"

import Navbar from "./sections/Navbar.jsx"
import Footer from "./sections/Footer.jsx"

import Home from "./pages/Home.jsx"
import Loginpage from "./pages/Loginpage.jsx"
import Registerpage from "./pages/Registerpage.jsx"
import CheckEmailPage from "./pages/CheckEmailPage.jsx"
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx"
import TeachersPage from "./pages/TeachersPage.jsx"

import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx"
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage.jsx"

import StudentDashboard from "./pages/student/StudentDashboard.jsx"
import StudentProfilePage from "./pages/student/StudentProfilePage.jsx"

import ResourcesPage from "./pages/resources/ResourcesPage.jsx"
import UploadResourcePage from "./pages/resources/UploadResourcePage.jsx"

import CoursesPage from "./pages/courses/CoursesPage.jsx"
import CourseDetailPage from "./pages/courses/CourseDetailPage.jsx"
import CreateCoursePage from "./pages/courses/CreateCoursePage.jsx"
import AddLessonPage from "./pages/courses/AddLessonPage.jsx"

import AvailabilityPage from "./pages/scheduling/AvailabilityPage.jsx"
import BookingsPage from "./pages/scheduling/BookingsPage.jsx"
import BookClassPage from "./pages/scheduling/BookClassPage.jsx"

import ProtectedRoute from "./components/shared/ProtectedRoute.jsx"

// Public layout wrapper — shows Navbar + Footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public routes — with Navbar + Footer */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Loginpage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Registerpage /></PublicLayout>} />
      <Route path="/check-email" element={<PublicLayout><CheckEmailPage /></PublicLayout>} />
      <Route path="/verify-email" element={<PublicLayout><VerifyEmailPage /></PublicLayout>} />
      <Route path="/teachers" element={<PublicLayout><TeachersPage /></PublicLayout>} />
      <Route path="/courses" element={<PublicLayout><CoursesPage /></PublicLayout>} />
      <Route path="/courses/:id" element={<PublicLayout><CourseDetailPage /></PublicLayout>} />

      {/* Student routes — DashboardLayout handles sidebar */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentProfilePage />
        </ProtectedRoute>
      } />

      {/* Teacher routes — DashboardLayout handles sidebar */}
      <Route path="/teacher/dashboard" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      <Route path="/teacher/profile" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/courses/create" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <CreateCoursePage />
        </ProtectedRoute>
      } />
      <Route path="/courses/:id/lessons/add" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <AddLessonPage />
        </ProtectedRoute>
      } />

      {/* Scheduling */}
      <Route path="/scheduling/availability" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <AvailabilityPage />
        </ProtectedRoute>
      } />
      <Route path="/scheduling/bookings" element={
        <ProtectedRoute allowedRoles={['student', 'teacher']}>
          <BookingsPage />
        </ProtectedRoute>
      } />
      <Route path="/scheduling/book" element={
        <ProtectedRoute allowedRoles={['student']}>
          <BookClassPage />
        </ProtectedRoute>
      } />

      {/* Resources */}
      <Route path="/resources" element={
        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
          <ResourcesPage />
        </ProtectedRoute>
      } />
      <Route path="/resources/upload" element={
        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
          <UploadResourcePage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}