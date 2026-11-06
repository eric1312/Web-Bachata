// Servidor de la web: API del formulario + panel admin + (en producción) los archivos de dist/.
// Sin dependencias externas: usa solo Node 22+ (http, node:sqlite).
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { validarCambio, validarInscripcion } from './validar.js'
import { COOKIE, DURACION_SEG, crearToken, igualesSeguro, tokenValido } from './auth.js'
import { crearLimite } from './limite.js'

const PORT = Number(process.env.PORT) || 3001
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const DIST = resolve(process.env.DIST_DIR || './dist')

const { abrirDb } = await import('./db.js')
let db
try {
  db = await abrirDb()
} catch (e) {
  console.error('❌ No se pudo abrir la base de datos:', e.message)
  process.exit(1)
}

if (ADMIN_PASSWORD.length < 8) {
  console.warn('⚠️  ADMIN_PASSWORD no está definida (mínimo 8 caracteres): el panel admin queda DESHABILITADO.')
}

const limiteForm = crearLimite(5, 10 * 60 * 1000) // 5 envíos cada 10 min por IP
const limiteLogin = crearLimite(8, 15 * 60 * 1000) // 8 intentos de login cada 15 min por IP

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.woff2': 'font/woff2',
}

const ipDe = (req) => (process.env.TRUST_PROXY === '1' ? String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() : '') || req.socket.remoteAddress || '?'

function responder(res, status, cuerpo, headers = {}) {
  const base = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    ...headers,
  }
  if (typeof cuerpo === 'object' && !Buffer.isBuffer(cuerpo) && cuerpo !== null) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...base })
    return res.end(JSON.stringify(cuerpo))
  }
  res.writeHead(status, base)
  res.end(cuerpo)
}

function leerJson(req, max = 10_000) {
  return new Promise((ok, fallo) => {
    let tam = 0
    const partes = []
    req.on('data', (c) => {
      tam += c.length
      if (tam > max) {
        fallo(Object.assign(new Error('Demasiado grande'), { status: 413 }))
        req.destroy()
      } else partes.push(c)
    })
    req.on('end', () => {
      try {
        ok(partes.length ? JSON.parse(Buffer.concat(partes).toString('utf8')) : {})
      } catch {
        fallo(Object.assign(new Error('JSON inválido'), { status: 400 }))
      }
    })
    req.on('error', fallo)
  })
}

const cookieDe = (req, nombre) => {
  for (const par of String(req.headers.cookie || '').split(';')) {
    const [k, ...v] = par.trim().split('=')
    if (k === nombre) return v.join('=')
  }
  return ''
}
const esAdmin = (req) => ADMIN_PASSWORD.length >= 8 && tokenValido(cookieDe(req, COOKIE))

function cookieSesion(req, valor, seg) {
  const seguro = process.env.COOKIE_SECURE === '1' || req.headers['x-forwarded-proto'] === 'https'
  return `${COOKIE}=${valor}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${seg}${seguro ? '; Secure' : ''}`
}

// Evita que Excel interprete un texto como fórmula (=, +, -, @)
const csvCelda = (v) => {
  let s = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s
  return `"${s.replace(/"/g, '""')}"`
}

function exportarCsv(filas) {
  const cols = ['id', 'creado_en', 'nombre', 'whatsapp', 'email', 'clase', 'nivel', 'mensaje', 'estado', 'nota']
  const lineas = [cols.join(','), ...filas.map((f) => cols.map((c) => csvCelda(f[c])).join(','))]
  return '﻿' + lineas.join('\r\n') // BOM: Excel abre bien los acentos
}

/** Misma origen: el panel y la web comparten dominio. Bloquea POST/PATCH/DELETE desde otros sitios. */
function origenValido(req) {
  const o = req.headers.origin
  if (!o) return true
  try {
    const permitidos = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
    const u = new URL(o)
    const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1' // desarrollo: Vite en :5173
    return u.host === req.headers.host || local || permitidos.includes(o)
  } catch {
    return false
  }
}

async function api(req, res, url) {
  const ruta = url.pathname
  const metodo = req.method

  if (metodo !== 'GET' && metodo !== 'HEAD' && !origenValido(req)) return responder(res, 403, { error: 'Origen no permitido.' })

  // --- Público: enviar el formulario ---
  if (ruta === '/api/inscripciones' && metodo === 'POST') {
    const body = await leerJson(req)
    if (body.web) return responder(res, 201, { ok: true }) // honeypot: los bots lo completan; fingimos éxito
    if (!limiteForm(ipDe(req))) return responder(res, 429, { error: 'Enviaste muchas solicitudes. Probá de nuevo en unos minutos.' })
    const { datos, error } = validarInscripcion(body)
    if (error) return responder(res, 400, { error })
    const id = await db.crear(datos)
    return responder(res, 201, { ok: true, id })
  }

  // --- Admin: login / sesión ---
  if (ruta === '/api/admin/login' && metodo === 'POST') {
    if (ADMIN_PASSWORD.length < 8) return responder(res, 503, { error: 'Panel deshabilitado: falta ADMIN_PASSWORD en el servidor.' })
    if (!limiteLogin(ipDe(req))) return responder(res, 429, { error: 'Demasiados intentos. Esperá 15 minutos.' })
    const { password } = await leerJson(req)
    if (typeof password !== 'string' || !igualesSeguro(password, ADMIN_PASSWORD)) return responder(res, 401, { error: 'Contraseña incorrecta.' })
    return responder(res, 200, { ok: true }, { 'Set-Cookie': cookieSesion(req, crearToken(), DURACION_SEG) })
  }
  if (ruta === '/api/admin/logout' && metodo === 'POST') {
    return responder(res, 200, { ok: true }, { 'Set-Cookie': cookieSesion(req, '', 0) })
  }

  // --- Admin protegido ---
  if (ruta.startsWith('/api/admin/')) {
    if (!esAdmin(req)) return responder(res, 401, { error: 'No autorizado.' })

    if (ruta === '/api/admin/sesion' && metodo === 'GET') return responder(res, 200, { ok: true })

    if (ruta === '/api/admin/inscripciones' && metodo === 'GET') {
      const filas = await db.listar({ q: url.searchParams.get('q') || '', estado: url.searchParams.get('estado') || '' })
      return responder(res, 200, { items: filas, conteos: await db.conteos() })
    }

    if (ruta === '/api/admin/export.csv' && metodo === 'GET') {
      const filas = await db.listar({ q: url.searchParams.get('q') || '', estado: url.searchParams.get('estado') || '' })
      const fecha = new Date().toISOString().slice(0, 10)
      return responder(res, 200, exportarCsv(filas), {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="inscripciones-${fecha}.csv"`,
        'Cache-Control': 'no-store',
      })
    }

    const m = ruta.match(/^\/api\/admin\/inscripciones\/(\d+)$/)
    if (m) {
      const id = Number(m[1])
      if (metodo === 'PATCH') {
        const { datos, error } = validarCambio(await leerJson(req))
        if (error) return responder(res, 400, { error })
        if (!await db.actualizar(id, datos.estado, datos.nota)) return responder(res, 404, { error: 'No existe.' })
        return responder(res, 200, { item: await db.obtener(id), conteos: await db.conteos() })
      }
      if (metodo === 'DELETE') {
        if (!await db.borrar(id)) return responder(res, 404, { error: 'No existe.' })
        return responder(res, 200, { ok: true, conteos: await db.conteos() })
      }
    }
  }

  return responder(res, 404, { error: 'No encontrado.' })
}

function estatico(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return responder(res, 405, 'Método no permitido')
  let rel
  try {
    rel = decodeURIComponent(url.pathname)
  } catch {
    return responder(res, 400, 'Solicitud inválida')
  }
  let archivo = normalize(join(DIST, rel))
  if (archivo !== DIST && !archivo.startsWith(DIST + sep)) return responder(res, 403, 'Prohibido')
  if (!existsSync(archivo) || statSync(archivo).isDirectory()) archivo = join(DIST, 'index.html')
  if (!existsSync(archivo)) return responder(res, 404, 'Primero ejecutá "npm run build" para generar la carpeta dist/.')
  const ext = extname(archivo).toLowerCase()
  const cache = archivo.includes(`${sep}assets${sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache'
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache, 'X-Content-Type-Options': 'nosniff' })
  if (req.method === 'HEAD') return res.end()
  createReadStream(archivo).pipe(res)
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname.startsWith('/api/')) return await api(req, res, url)
    return estatico(req, res, url)
  } catch (e) {
    const status = e.status || 500
    if (status === 500) console.error(e)
    if (!res.headersSent) responder(res, status, { error: status === 500 ? 'Error del servidor.' : e.message })
  }
})

server.listen(PORT, () => console.log(`✅ Servidor listo en http://localhost:${PORT}  (base: ${(process.env.DB_PROVIDER || 'sqlite') === 'sqlserver' ? 'SQL Server' : process.env.DB_PATH || './server/data/martin.db'})`))

const salir = () => {
  server.close(async () => {
    await db.cerrar()
    process.exit(0)
  })
}
process.on('SIGINT', salir)
process.on('SIGTERM', salir)