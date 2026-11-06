import { horarios, links, textos } from '../data/info.js'
import logoNegro from '../assets/logo.png'
import salsaBachata from '../assets/salsa-bachata.png'
import { portada } from '../data/fotos.js'
import { CameraIcon } from './Icons.jsx'

/** Calcula la próxima clase a partir de hoy y la hora actual. */
function proximaClase(ahora = new Date()) {
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes()
  let mejor = null
  for (const h of horarios) {
    const [hh, mm] = h.hasta.split(':').map(Number)
    let diff = (h.diaNumero - ahora.getDay() + 7) % 7
    // si es hoy pero la clase ya terminó, es la semana que viene
    if (diff === 0 && minutosAhora >= hh * 60 + mm) diff = 7
    if (!mejor || diff < mejor.diff) mejor = { ...h, diff }
  }
  return mejor
}

export default function Hero() {
  const next = proximaClase()
  const cuando = next.diff === 0 ? 'Hoy' : next.diff === 1 ? 'Mañana' : next.dia

  return (
    <section id="inicio" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="sr-only">Clases de Salsa y Bachata con Martin del Valle</h1>
          <img className="hero__logo" src={logoNegro} alt="Martin del Valle" />
          <img className="hero__tag" src={salsaBachata} alt="Salsa & Bachata by Martin del Valle" />

          <p className="hero__lema">{textos.lema}</p>

          <div className="hero__cta">
            <a className="btn btn--primary" href={links.whatsapp} target="_blank" rel="noopener noreferrer">
              Reservá tu lugar
            </a>
            <a className="btn btn--ghost" href="#horarios">
              Ver horarios
            </a>
          </div>

          <a className="hero__next" href="#horarios">
            <span className="hero__next-dot" aria-hidden="true" />
            <span>
              Próxima clase: <strong>{cuando}</strong> · {next.lugar} · {next.desde} hs
            </span>
          </a>
        </div>

        <div className="hero__photo">
          <div className="hero__ring" aria-hidden="true" />
          <figure className="hero__frame">
            <img
              src={portada.src}
              width={portada.w}
              height={portada.h}
              alt={portada.alt}
              fetchpriority="high"
              style={{ objectPosition: portada.pos }}
            />
            <a className="hero__more" href="#fotos">
              <CameraIcon size={18} />
              Ver todas las fotos
            </a>
          </figure>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div className="marquee__group" key={k}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i}>
                  SALSA <b>✦</b> BACHATA <b>✦</b> BAILAMOS <b>✦</b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
