import { useEffect, useMemo, useRef, useState } from 'react'
import { categorias, fotos } from '../data/fotos.js'
import { CloseIcon } from './Icons.jsx'
import Lightbox from './Lightbox.jsx'
import useFocusTrap from '../hooks/useFocusTrap.js'

/**
 * Pantalla completa con todas las fotos (se abre con el botón "Fotos" de arriba a la derecha).
 * Props:
 *  - startId: id de una foto para abrir directo en el visor (opcional)
 *  - onClose: cerrar la galería
 */
export default function Galeria({ startId = null, onClose }) {
  const dialogRef = useRef(null)
  const lastFocus = useRef(null)
  const [cat, setCat] = useState('todas')
  const lista = useMemo(() => (cat === 'todas' ? fotos : fotos.filter((f) => f.cat === cat)), [cat])
  const [abierta, setAbierta] = useState(() => {
    const i = fotos.findIndex((f) => f.id === startId)
    return i >= 0 ? i : null // índice dentro de `lista` (al inicio es la lista completa)
  })

  useFocusTrap(dialogRef)

  // bloquea el scroll de la página y devuelve el foco al cerrar
  useEffect(() => {
    const previo = document.activeElement
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      previo?.focus?.()
    }
  }, [])

  // Esc cierra la galería (si el visor está abierto, Esc lo maneja el visor)
  useEffect(() => {
    if (abierta !== null) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [abierta, onClose])

  const abrirFoto = (i, e) => {
    lastFocus.current = e.currentTarget
    setAbierta(i)
  }
  const cerrarFoto = () => {
    setAbierta(null)
    // devuelve el foco a la miniatura desde la que se abrió
    requestAnimationFrame(() => lastFocus.current?.focus?.())
  }

  return (
    <div
      ref={dialogRef}
      className="gal"
      role="dialog"
      aria-modal="true"
      aria-label="Galería de fotos"
      tabIndex={-1}
    >
      <div className="gal__inner" inert={abierta !== null ? '' : undefined}>
        <header className="gal__head">
          <div className="gal__titles">
            <h2 className="gal__title">Galería</h2>
            <p className="gal__count">{lista.length === fotos.length ? `${fotos.length} fotos` : `${lista.length} de ${fotos.length} fotos`}</p>
          </div>

          <div className="gal__filters" role="group" aria-label="Filtrar fotos">
            {categorias.map((c) => (
              <button
                key={c.id}
                className={`chipbtn ${cat === c.id ? 'is-active' : ''}`}
                aria-pressed={cat === c.id}
                onClick={() => setCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button className="gal__close" onClick={onClose} aria-label="Cerrar galería">
            <CloseIcon />
            <span>Cerrar</span>
          </button>
        </header>

        <ul className="gal__grid">
          {lista.map((f, i) => (
            <li key={f.id} className="gal__li" style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}>
              <button className="gal__item" onClick={(e) => abrirFoto(i, e)} aria-label={`Ver foto: ${f.alt}`}>
                <img
                  src={f.thumb}
                  width={f.tw}
                  height={f.th}
                  alt=""
                  loading={i < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {abierta !== null && (
        <Lightbox
          fotos={lista}
          index={Math.min(abierta, lista.length - 1)}
          onClose={cerrarFoto}
          onChange={setAbierta}
        />
      )}
    </div>
  )
}
