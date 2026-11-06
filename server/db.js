// Elige la base de datos según DB_PROVIDER en .env:  sqlserver  |  sqlite (por defecto)
export async function abrirDb() {
  if ((process.env.DB_PROVIDER || 'sqlite').toLowerCase() === 'sqlserver') {
    const { abrirSqlServer } = await import('./db-sqlserver.js')
    return abrirSqlServer()
  }
  const { abrirSqlite } = await import('./db-sqlite.js')
  return abrirSqlite()
}
