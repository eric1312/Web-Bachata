import { ESTADOS } from './estados.js'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'


/** Abre (y crea si hace falta) la base SQLite. Es un único archivo: copiarlo = hacer backup. */
export async function abrirSqlite(ruta = process.env.DB_PATH || './server/data/martin.db') {
  const [mayor, menor] = process.versions.node.split('.').map(Number)
  if (mayor < 22 || (mayor === 22 && menor < 13))
    throw new Error(`Tu Node es ${process.versions.node}. SQLite necesita Node 22.13 o superior (nodejs.org).`)
  const { DatabaseSync } = await import('node:sqlite')
  const archivo = resolve(ruta)
  mkdirSync(dirname(archivo), { recursive: true })
  const db = new DatabaseSync(archivo)
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS inscripciones (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre    TEXT NOT NULL,
      whatsapp  TEXT NOT NULL,
      email     TEXT NOT NULL DEFAULT '',
      clase     TEXT NOT NULL DEFAULT '',
      nivel     TEXT NOT NULL DEFAULT '',
      mensaje   TEXT NOT NULL DEFAULT '',
      estado    TEXT NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo','contactado','inscripto','descartado')),
      nota      TEXT NOT NULL DEFAULT '',
      creado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
    CREATE INDEX IF NOT EXISTS idx_insc_estado ON inscripciones(estado, creado_en);
  `)

  const q = {
    insertar: db.prepare(
      `INSERT INTO inscripciones (nombre, whatsapp, email, clase, nivel, mensaje)
       VALUES (@nombre, @whatsapp, @email, @clase, @nivel, @mensaje)`
    ),
    actualizar: db.prepare(`UPDATE inscripciones SET estado = @estado, nota = @nota WHERE id = @id`),
    borrar: db.prepare(`DELETE FROM inscripciones WHERE id = ?`),
    uno: db.prepare(`SELECT * FROM inscripciones WHERE id = ?`),
  }

  return {
    crear: (d) => Number(q.insertar.run(d).lastInsertRowid),
    obtener: (id) => q.uno.get(id),
    actualizar: (id, estado, nota) => q.actualizar.run({ id, estado, nota }).changes > 0,
    borrar: (id) => q.borrar.run(id).changes > 0,
    listar({ q: texto = '', estado = '' } = {}) {
      const where = []
      const params = []
      if (ESTADOS.includes(estado)) {
        where.push('estado = ?')
        params.push(estado)
      }
      if (texto) {
        const like = `%${texto.replace(/[\\%_]/g, '\\$&')}%`
        where.push(`(nombre LIKE ? ESCAPE '\\' OR whatsapp LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR mensaje LIKE ? ESCAPE '\\')`)
        params.push(like, like, like, like)
      }
      const sql = `SELECT * FROM inscripciones ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC LIMIT 2000`
      return db.prepare(sql).all(...params)
    },
    conteos() {
      const filas = db.prepare(`SELECT estado, COUNT(*) AS n FROM inscripciones GROUP BY estado`).all()
      const out = { total: 0, nuevo: 0, contactado: 0, inscripto: 0, descartado: 0 }
      for (const f of filas) {
        out[f.estado] = f.n
        out.total += f.n
      }
      return out
    },
    cerrar: () => db.close(),
  }
}
