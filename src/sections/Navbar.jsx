import { useState, useEffect } from 'react'
import Button from '../components/ui/Button.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Home', 'Teachers', 'Courses', 'Resources']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-xl bg-[var(--cream)]/85 border-b border-[var(--border-color)] shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="font-display text-2xl font-black text-[var(--charcoal)] tracking-tight">
          Deutsch<span className="text-[var(--red-brand)]">Weg</span>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-8 list-none">
          {links.map(link => (
            <li key={link}>
              <a href="#" className="text-sm font-medium text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors">
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden md:flex gap-3 items-center">
          <Button variant="ghost" size="sm">Login</Button>
          <Button variant="primary" size="sm">Get Started</Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--charcoal)] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--cream)] border-b border-[var(--border-color)] px-6 pb-6">
          {links.map(link => (
            <a key={link} href="#" className="block py-3 text-sm font-medium text-[var(--warm-gray)] border-b border-[var(--border-color)] last:border-0">
              {link}
            </a>
          ))}
          <div className="flex gap-3 mt-4">
            <Button variant="ghost" size="sm" fullWidth>Login</Button>
            <Button variant="primary" size="sm" fullWidth>Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
