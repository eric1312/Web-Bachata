import { useCallback, useEffect, useState } from 'react'
import { api, urlApi } from '../lib/api.js'

const ESTADOS = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'contactado', label: 'Contactado' },
  { id: 'inscripto', label: 'Inscripto' },
  { id: 'descartado', label: 'Descartado' },
]

const fecha = (iso) =>
  new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

const waLink = (tel) => {
  let d = tel.replace(/\D/g, '')
  if (d.startsWith('0')) d = d.slice(1)
  if (!d.startsWith('54')) d = '549' + d
  return `https://wa.me/${d}`
}

function Login({ onOk }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await api('/api/admin/login', { method: 'POST', body: { password: pass } })
      onOk()
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <form className="adm__login" onSubmit={enviar}>
      <h1>Panel de Martin</h1>
      <label className="field">
        <span>Contraseña</span>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" autoFocus />
      </label>
      {error && <p className="form__error" role="alert">{error}</p>}
      <button className="btn btn--primary" disabled={cargando || !pass}>
        {cargando ? 'Entrando…' : 'Entrar'}
      </button>
      <a className="adm__volver" href="#inicio">← Volver a la web</a>
    </form>
  )
}

function Fila({ item, onCambio, onBorrar }) {
  const [estado, setEstado] = useState(item.estado)
  const [nota, setNota] = useState(item.nota)
  const [guardando, setGuardando] = useState(false)
  const sucio = estado !== item.estado || nota !== item.nota

  const guardar = async () => {
    setGuardando(true)
    try {
      await onCambio(item.id, { estado, nota })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <li className={`adm__item adm__item--${item.estado}`}>
      <div className="adm__top">
        <strong>{item.nombre}</strong>
        <time dateTime={item.creado_en}>{fecha(item.creado_en)}</time>
      </div>
      <p className="adm__datos">
        <a href={waLink(item.whatsapp)} target="_blank" rel="noopener noreferrer">{item.whatsapp}</a>
        {item.email && <> · <a href={`mailto:${item.email}`}>{item.email}</a></>}
      </p>
      {(item.clase || item.nivel) && (
        <p className="adm__tags">
          {item.clase && <span>{item.clase}</span>}
          {item.nivel && <span>{item.nivel}</span>}
        </p>
      )}
      {item.mensaje && <p className="adm__msg">{item.mensaje}</p>}

      <div className="adm__edit">
        <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label={`Estado de ${item.nombre}`}>
          {ESTADOS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <input value={nota} onChange={(e) => setNota(e.target.value)} maxLength={500} placeholder="Nota interna" aria-label={`Nota sobre ${item.nombre}`} />
        <button className="adm__btn adm__btn--ok" onClick={guardar} disabled={!sucio || guardando}>
          {guardando ? '…' : 'Guardar'}
        </button>
        <button
          className="adm__btn adm__btn--del"
          onClick={() => window.confirm(`¿Borrar a ${item.nombre}? No se puede deshacer.`) && onBorrar(item.id)}
        >
          Borrar
        </button>
      </div>
    </li>
  )
}

export default function AdminPanel() {
  const [sesion, setSesion] = useState('cargando') // cargando | no | si
  const [items, setItems] = useState([])
  const [conteos, setConteos] = useState({ total: 0 })
  const [filtro, setFiltro] = useState('')
  const [q, setQ] = useState('')
  const [qAplicada, setQAplicada] = useState('')
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setError('')
    try {
      const p = new URLSearchParams()
      if (filtro) p.set('estado', filtro)
      if (qAplicada) p.set('q', qAplicada)
      const d = await api(`/api/admin/inscripciones?${p}`)
      setItems(d.items)
      setConteos(d.conteos)
      setSesion('si')
    } catch (e) {
      if (e.status === 401) setSesion('no')
      else {
        setError(e.message)
        setSesion((s) => (s === 'cargando' ? 'no' : s))
      }
    }
  }, [filtro, qAplicada])

  useEffect(() => {
    cargar()
  }, [cargar])

  // búsqueda con pequeña demora
  useEffect(() => {
    const t = setTimeout(() => setQAplicada(q.trim()), 300)
    return () => clearTimeout(t)
  }, [q])

  const cambiar = async (id, datos) => {
    try {
      const d = await api(`/api/admin/inscripciones/${id}`, { method: 'PATCH', body: datos })
      setConteos(d.conteos)
      setItems((l) => l.map((i) => (i.id === id ? d.item : i)))
    } catch (e) {
      setError(e.message)
      if (e.status === 401) setSesion('no')
    }
  }
  const borrar = async (id) => {
    try {
      const d = await api(`/api/admin/inscripciones/${id}`, { method: 'DELETE' })
      setConteos(d.conteos)
      setItems((l) => l.filter((i) => i.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }
  const salir = async () => {
    await api('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setSesion('no')
  }

  const csv = urlApi(`/api/admin/export.csv?${new URLSearchParams({ ...(filtro && { estado: filtro }), ...(qAplicada && { q: qAplicada }) })}`)

  if (sesion === 'cargando') return <main className="adm adm--centro"><p>Cargando…</p></main>
  if (sesion === 'no')
    return (
      <main className="adm adm--centro">
        {error && <p className="form__error" role="alert">{error}</p>}
        <Login onOk={cargar} />
      </main>
    )

  return (
    <main className="adm">
      <header className="adm__head">
        <h1>Inscripciones</h1>
        <div className="adm__acciones">
          <a className="adm__btn" href={csv}>Descargar Excel (CSV)</a>
          <a className="adm__btn" href="#inicio">Ver la web</a>
          <button className="adm__btn" onClick={salir}>Salir</button>
        </div>
      </header>

      <div className="adm__filtros">
        <button className={`chipbtn ${filtro === '' ? 'is-active' : ''}`} onClick={() => setFiltro('')}>
          Todas ({conteos.total})
        </button>
        {ESTADOS.map((s) => (
          <button key={s.id} className={`chipbtn ${filtro === s.id ? 'is-active' : ''}`} onClick={() => setFiltro(s.id)}>
            {s.label} ({conteos[s.id] ?? 0})
          </button>
        ))}
        <input className="adm__buscar" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre, teléfono, email…" aria-label="Buscar" />
      </div>

      {error && <p className="form__error" role="alert">{error}</p>}

      {items.length === 0 ? (
        <p className="adm__vacio">No hay inscripciones {filtro || qAplicada ? 'con ese filtro' : 'todavía'}.</p>
      ) : (
        <ul className="adm__lista">
          {items.map((i) => (
            <Fila key={`${i.id}-${i.estado}-${i.nota}`} item={i} onCambio={cambiar} onBorrar={borrar} />
          ))}
        </ul>
      )}
    </main>
  )
}
