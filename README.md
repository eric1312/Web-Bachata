# Martin del Valle · Salsa & Bachata

Web oficial del profe Martin del Valle, hecha con **React + Vite**.
Responsive (celular, tablet y escritorio), con animaciones al hacer scroll.

## Cómo correrla

```bash
npm install
npm run dev        # desarrollo → http://localhost:5173
npm run build      # genera la carpeta /dist lista para publicar
npm run preview    # prueba local del build
```

Requiere Node 18 o superior.

## Cómo actualizar la información (lo más importante)

**Todo el contenido editable está en un solo archivo: `src/data/info.js`**

- Horarios, lugares y direcciones → lista `horarios`
- Teléfono, Instagram, email → objeto `profe`
- Textos (lema, objetivos, misión, plan de acción) → objeto `textos`

Al cambiar un horario, también se actualiza solo el cartel “Próxima clase” del inicio.

### Pendientes para completar
1. **Ciudad para “Cómo llegar”**: completá `CIUDAD` en `info.js` para que Google Maps encuentre mejor las direcciones.
2. **Dirección del Galpón cultural** (martes): el flyer no la indica; agregala en `direccion` y aparecerá el botón de mapa.

## Estructura

```
src/
  data/info.js        ← contenido editable
  components/         ← una sección por archivo (Hero, Horarios, Contacto…)
  styles/index.css    ← estilos (colores en :root, arriba de todo)
  assets/             ← logos y fotos (PNG con fondo transparente)
```

Colores y tipografías se cambian en las variables CSS de `:root`.
Tipografías: Bebas Neue, Playfair Display y Poppins (Google Fonts, se cargan desde `index.html`).

## Publicarla
Subí la carpeta `dist/` a Vercel, Netlify, GitHub Pages o cualquier hosting estático
(el `base: './'` de `vite.config.js` permite publicarla en cualquier ruta).

## Galería de fotos
El botón **Fotos** (arriba a la derecha) abre la galería a pantalla completa, con filtros y visor.
También se puede compartir el link: `tu-dominio.com/#fotos` o una foto puntual `#fotos/16`.

**Agregar una foto nueva**
1. Guardá dos versiones en `src/assets/fotos/`: la completa (`19.webp`, ~1800 px de lado largo) y una chica (`19-thumb.webp`, ~720 px).
2. En `src/data/fotos.js` agregá los dos `import` y una entrada nueva en el array `fotos`
   (`id`, `cat`, `src`, `thumb`, medidas, `pos` y el texto `alt`).
3. **La primera foto del array es la portada** de la web. Las primeras 6 se muestran en la vista previa de la página.

Los recortes de los flyers (`src/assets/martin-*.png`) quedan en otras secciones; se pueden reemplazar por las fotos nuevas.

## Para que aparezca en Google (SEO)

La web ya incluye: título y descripción, etiquetas para compartir en WhatsApp/Instagram (`public/og-image.jpg`),
datos estructurados, `robots.txt`, `sitemap.xml` y un `<h1>` para buscadores.

1. **Editá `.env`** y poné el dominio real en `VITE_SITE_URL` (ej: `https://martindelvalle.com.ar`). Hacelo antes de `npm run build`.
2. `npm run build` y publicá la carpeta `dist/`.
3. Entrá a **Google Search Console** (search.google.com/search-console), agregá el dominio, verificalo,
   enviá `https://tu-dominio/sitemap.xml` y pedí la indexación de la página principal (“Inspección de URL”).
4. Creá la ficha en **Google Business Profile** (Google Maps) como profesor/escuela de baile, con zona, horarios,
   teléfono y la web. Es lo que más ayuda a aparecer en búsquedas locales (“clases de salsa en …”).
5. Poné el link de la web en Instagram, Spotify y WhatsApp Business.

Indexar puede tardar de unos días a un par de semanas. Aparecer *primero* depende de la competencia y de la zona.

## Formulario + base de datos + panel de Martin

El formulario **"Anotate a una clase"** guarda los datos en una base **SQLite** (archivo `server/data/martin.db`)
mediante un pequeño servidor Node (`server/`). No necesita instalar nada extra, pero requiere **Node 22 o superior**.

**Probarlo en tu compu**
1. En `.env` completá `ADMIN_PASSWORD` (mínimo 8 caracteres) y `SESSION_SECRET` (texto largo al azar).
2. En una terminal: `npm run server` (API en el puerto 3001). En otra: `npm run dev`.
3. Abrí la web, completá el formulario y entrá al panel en **`http://localhost:5173/#admin`**.

**Panel de Martin (`/#admin`)**: ver todas las inscripciones, buscar, filtrar por estado
(Nuevo / Contactado / Inscripto / Descartado), agregar notas, abrir el WhatsApp de la persona con un toque,
borrar y **descargar todo en CSV para Excel**.

**Publicarlo**: se necesita un hosting con Node (Render, Railway, Fly.io, un VPS…), no uno solo estático.
`npm run build` y luego `npm run server`: el mismo servidor entrega la web (`dist/`) y la API.
Configurá las variables de `.env` en el panel del hosting y **guardá la base en un disco persistente**
(`DB_PATH`). Hacé backup copiando `martin.db` de vez en cuando.

Seguridad incluida: contraseña con cookie `HttpOnly`, límite de intentos de login y de envíos por IP,
campo trampa anti-bots, validación en el servidor y consultas parametrizadas.
Si la web queda en otro dominio que el servidor, definí `VITE_API_URL` (en el build) y `ALLOWED_ORIGINS` (en el servidor).

## Usar SQL Server (LocalDB / SSMS) en vez de SQLite
1. Solo Windows. En la carpeta del proyecto: `npm install mssql msnodesqlv8`.
2. En `.env`: `DB_PROVIDER=sqlserver` y `SQLSERVER_CONNECTION=...` (ya viene con `(localdb)\MSSQLLocalDB`, base `MartinDelValle`).
3. Si LocalDB no está iniciada: `sqllocaldb start MSSQLLocalDB` en una terminal.
4. `npm run server`. Crea la base `MartinDelValle` y la tabla `dbo.inscripciones` solo (o ejecutá `server/setup.sql` en SSMS).
5. En SSMS conectate a `(localdb)\MSSQLLocalDB` → Bases de datos → MartinDelValle → Tablas → `dbo.inscripciones`.
6. Para volver a SQLite: `DB_PROVIDER=sqlite`.
