import { useEffect, useRef } from 'react'
import { ChevronIcon, CloseIcon } from './Icons.jsx'
import useFocusTrap from '../hooks/useFocusTrap.js'

/**
 * Visor de foto a pantalla completa.
 * Props: lista de fotos, índice actual, onClose y onChange(nuevoÍndice).
 * Teclado: ← → para navegar, Esc para cerrar. En celular: deslizar con el dedo.
 */
export default function Lightbox({ fotos, index, onClose, onChange }) {
  const rootRef = useRef(null)
  const closeRef = useRef(null)
  const touchX = useRef(null)
  const foto = fotos[index]
  const total = fotos.length

  const ir = (delta) => onChange((index + delta + total) % total)

  useFocusTrap(rootRef)

  // foco inicial en el botón de cerrar
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') ir(-1)
      else if (e.key === 'ArrowRight') ir(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // precarga la foto anterior y la siguiente para que el cambio sea instantáneo
  useEffect(() => {
    ;[-1, 1].forEach((d) => {
      const vecina = fotos[(index + d + total) % total]
      if (vecina) new Image().src = vecina.src
    })
  }, [index, fotos, total])

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1)
  }

  if (!foto) return null

  return (
    <div
      ref={rootRef}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} de ${total}`}
    >
      <div className="lb__bar">
        <span className="lb__count" aria-live="polite">
          {index + 1} / {total}
        </span>
        <button ref={closeRef} className="lb__btn" onClick={onClose} aria-label="Cerrar foto">
          <CloseIcon />
        </button>
      </div>

      <div
        className="lb__stage"
        style={{ backgroundImage: `url(${foto.thumb})` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <img key={foto.id} className="lb__img" src={foto.src} width={foto.w} height={foto.h} alt={foto.alt} />
      </div>

      <button className="lb__nav lb__nav--prev" onClick={() => ir(-1)} aria-label="Foto anterior">
        <ChevronIcon direction="left" />
      </button>
      <button className="lb__nav lb__nav--next" onClick={() => ir(1)} aria-label="Foto siguiente">
        <ChevronIcon direction="right" />
      </button>

      <p className="lb__caption">{foto.alt}</p>
    </div>
  )
}
