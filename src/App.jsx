import { Routes, Route } from "react-router-dom"

import Navbar from "./sections/Navbar.jsx"
import Footer from "./sections/Footer.jsx"

import Home from "./pages/Home.jsx"
import Loginpage from "./pages/Loginpage.jsx"
import Registerpage from "./pages/Registerpage.jsx"

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
      </Routes>

      <Footer />
    </>
  )
}