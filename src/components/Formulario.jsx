import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { horarios } from '../data/info.js'
import { api } from '../lib/api.js'

const niveles = ['Nunca bailé', 'Principiante', 'Intermedio', 'Avanzado']
const vacio = { nombre: '', whatsapp: '', email: '', clase: '', nivel: '', mensaje: '', web: '' }

/** Formulario de inscripción: se guarda en la base de datos (ver /server). */
export default function Formulario() {
  const [f, setF] = useState(vacio)
  const [estado, setEstado] = useState('listo') // listo | enviando | ok
  const [error, setError] = useState('')

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setEstado('enviando')
    try {
      await api('/api/inscripciones', { method: 'POST', body: f })
      setEstado('ok')
      setF(vacio)
    } catch (err) {
      setError(err.message)
      setEstado('listo')
    }
  }

  return (
    <section id="inscripcion" className="section section--cream inscr">
      <div className="container inscr__grid">
        <div className="inscr__intro">
          <Reveal as="h2" className="title title--ink">
            Anotate <br />
            <span className="title--orange">a una clase</span>
          </Reveal>
          <Reveal as="p" className="lead" delay={80}>
            Dejanos tus datos y Martin se comunica con vos por WhatsApp para contarte todo. Sin compromiso.
          </Reveal>
        </div>

        <Reveal className="inscr__card" delay={120}>
          {estado === 'ok' ? (
            <div className="inscr__ok" role="status">
              <strong>¡Listo! Recibimos tus datos 💃🕺</strong>
              <p>Martin te escribe por WhatsApp muy pronto.</p>
              <button className="btn btn--ghost-dark" type="button" onClick={() => setEstado('listo')}>
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={enviar} noValidate>
              <label className="field">
                <span>Nombre y apellido *</span>
                <input value={f.nombre} onChange={set('nombre')} required maxLength={80} autoComplete="name" />
              </label>

              <div className="form__row">
                <label className="field">
                  <span>WhatsApp *</span>
                  <input
                    value={f.whatsapp}
                    onChange={set('whatsapp')}
                    required
                    type="tel"
                    inputMode="tel"
                    maxLength={30}
                    autoComplete="tel"
                    placeholder="11 1234 5678"
                  />
                </label>
                <label className="field">
                  <span>Email (opcional)</span>
                  <input value={f.email} onChange={set('email')} type="email" maxLength={120} autoComplete="email" />
                </label>
              </div>

              <div className="form__row">
                <label className="field">
                  <span>¿A qué clase te querés anotar?</span>
                  <select value={f.clase} onChange={set('clase')}>
                    <option value="">Todavía no sé</option>
                    {horarios.map((h) => (
                      <option key={h.id} value={`${h.dia} · ${h.lugar} · ${h.desde}-${h.hasta}`}>
                        {h.dia} · {h.lugar} · {h.desde} a {h.hasta} hs
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Tu nivel</span>
                  <select value={f.nivel} onChange={set('nivel')}>
                    <option value="">Elegí una opción</option>
                    {niveles.map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field">
                <span>Mensaje (opcional)</span>
                <textarea value={f.mensaje} onChange={set('mensaje')} rows={3} maxLength={1000} />
              </label>

              {/* Trampa para bots: las personas no lo ven */}
              <div className="hp" aria-hidden="true">
                <label>
                  No completar
                  <input tabIndex={-1} autoComplete="off" value={f.web} onChange={set('web')} />
                </label>
              </div>

              {error && (
                <p className="form__error" role="alert">
                  {error}
                </p>
              )}

              <button className="btn btn--primary" type="submit" disabled={estado === 'enviando'}>
                {estado === 'enviando' ? 'Enviando…' : 'Quiero anotarme'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
