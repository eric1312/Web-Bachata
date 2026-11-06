import Reveal from './Reveal.jsx'
import { ArrowIcon, CameraIcon } from './Icons.jsx'
import { destacadas, fotos } from '../data/fotos.js'

/** Vista previa de la galería dentro de la página: 6 fotos + botón para ver todas. */
export default function GaleriaPreview() {
  return (
    <section id="galeria" className="section section--dark gprev">
      <div className="container">
        <div className="gprev__head">
          <Reveal as="h2" className="title title--cream">
            Galería <br />
            <span className="title--orange">de fotos</span>
          </Reveal>
          <Reveal as="p" className="gprev__lead" delay={80}>
            El baile y la música de Martin, en imágenes.
          </Reveal>
        </div>

        <ul className="gprev__grid">
          {destacadas.map((f, i) => (
            <Reveal as="li" key={f.id} className={`gprev__tile gprev__tile--${i + 1}`} delay={i * 70}>
              <a href={`#fotos/${f.id}`} aria-label={`Ver foto: ${f.alt}`}>
                <img
                  src={f.thumb}
                  width={f.tw}
                  height={f.th}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: f.pos }}
                />
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className="center" delay={120}>
          <a className="btn btn--primary gprev__btn" href="#fotos">
            <CameraIcon />
            Ver las {fotos.length} fotos
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
