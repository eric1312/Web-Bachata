import { ESTADOS } from './estados.js'

const limpiar = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // caracteres de control
    .trim()
    .slice(0, max)

/** Valida el formulario público. Devuelve { datos } o { error }. */
export function validarInscripcion(b = {}) {
  const nombre = limpiar(b.nombre, 80)
  const whatsapp = limpiar(b.whatsapp, 30)
  const email = limpiar(b.email, 120)
  const clase = limpiar(b.clase, 80)
  const nivel = limpiar(b.nivel, 40)
  const mensaje = limpiar(b.mensaje, 1000)

  if (nombre.length < 2) return { error: 'Ingresá tu nombre.' }
  const digitos = whatsapp.replace(/\D/g, '')
  if (digitos.length < 8 || digitos.length > 15 || !/^[\d\s+()\-.]+$/.test(whatsapp))
    return { error: 'Ingresá un WhatsApp válido (solo números, con código de área).' }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'El email no parece válido.' }

  return { datos: { nombre, whatsapp, email, clase, nivel, mensaje } }
}

export function validarCambio(b = {}) {
  if (!ESTADOS.includes(b.estado)) return { error: 'Estado inválido.' }
  return { datos: { estado: b.estado, nota: limpiar(b.nota, 500) } }
}
