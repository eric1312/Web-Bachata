import Reveal from './Reveal.jsx'
import { links, profe } from '../data/info.js'
import martin2 from '../assets/martin-2.png'
import salsaBachata from '../assets/salsa-bachata.png'
import { WhatsAppIcon, InstagramIcon, MailIcon, PhoneIcon } from './Icons.jsx'

const Icon = {
  whatsapp: <WhatsAppIcon />,
  instagram: <InstagramIcon />,
  mail: <MailIcon />,
  phone: <PhoneIcon />,
}

export default function Contacto() {
  const canales = [
    { key: 'whatsapp', titulo: 'WhatsApp', texto: profe.telefono, href: links.whatsapp, ext: true },
    { key: 'instagram', titulo: 'Instagram', texto: `@${profe.instagramUser}`, href: links.instagram, ext: true },
    { key: 'mail', titulo: 'Email', texto: profe.email, href: links.email },
    { key: 'phone', titulo: 'Llamar', texto: profe.telefono, href: links.telefono },
  ]

  return (
    <section id="contacto" className="section section--orange contacto">
      <div className="container contacto__grid">
        <div>
          <Reveal as="h2" className="title title--cream">
            Visitanos
          </Reveal>
          <Reveal as="p" className="lead lead--light" delay={80}>
            Clases y prácticas. Escribinos y te contamos todo para que des tu primer paso.
          </Reveal>

          <ul className="canales">
            {canales.map((c, i) => (
              <Reveal as="li" key={c.key} delay={i * 90}>
                <a
                  className="canal"
                  href={c.href}
                  {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="canal__icon">{Icon[c.key]}</span>
                  <span>
                    <strong>{c.titulo}</strong>
                    <small>{c.texto}</small>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="contacto__visual" delay={150}>
          <img className="contacto__foto" src={martin2} alt="" aria-hidden="true" />
          <img className="contacto__tag" src={salsaBachata} alt="Salsa & Bachata by Martin del Valle" />
        </Reveal>
      </div>
    </section>
  )
}
