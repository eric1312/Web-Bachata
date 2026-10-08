import Reveal from './Reveal.jsx'
import { profe } from '../data/info.js'
import { SpotifyIcon } from './Icons.jsx'
import logoColor from '../assets/logo-color.png'

export default function Musica() {
  return (
    <section id="musica" className="section section--cream">
      <div className="container musica">
        <Reveal className="musica__text">
          <h2 className="title title--ink">
            Llevá la música <br />
            <span className="title--orange">a tus clases</span>
          </h2>
          <p>
            Buscá las playlists de <strong>Martin del Valle</strong> en Spotify y accedé a toda la música para
            practicar y para tus clases.
          </p>
          <a className="btn btn--spotify" href={profe.spotifyUrl} target="_blank" rel="noopener noreferrer">
            <SpotifyIcon />
            Escuchar en Spotify
          </a>
        </Reveal>

        <Reveal className="musica__logo" delay={120}>
          <img  src={logoColor} alt="Martin del Valle" />
        </Reveal>
      </div>
    </section>
  )
}
