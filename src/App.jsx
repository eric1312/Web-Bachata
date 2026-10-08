import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import QueHacemos from './components/QueHacemos.jsx'
import Horarios from './components/Horarios.jsx'
import Objetivos from './components/Objetivos.jsx'
import Musica from './components/Musica.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import { WhatsAppIcon } from './components/Icons.jsx'
import { links } from './data/info.js'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <QueHacemos />
        <Horarios />
        <Objetivos />
        <Musica />
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
    </>
  )
}
