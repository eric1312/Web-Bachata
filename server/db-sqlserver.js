// Conexión a Microsoft SQL Server (incluye LocalDB: (localdb)\MSSQLLocalDB) usando Autenticación de Windows.
// Requiere:  npm install mssql msnodesqlv8   (solo Windows)
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const DEFAULT_CONN =
  'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=MartinDelValle;Trusted_Connection=yes;'

const esc = (t) => t.replace(/[\\%_[]/g, '\\$&')

export async function abrirSqlServer(conexion = process.env.SQLSERVER_CONNECTION || DEFAULT_CONN) {
  let sql
  try {
    sql = require('mssql/msnodesqlv8')
  } catch {
    throw new Error('Falta instalar el conector de SQL Server. Ejecutá:  npm install mssql msnodesqlv8')
  }

  // Nombre de la base: se crea sola si no existe (conectando primero a "master")
  const m = conexion.match(/Database=([^;]+)/i)
  const nombreDb = m ? m[1].trim() : 'MartinDelValle'
  if (!/^[A-Za-z0-9_]+$/.test(nombreDb)) throw new Error('Nombre de base inválido (usá letras, números y _).')

  const admin = await new sql.ConnectionPool({ connectionString: conexion.replace(/Database=[^;]+/i, 'Database=master') }).connect()
  await admin.request().query(`IF DB_ID(N'${nombreDb}') IS NULL CREATE DATABASE [${nombreDb}]`)
  await admin.close()

  const pool = await new sql.ConnectionPool({ connectionString: conexion }).connect()
  await pool.request().query(`
    IF OBJECT_ID(N'dbo.inscripciones', N'U') IS NULL
    CREATE TABLE dbo.inscripciones (
      id        INT IDENTITY(1,1) PRIMARY KEY,
      nombre    NVARCHAR(80)   NOT NULL,
      whatsapp  NVARCHAR(30)   NOT NULL,
      email     NVARCHAR(120)  NOT NULL CONSTRAINT DF_insc_email DEFAULT '',
      clase     NVARCHAR(80)   NOT NULL CONSTRAINT DF_insc_clase DEFAULT '',
      nivel     NVARCHAR(40)   NOT NULL CONSTRAINT DF_insc_nivel DEFAULT '',
      mensaje   NVARCHAR(1000) NOT NULL CONSTRAINT DF_insc_msg DEFAULT '',
      estado    NVARCHAR(12)   NOT NULL CONSTRAINT DF_insc_estado DEFAULT 'nuevo'
                CONSTRAINT CK_insc_estado CHECK (estado IN ('nuevo','contactado','inscripto','descartado')),
      nota      NVARCHAR(500)  NOT NULL CONSTRAINT DF_insc_nota DEFAULT '',
      creado_en DATETIME2      NOT NULL CONSTRAINT DF_insc_fecha DEFAULT SYSUTCDATETIME()
    )`)

  const COLS = `id, nombre, whatsapp, email, clase, nivel, mensaje, estado, nota,
                CONVERT(VARCHAR(33), creado_en, 127) + 'Z' AS creado_en`
  const NV = sql.NVarChar

  return {
    async crear(d) {
      const r = await pool
        .request()
        .input('nombre', NV(80), d.nombre)
        .input('whatsapp', NV(30), d.whatsapp)
        .input('email', NV(120), d.email)
        .input('clase', NV(80), d.clase)
        .input('nivel', NV(40), d.nivel)
        .input('mensaje', NV(1000), d.mensaje)
        .query(`INSERT INTO dbo.inscripciones (nombre, whatsapp, email, clase, nivel, mensaje)
                OUTPUT INSERTED.id VALUES (@nombre, @whatsapp, @email, @clase, @nivel, @mensaje)`)
      return r.recordset[0].id
    },
    async obtener(id) {
      const r = await pool.request().input('id', sql.Int, id).query(`SELECT ${COLS} FROM dbo.inscripciones WHERE id = @id`)
      return r.recordset[0]
    },
    async actualizar(id, estado, nota) {
      const r = await pool
        .request()
        .input('id', sql.Int, id)
        .input('estado', NV(12), estado)
        .input('nota', NV(500), nota)
        .query(`UPDATE dbo.inscripciones SET estado = @estado, nota = @nota WHERE id = @id`)
      return r.rowsAffected[0] > 0
    },
    async borrar(id) {
      const r = await pool.request().input('id', sql.Int, id).query(`DELETE FROM dbo.inscripciones WHERE id = @id`)
      return r.rowsAffected[0] > 0
    },
    async listar({ q: texto = '', estado = '' } = {}) {
      const req = pool.request()
      const where = []
      if (['nuevo', 'contactado', 'inscripto', 'descartado'].includes(estado)) {
        where.push('estado = @estado')
        req.input('estado', NV(12), estado)
      }
      if (texto) {
        req.input('like', NV(300), `%${esc(texto)}%`)
        where.push(`(nombre LIKE @like ESCAPE '\\' OR whatsapp LIKE @like ESCAPE '\\' OR email LIKE @like ESCAPE '\\' OR mensaje LIKE @like ESCAPE '\\')`)
      }
      const r = await req.query(
        `SELECT TOP 2000 ${COLS} FROM dbo.inscripciones ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC`
      )
      return r.recordset
    },
    async conteos() {
      const r = await pool.request().query(`SELECT estado, COUNT(*) AS n FROM dbo.inscripciones GROUP BY estado`)
      const out = { total: 0, nuevo: 0, contactado: 0, inscripto: 0, descartado: 0 }
      for (const f of r.recordset) {
        out[f.estado] = f.n
        out.total += f.n
      }
      return out
    },
    cerrar: () => pool.close(),
  }
}
