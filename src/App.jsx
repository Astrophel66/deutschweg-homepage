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

import ProtectedRoute from "./components/shared/ProtectedRoute.jsx"

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

        {/* Teacher routes — only accessible by teachers */}
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
      </Routes>

      <Footer />
    </>
  )
}