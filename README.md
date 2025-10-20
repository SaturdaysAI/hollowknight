# Hollow Knight — Wiki + Trivia (Proyecto Final)

Wiki fan‑made de Hollow Knight con minijuego de trivia y mapa interactivo. El sitio incluye Bosses, Warrior Dreams, Variants, Charms, Items y un World Map. Todo está construido con React + TypeScript + Vite y datos en JSON dentro del repositorio.

Este README explica cómo ejecutar, construir, desplegar y mantener el proyecto, y documenta las decisiones de arquitectura para que sea fácil de extender.

## Requisitos
- Node.js 18 o superior

## Puesta en marcha
- Instalar dependencias: `npm install`
- Arrancar en dev: `npm run dev`
- Build de producción: `npm run build`
- Previsualizar el build: `npm run preview`

## Estructura del proyecto
```
src/
  assets/                         Imágenes, fondos y vídeo local
    fondo-*.jpg|png               Fondos por sección (mapa usa fondo-map.jpg)
    bosses|charms|items|variants|warrior-dreams|areas  Thumbnails por slug
  components/                     NavBar, Footer, SearchBar
  content/
    trivia/questions.json         Preguntas de trivia
    wiki/                         Datos por sección (JSON)
      bosses.json
      warrior-dreams.json
      variants.json
      charms.json
      items.json
  features/
    trivia/pages/                 TriviaStart, TriviaResults
    wiki/components/              Galería reutilizable (Gallery.tsx)
    wiki/pages/                   Páginas de la wiki
      Home.tsx                    Portada con vídeo y búsqueda
      WikiIndex.tsx               Índice global con búsqueda compartible por URL
      WikiDetail.tsx              Detalle por grupo/slug (card + overview)
      BossesPage.tsx              Lista (muestra estrellas)
      WarriorDreamsPage.tsx       Lista
      VariantsPage.tsx            Lista
      CharmsPage.tsx              Lista (muescas)
      ItemsPage.tsx               Lista (categoría visible en la tarjeta)
      MapPage.tsx                 Mapa interactivo
      NotFound.tsx                404
```

## Rutas
- `/` portada
- `/wiki` índice y búsqueda
- `/wiki/{bosses|warrior-dreams|variants|charms|items}` secciones
- `/wiki/:group/:slug` detalle de una entrada
- `/wiki/map` mapa interactivo
- `/trivia` juego
- `/trivia/results` resultados

## Datos y assets
- Cada sección lee su JSON en `src/content/wiki/*.json`.
- Las imágenes se resuelven por `slug` con `import.meta.glob(..., { as: 'url', eager: true })` buscando `slug.(jpg|png|webp)` en `src/assets/<sección>` (no es necesario importar una a una).
- En el detalle:
  - Bosses/Dreams/Variants → `DIFFICULTY` (estrellas), `WHERE`, `DROPS` (en línea, sin viñetas).
  - Charms → `NOTCHES` + `USE`.
  - Items → `USE` y, opcionalmente, `BUY/SELL PRICE` (`buyGeo`/`sellGeo` en el JSON).

## Estilos y layout
- `src/index.css` define tokens y layouts (`.gallery-*`, `.detail-*`, navbar, hero...).
- Fondos por página con la variable CSS `--page-bg`:
  - Secciones: fijan su fondo al montar.
  - Detalle: hereda el fondo de su sección (mapeado en `WikiDetail.tsx`).
- El detalle envuelve contenido en una tarjeta (`.detail-wrap`) y el botón de retorno aparece en mayúsculas (“BACK TO …”).

## Mapa interactivo
- Imagen base `src/assets/mapa.jpg`.
- Arrastre con pointer events, zoom con clamp y “center on” al pulsar etiquetas.
- Barra superior con búsqueda y botón “BACK TO WIKI”.

## Trivia
- `TriviaStart.tsx`: selecciona categoría/dificultad/cantidad, baraja preguntas y respuestas y juega en la misma vista.
- `TriviaResults.tsx`: muestra puntuación y banner (GIF de victoria/derrota) + copy temático.

## Despliegue (GitHub Pages)
- `vite.config.ts` define `base: "/hollowknight/"` en producción.
- `src/App.tsx` usa `<BrowserRouter basename={import.meta.env.BASE_URL}>`.
- Workflow `.github/workflows/deploy.yml` compila y publica en Pages.
- Recomendación SPA: servir `index.html` como 404 (el workflow ya lo contempla si copias `index.html` a `404.html`).

## Mantenimiento aplicado
- Limpieza de archivos no usados (`src/assets/fondo{1,4,7,8,9,11}.jpg`, `hollow.png`, `react.svg`, `wiki-bg2.jpg`, backups y JSON sin uso).
- Unificación de fondos por sección y su detalle (Charms usa `fondo-charms.png`).
- Botón de retorno en mayúsculas y “DROPS” como texto, no lista.
- Título y resumen del detalle movidos dentro de la tarjeta.
- Mapa: botón junto a búsqueda y pan/zoom con límites.

## Problemas comunes
- 404 en rutas internas en Pages → asegúrate del `basename` en Router y `base` en Vite, y de publicar `index.html` como 404.
- Imágenes que no cargan → comprueba que el archivo se llame exactamente como el `slug` (y con extensión admitida) en `src/assets/<sección>`.

## Licencia
Proyecto fan con fines educativos. Hollow Knight es © Team Cherry.
