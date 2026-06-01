import { Routes, Route } from "react-router-dom"

import Navbar from "./sections/Navbar.jsx"
import Footer from "./sections/Footer.jsx"

import Home from "./pages/Home.jsx"
import Loginpage from "./pages/Loginpage.jsx"
import Registerpage from "./pages/Registerpage.jsx"
import CheckEmailPage from "./pages/CheckEmailPage.jsx"
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx"

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

import ProtectedRoute from "./components/shared/ProtectedRoute.jsx"

import TeachersPage from "./pages/TeachersPage.jsx"


export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Public course listing */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Teacher routes */}
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
        <Route path="/teachers" element={<TeachersPage />} />


        {/* Student routes */}
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

        {/* Resource routes */}
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

      <Footer />
    </>
  )
}