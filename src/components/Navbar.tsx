import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#career' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-ink/80 backdrop-blur-xl">
      <nav className="page-shell flex h-20 items-center justify-between" aria-label="Primary navigation">
        <a href="#home" className="font-display text-sm font-bold tracking-[0.2em] text-white" aria-label="Mandhagini Madhavan, home">
          MM<span className="text-gold">.</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a className="text-sm text-white/60 transition-colors hover:text-white" href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center border border-white/10 text-white md:hidden"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-ink px-5 py-4 md:hidden">
          <ul className="page-shell flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a className="block border-b border-white/[0.07] py-4 text-base text-white/70" href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
