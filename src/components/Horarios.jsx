import Reveal from './Reveal.jsx'
import { horarios, links } from '../data/info.js'
import martin2 from '../assets/martin-2.png'
import martin4 from '../assets/martin-4.png'

export default function Horarios() {
  return (
    <section id="horarios" className="section section--orange">
      <div className="container">
        <Reveal as="h2" className="title title--cream title--center">
          Propuesta abierta
        </Reveal>
        <Reveal as="p" className="center sub" delay={80}>
          Días, lugares y horarios · <strong>Visitanos: clases y prácticas</strong>
        </Reveal>

        <div className="horarios">
          <Reveal className="horarios__foto horarios__foto--left" aria-hidden="true">
            <img src={martin2} alt="" />
          </Reveal>

          <ul className="cards">
            {horarios.map((h, i) => (
              <Reveal as="li" key={h.id} className="card" delay={i * 120}>
                <h3 className="card__dia">{h.dia}</h3>
                <p className="card__lugar">{h.lugar}</p>
                {h.sublugar && <p className="card__sub">{h.sublugar}</p>}
                {h.direccion && <p className="card__dir">{h.direccion}</p>}
                <p className="card__hora">
                  <span aria-hidden="true">🕒</span> {h.desde} a {h.hasta} hs
                </p>
                {h.mapsUrl && (
                  <a className="card__map" href={h.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Cómo llegar →
                  </a>
                )}
              </Reveal>
            ))}
          </ul>

          <Reveal className="horarios__foto horarios__foto--right" aria-hidden="true">
            <img src={martin4} alt="" />
          </Reveal>
        </div>

        <Reveal className="center" delay={120}>
          <a className="btn btn--cream" href={links.whatsapp} target="_blank" rel="noopener noreferrer">
            Consultanos por WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  )
}
