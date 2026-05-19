import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Teachers', path: '/#teachers' },
    { name: 'Courses', path: '/#courses' },
    { name: 'Resources', path: '/#resources' }
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'backdrop-blur-xl bg-[var(--cream)]/85 border-b border-[var(--border-color)] shadow-sm'
        : 'bg-transparent'
    }`}>
      
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="font-display text-2xl font-black text-[var(--charcoal)] tracking-tight cursor-pointer"
        >
          Deutsch<span className="text-[var(--red-brand)]">Weg</span>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-8 list-none">
          {links.map(link => (
            <li key={link.name}>
              <button
                onClick={() => navigate(link.path)}
                className="text-sm font-medium text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors"
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden md:flex gap-3 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
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
            <button
              key={link.name}
              onClick={() => {
                navigate(link.path)
                setMenuOpen(false)
              }}
              className="block w-full text-left py-3 text-sm font-medium text-[var(--warm-gray)] border-b border-[var(--border-color)] last:border-0"
            >
              {link.name}
            </button>
          ))}

          <div className="flex gap-3 mt-4">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => navigate('/login')}
            >
              Login
            </Button>

            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>

        </div>
      )}

    </nav>
  )
}