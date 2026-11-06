/** Límite simple de intentos por clave (IP) en una ventana de tiempo. En memoria. */
export function crearLimite(max, ventanaMs) {
  const m = new Map()
  return (clave) => {
    const ahora = Date.now()
    const e = m.get(clave)
    if (!e || e.reinicia < ahora) {
      m.set(clave, { n: 1, reinicia: ahora + ventanaMs })
      if (m.size > 5000) for (const [k, v] of m) if (v.reinicia < ahora) m.delete(k)
      return true
    }
    e.n += 1
    return e.n <= max
  }
}
