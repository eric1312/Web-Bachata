import Reveal from './Reveal.jsx'
import { textos } from '../data/info.js'

export default function Objetivos() {
  return (
    <section id="objetivos" className="section section--dark">
      <div className="container">
        <div className="trio">
          <Reveal className="trio__col">
            <span className="trio__num">01</span>
            <h2 className="title title--orange">
              Nuestros <br />
              objetivos
            </h2>
            <p>{textos.objetivos}</p>
          </Reveal>

          <Reveal className="trio__col trio__col--accent" delay={120}>
            <span className="trio__num">02</span>
            <h2 className="title title--cream">
              Misión y <br />
              visión
            </h2>
            {textos.mision.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </Reveal>

          <Reveal className="trio__col" delay={240}>
            <span className="trio__num">03</span>
            <h2 className="title title--orange">
              Plan de <br />
              acción
            </h2>
            <p>{textos.plan.intro}</p>
            <ul className="ticks">
              {textos.plan.puntos.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="bailamos" role="img" aria-label="Bailamos">
          <svg viewBox="0 0 1000 250" aria-hidden="true" focusable="false">
            <text x="500" y="218" textAnchor="middle" textLength="970" lengthAdjust="spacingAndGlyphs">
              BAILAMOS
            </text>
          </svg>
        </Reveal>
      </div>
    </section>
  )
}
