import Reveal from './Reveal.jsx'
import { textos } from '../data/info.js'
import martin3 from '../assets/martin-3.png'
import monograma from '../assets/monograma.png'

export default function QueHacemos() {
  return (
    <section id="que-hacemos" className="section section--cream">
      <div className="container split">
        <Reveal className="split__media que__media">
          <img className="que__mono" src={monograma} alt="" aria-hidden="true" />
          <img className="que__photo" src={martin3} alt="Martin bailando" />
        </Reveal>

        <div className="split__text">
          <Reveal as="h2" className="title title--orange">
            Lo que <br />
            hacemos
          </Reveal>
          <Reveal as="p" className="lead" delay={80}>
            {textos.queHacemos.intro}
          </Reveal>
          <Reveal as="p" delay={140}>
            {textos.queHacemos.detalle}
          </Reveal>

          <Reveal className="chips" delay={200}>
            <span className="chip">Desde cero</span>
            <span className="chip">Todos los niveles</span>
            <span className="chip">Clases y prácticas</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
