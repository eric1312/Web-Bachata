import { useEffect, useState } from 'react'
import logoNegro from '../assets/logo.png'

const items = [
  { href: '#que-hacemos', label: 'Qué hacemos' },
  { href: '#horarios', label: 'Horarios' },
  { href: '#objetivos', label: 'Objetivos' },
  { href: '#musica', label: 'Música' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Evita scroll del fondo con el menú abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#inicio" className="nav__brand" onClick={close} aria-label="Martin del Valle, ir al inicio">
          <img src={logoNegro} alt="Martin del Valle" />
        </a>

        <button
          className="nav__toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="menu" className="nav__menu" aria-label="Principal">
          {items.map((i) => (
            <a key={i.href} href={i.href} onClick={close}>
              {i.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
