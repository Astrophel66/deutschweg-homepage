import { Routes, Route } from "react-router-dom"

import Navbar from "./sections/Navbar.jsx"
import Footer from "./sections/Footer.jsx"

import Home from "./pages/Home.jsx"
import Loginpage from "./pages/Loginpage.jsx"
import Registerpage from "./pages/Registerpage.jsx"
import CheckEmailPage from "./pages/CheckEmailPage.jsx"
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx"

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />

        {/* Post-registration flow */}
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>

      <Footer />
    </>
  )
}