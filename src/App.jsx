import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import QueHacemos from './components/QueHacemos.jsx'
import GaleriaPreview from './components/GaleriaPreview.jsx'
import Horarios from './components/Horarios.jsx'
import Objetivos from './components/Objetivos.jsx'
import Musica from './components/Musica.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import Galeria from './components/Galeria.jsx'
import Formulario from './components/Formulario.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import { WhatsAppIcon } from './components/Icons.jsx'
import { links } from './data/info.js'

/**
 * La galería se abre con el hash de la URL:
 *   #fotos       → pantalla de fotos
 *   #fotos/16    → abre directo la foto con id 16
 * Así funcionan los botones (son simples links), el botón "atrás" del celular
 * y se puede compartir el link de la galería.
 */
function leerHash() {
  const m = window.location.hash.match(/^#fotos(?:\/(\d+))?$/)
  return m ? { abierta: true, id: m[1] ? Number(m[1]) : null } : { abierta: false, id: null }
}

const esAdmin = () => window.location.hash === '#admin'

export default function App() {
  const [admin, setAdmin] = useState(esAdmin)
  const [galeria, setGaleria] = useState(leerHash)
  // true si la persona entró directo a la URL con #fotos (no hay una pantalla anterior a la que volver)
  const entroDirecto = useRef(leerHash().abierta)

  useEffect(() => {
    const onHash = () => {
      setAdmin(esAdmin())
      const h = leerHash()
      if (h.abierta) entroDirecto.current = false
      setGaleria(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const cerrarGaleria = useCallback(() => {
    if (entroDirecto.current || !leerHash().abierta) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
      setGaleria({ abierta: false, id: null })
      entroDirecto.current = false
    } else {
      history.back() // vuelve a donde estaba la persona; hashchange cierra la galería
    }
  }, [])

  // Panel privado de Martin: se entra desde tu-dominio.com/#admin (pide contraseña)
  if (admin) return <AdminPanel />

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <QueHacemos />
        <GaleriaPreview />
        <Horarios />
        <Objetivos />
        <Musica />
        <Formulario />
        <Contacto />
      </main>
      <Footer />

      <a
        className="fab"
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
      >
        <WhatsAppIcon size={30} />
      </a>

      {galeria.abierta && <Galeria startId={galeria.id} onClose={cerrarGaleria} />}
    </>
  )
}
