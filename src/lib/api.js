// Si la web y el servidor están en el mismo dominio, no hace falta configurar nada.
// Si el servidor está en otro dominio, definí VITE_API_URL en .env (ej: https://api.midominio.com)
const BASE = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '')

export async function api(ruta, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(BASE + ruta, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw Object.assign(new Error('No hay conexión con el servidor. Probá de nuevo.'), { status: 0 })
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || 'Ocurrió un error.'), { status: res.status })
  return data
}

export const urlApi = (ruta) => BASE + ruta
