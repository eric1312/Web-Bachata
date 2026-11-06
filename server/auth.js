import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const DURACION_MS = 12 * 60 * 60 * 1000
const secreto = process.env.SESSION_SECRET || randomBytes(32).toString('hex') // sin SESSION_SECRET, las sesiones se cierran al reiniciar

const firmar = (txt) => createHmac('sha256', secreto).update(txt).digest('base64url')

export function igualesSeguro(a, b) {
  const ha = createHmac('sha256', 'cmp').update(String(a)).digest()
  const hb = createHmac('sha256', 'cmp').update(String(b)).digest()
  return timingSafeEqual(ha, hb)
}

export const crearToken = () => {
  const exp = String(Date.now() + DURACION_MS)
  return `${exp}.${firmar(exp)}`
}

export function tokenValido(token = '') {
  const [exp, firma] = String(token).split('.')
  if (!exp || !firma || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false
  const esperada = firmar(exp)
  return firma.length === esperada.length && igualesSeguro(firma, esperada)
}

export const COOKIE = 'mdv_admin'
export const DURACION_SEG = DURACION_MS / 1000
