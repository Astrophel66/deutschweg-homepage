export default function Footer() {
  const cols = [
    { heading: 'Platform', links: ['Courses', 'Teachers', 'Resources', 'Live Classes'] },
    { heading: 'Company',  links: ['About', 'Blog', 'Careers', 'Press'] },
    { heading: 'Support',  links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms'] },
  ]

  return (
    <footer className="bg-[#111] text-white/50 pt-16 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-2xl font-black text-white mb-3">
              Deutsch<span className="text-[var(--red-brand)]">Weg</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A modern German learning ecosystem combining LMS, teacher marketplace, live classes and shared resources.
            </p>
          </div>
          {/* Link cols */}
          {cols.map(col => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">{col.heading}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors hover:text-white">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>© 2025 DeutschWeg. All rights reserved.</span>
          <div className="flex gap-5">
            {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
              <a key={s} href="#" className="transition-colors hover:text-white">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
