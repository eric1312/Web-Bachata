import { links, profe } from '../data/info.js'
import logoNegro from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <img  src={logoNegro} alt="Martin del Valle" />
        <p>
          © {new Date().getFullYear()} {profe.nombre} · Salsa & Bachata
        </p>
        <p className="footer__links">
          <a href={links.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={links.email}>Email</a>
        </p>
      </div>
    </footer>
  )
}
