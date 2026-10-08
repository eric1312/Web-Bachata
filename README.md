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
1. **Spotify**: en `info.js`, `profe.spotifyUrl` apunta a una búsqueda. Reemplazalo por el link directo a su playlist/perfil.
2. **Ciudad para “Cómo llegar”**: completá `CIUDAD` en `info.js` para que Google Maps encuentre mejor las direcciones.
3. **Dirección del Galpón cultural** (martes): el flyer no la indica; agregala en `direccion` y aparecerá el botón de mapa.

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

## Sobre las fotos
Las fotos de Martin se recortaron de los flyers, por eso tienen resolución limitada
(se ven bien en tamaño chico/mediano). Si tiene las fotos originales, reemplazar los
archivos `src/assets/martin-*.png` (mismo nombre) mejora mucho la calidad.
