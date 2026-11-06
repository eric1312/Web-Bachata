import { useEffect } from 'react'

const FOCUSABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Mantiene el foco del teclado (Tab / Shift+Tab) dentro de `ref` mientras está activo.
 * Se usa en la galería y en el visor de fotos para que no se "escape" a la página de atrás.
 */
export default function useFocusTrap(ref, active = true) {
  useEffect(() => {
    const root = ref.current
    if (!root || !active) return

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const items = [...root.querySelectorAll(FOCUSABLES)].filter((el) => el.getClientRects().length > 0)
      e.stopPropagation() // el visor (hijo) maneja el Tab antes que la galería (padre)
      if (!items.length) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const fuera = !root.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || fuera)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || fuera)) {
        e.preventDefault()
        first.focus()
      }
    }

    root.addEventListener('keydown', onKeyDown)
    return () => root.removeEventListener('keydown', onKeyDown)
  }, [ref, active])
}
