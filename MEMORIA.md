# Memoria del proyecto

Notas de trabajo de la web de IEEE CIS UNI: decisiones, cosas a tener en cuenta,
pendientes e historial de cada sesión. Claude la lee al empezar cada
conversación (se carga desde `CLAUDE.md`), y el equipo también puede leerla y
agregar notas.

- **No guardar aquí nada privado** (llaves, contraseñas, datos personales): este
  archivo está en GitHub.
- Lo que ya se ve en el código o en `git log` no se repite; aquí va el *por qué*.
- Para editar contenido en Supabase, la guía es [docs/supabase-contenido.md](docs/supabase-contenido.md).

---

## 1. El proyecto en breve

- **Qué es:** web oficial del Capítulo Estudiantil IEEE CIS de la UNI.
- **En producción:** https://ieee.cis.uni.edu.pe (Vercel). Cada push a `main`
  se publica solo en ~1 minuto. Se trabaja directamente en `main`.
- **Repo:** `IEEE-CIS-UNI/ieee-cis-uni-website`. Creado por Sebastián Huaypar
  (may-2026); desde entonces lo mantiene sobre todo Ismael Rojas, con aportes
  de Kevin Pinto.
- **Stack:** Next.js 16.2.5 (App Router, Turbopack), React 19, TypeScript,
  Tailwind v4, Framer Motion, Supabase, Spline (robot 3D), Nodemailer (contacto).
- **Paquetes:** el lockfile es `pnpm-lock.yaml` (usar `pnpm`).
- **Ojo:** Next 16 tiene cambios grandes. Antes de usar una API de Next, leer
  la guía en `node_modules/next/dist/docs/` (lo pide `AGENTS.md`).

## 2. Cómo está armado

| Página | Contenido | De dónde salen los datos |
| --- | --- | --- |
| `/` | Hero con robot 3D, Nosotros, Equipo (BOARD), Proyectos destacados, Eventos, Blog | Supabase (desde el navegador) |
| `/nosotros` | Hero con carrusel, GlobalCIS, Stats, Respaldo Institucional | Storage `aboutus/about/` |
| `/miembros` | Pestañas Directorio / Organigrama | Tabla `miembros` |
| `/proyectos` | Grilla con filtros por tag + la Ruleta | Tabla `proyectos` + `src/data/hardcoded-projects.ts` |
| `/proyectos/[slug]` | Detalle + "Equipo del proyecto" | Servidor, ISR 5 min |
| `/proyectos/ruleta` | Ruleta CIS (herramienta interna, no está en Supabase) | Código |
| `/eventos` | Hero con carrusel, calendario, lista con filtros, Instagram | Tabla `eventos`, Storage `hero-eventos` |
| `/blog`, `/blog/[slug]` | Posts con filtros por categoría | Tabla `blog` (solo `published = true`), ISR 5 min |
| `/contacto` | Formulario que envía correo (Server Action + SMTP) | `src/app/actions/contact.ts` |

- **Menú:** `src/data/navigation.json`. "Únete" lleva a `/contacto` (decidido así).
- **Tema:** oscuro por defecto; se guarda en `localStorage` (`ieee-theme`). Los
  colores son variables CSS en `globals.css` (`--brand-*`).
- **Helpers en `src/lib/`:**
  - `url.ts` → `normalizeUrl()` corrige enlaces de Supabase (sin `https://`,
    `htps://`, `#`, vacío = `null`).
  - `events.ts` → `isPastEvent()`: un evento es pasado si `is_past` o si la
    fecha ya pasó en hora de Lima.
  - `authors.ts` → cruza `proyectos.autores` con `miembros` (foto + LinkedIn).
  - `useIsDesktop.ts` → `true` solo en pantallas ≥1024px.
- **Títulos de pestaña:** el layout usa la plantilla `"%s | IEEE CIS UNI"`; cada
  página pone solo su nombre (`"Proyectos"`, no `"Proyectos | IEEE CIS UNI"`).

### Herramientas de diseño para Claude (`.claude/`)

Copiadas de `arness_inicial` el 2026-11-08. Se usan para trabajo de UI/UX:

- **Skills** (`.claude/skills/`): `impeccable` (diseño general: crear,
  criticar, auditar, pulir), `emil-design-eng`, `animate`, `choreograph`,
  `review-animations`, `animation-performance`, `apple-design`,
  `mobile-native`, `break-ui`, `prototype`, `pick-ui-library`.
- **Agentes** (`.claude/agents/`): `disenador` (diseñador UI/UX en español; lee
  esta memoria antes de proponer) y los 4 `impeccable-*` que usa la skill.
- Si una skill choca con una decisión de la sección 3, manda la decisión,
  salvo que se cambie a propósito y se anote aquí.

## 3. Decisiones tomadas (y por qué)

- **Enlace vacío = no se muestra.** Íconos de LinkedIn/GitHub y botones
  "Registrarme", "Ver Repositorio" o "Ver Demo" se ocultan si el campo está
  vacío; aparecen solos cuando el equipo lo llena en Supabase. Se descartó
  dejarlos visibles apuntando a `#`.
- **Robot 3D (Spline):**
  - En **Inicio** se carga en todos los dispositivos; en celular va **arriba
    del texto**. Lo pidió Ismael porque así funcionaba bien.
  - En **/proyectos** solo en escritorio; en celular sale `hero_image.png`
    porque esa escena pesa demasiado para el teléfono. Mantenerlo así.
- **Fondo de redes neuronales (`NeuralNetworkBackground.tsx`):** la red se crea
  una sola vez y solo se reubica al cambiar el tamaño. El canvas mide
  `max(100%, 100lvh)` para que la barra del navegador del celular no lo
  redimensione al hacer scroll (antes se reconstruía en cada scroll y
  parpadeaba o desaparecía). Sin degradados por cuadro (sprite pre-renderizado),
  30 fps en táctil, pausa si no se ve y responde al dedo. El desenfoque encima
  (`backdrop-blur`) solo va desde `md:`.
- **El tema se decide en el `<head>`, antes de pintar** (`THEME_INIT_SCRIPT`
  en `layout.tsx`, clave `ieee-theme`). No volver a calcular ni aplicar el tema
  en un efecto al cargar: eso causaba el salto oscuro → claro en celulares.
- **Rendimiento (no volver atrás):**
  - Datos de las páginas: pedirlos en el servidor con `src/lib/queries.ts` y
    pasarlos como `initial*` a los componentes, no solo en un `useEffect`.
  - Contenido visible al cargar (heroes, detalle): animar con las clases CSS
    `animate-fade-in-*`, no con `initial={{ opacity: 0 }}` de Framer Motion.
  - Nunca `background-image: url(foto original)` para fondos difuminados: usar
    `BlurredBackdrop`.
  - Escenas de Spline siempre con `LazySpline`.
- **Dos azules:** `--brand-accent` para fondos y botones con texto blanco, y
  `--brand-accent-text` para texto (más luminoso en modo oscuro). Un solo tono
  no puede cumplir 4,5:1 en los dos casos.
- **Un solo fondo para toda la web:** `src/components/ui/BrandOrbs.tsx` (orbe
  azul a la izquierda, morado a la derecha). Las páginas no ponen fondo propio
  en su contenedor, porque taparía los orbes. En modo claro: azul claro `#60a5fa`
  y el morado original `#7c3aed` (más tenues en celular).
- **Orbes de fondo quietos en celular** (<768px) y con "reducir movimiento".
- **Dominio único en `src/lib/site.ts` (`SITE_URL`)**: lo usan el sitemap,
  `robots.txt` y las vistas previas (`metadataBase`). Si cambia el dominio, se
  cambia solo ahí.
- **Tags y categorías no se tocan en código:** los filtros se generan a partir
  de lo que se escriba en Supabase.
- **Equipo del proyecto:** columna `proyectos.autores` (`text[]`), formato JSON
  `["Nombre Apellido (Rol)"]`. Si coinciden nombre y apellido con un miembro,
  sale con foto y LinkedIn.
- **Imagen del detalle del proyecto:** se muestra completa con su proporción
  real (antes se recortaba a 4:3).
- **Pestaña activa del menú:** queda resaltada con el mismo estilo del hover.
- **Correo oficial:** ieee.cis@uni.edu.pe.

## 4. Cosas a tener en cuenta

- **Supabase desde el código es solo lectura** (llave anon + RLS). Los
  intentos de escribir devuelven `[]` sin error. Los cambios de datos se hacen
  en el panel de Supabase.
- **Caché:** las listas se actualizan al recargar; los detalles de proyecto y
  blog tardan hasta 5 min. Para cambiar una imagen, subirla **con otro nombre**.
- **Cambiar un `slug` rompe el enlace viejo** (no hay redirección automática).
- **Next/Image** solo acepta imágenes de `*.supabase.co` e `images.unsplash.com`
  (`next.config.ts`).
- **Errores de Spline:** `SplineErrorSuppressor.tsx` y el filtro de
  `console.error` en `Hero.tsx` silencian errores internos inofensivos del motor 3D.
- **Verificar en celular:** el Chrome headless tiene un ancho mínimo de ~500px;
  para 390px usar puppeteer con `setViewport`.
- **Caché de datos de Next:** las páginas estáticas guardan la respuesta de
  Supabase. Todo lo que lea Supabase en el servidor necesita `revalidate`
  (detalles 5 min, sitemap 1 h), o se queda con datos viejos hasta el
  próximo deploy. Localmente: `rm -rf .next/cache/fetch-cache`.
- **`ruleta.md`** en la raíz es el prototipo HTML original de la ruleta, no
  documentación.

## 5. Pendientes

- [ ] Footer: logo como botón "Volver arriba" (pedido del webmaster).
- [ ] Colores del robot y franja blanca: se cambian en el editor de Spline, no en código.
- [ ] Probar en un celular real si el robot del Inicio impide bajar la página al deslizar sobre él.
- [ ] Confirmar el texto "Soluciones Realidad" del hero de /proyectos (¿"Reales"?).
- [ ] Avisar a Google Search Console del nuevo sitemap
      (`https://ieee.cis.uni.edu.pe/sitemap.xml`), si el capítulo tiene acceso.
- [ ] Datos en Supabase: despublicar "Publicación de prueba" del blog; completar
      enlaces faltantes de LinkedIn/GitHub en `miembros`.

---

## 6. Historial de sesiones

> Al cerrar cada conversación, agregar una entrada arriba de la anterior
> (fecha, qué se hizo, decisiones, pendientes nuevos).

### 2026-11-10 — Rendimiento en celular (sin cambios visuales)

Medido en celular simulado lento (CPU 4×, red 4G lenta), versión anterior vs
nueva con el mismo servidor, mediana de 3 corridas:

| Página | Contenido principal | CPU bloqueada al cargar | Al hacer scroll |
|---|---|---|---|
| Inicio | 2,3 → 1,1 s | 13,5 → 1,3 s | 4,1 → 0 s |
| Nosotros | 6,1 → 1,4 s | 2,3 → 0,1 s | 1,2 → 0 s |
| Miembros | 4,2 → 1,2 s | 1,0 → 0,2 s | 0 → 0 s |
| Eventos | 9,1 → 1,5 s | 1,2 → 0,3 s | 0,2 → 0 s |
| Proyectos* | 3,5 → 3,2 s | 8,3 → 0,2 s | 1,1 → 0 s |
| Blog* | 9,0 → 2,4 s | 7,2 → 0,3 s | 1,0 → 0 s |

\* Proyectos y Blog comparados contra la web publicada.

- Datos de Supabase pedidos en el servidor (`src/lib/queries.ts`) y enviados en
  el HTML; los componentes los reciben como valor inicial y siguen consultando
  en segundo plano. Páginas con `revalidate = 60`.
- Fondo de redes neuronales: líneas en una capa guardada y trazos agrupados
  (era la función que más CPU usaba de toda la web).
- Robot 3D (`LazySpline`): se pausa fuera de pantalla; en táctil carga cuando la
  página ya terminó.
- Entradas de los heroes y detalles con CSS en vez de Framer Motion (el
  contenido llegaba con `opacity:0` hasta que cargaba el JavaScript).
- Fondos difuminados con `BlurredBackdrop` (imagen optimizada de 48 px) en vez
  de `background-image` con el original: en /eventos se bajaban ~7 MB.
- Carruseles: la primera foto con prioridad y las demás se cargan de a una.

### 2026-11-10 — Tema correcto desde el primer pintado (celular)

- Problema: `<html>` llegaba siempre con `dark` y el tema real se aplicaba al
  terminar de cargar el JavaScript. En un celular lento con modo claro se veía
  oscuro ~5 s y luego saltaba a claro, con muchas transiciones de color a la vez.
- Arreglo: script mínimo en el `<head>` (`THEME_INIT_SCRIPT` en `layout.tsx`)
  que pone la clase antes de pintar; `ThemeProvider` solo lee esa clase. La barra
  del navegador (`theme-color`) y `color-scheme` siguen al tema elegido.
- Verificado (CPU 4×, red lenta): el tema queda puesto antes del primer pintado,
  0 transiciones al cargar; las 4 combinaciones guardado/sistema funcionan.

### 2026-11-08 — Arreglos de la auditoría (en revisión local, sin publicar)

- Se aplicaron los arreglos P1 y P2 del informe (detalle y números en
  [docs/auditoria-ui-2026-11-08.md](docs/auditoria-ui-2026-11-08.md)). Avisos del
  detector: 281 → 67 en computadora, 335 → 66 en celular.
- Decisiones nuevas: el acento azul del modo claro es `#0452C4` y sigue al tema;
  colores de estado en variables `--status-*`; mínimo de texto 11 px; el menú
  de hamburguesa se usa hasta 1280 px (la barra completa no cabía en tablets).
- Fondo unificado: todas las páginas usan `BrandOrbs` (orbes azul y morado del
  Inicio) en claro y oscuro; se quitó el degradado celeste de las páginas con
  red neuronal. Contraste: 0 avisos en computadora y 2 en el límite en celular.
- Animaciones revisadas: hover de 300 ms, zoom de imágenes de 500 ms,
  cascadas de 60–80 ms, sin `Reveal` doble en el Inicio. Cambio de tema parejo
  (View Transition + `.theme-switching`).
- Texto azul: usar `text-brand-accent-text` (en modo oscuro es `#2f86ff`); el
  fondo y los botones siguen con `bg-brand-accent`. Contraste: 0 fallas en los
  dos temas.
- Quedan sin tocar a propósito: la identidad visual (P3) y el texto
  "Soluciones Realidad" hasta que se confirme.

### 2026-11-08 — Auditoría de UI/UX con las skills

- Se corrió `impeccable audit` (más mobile-native, review-animations y break-ui)
  sobre la web en vivo. Puntaje: **14/20 (Bueno)**. Informe completo y orden de
  arreglos en [docs/auditoria-ui-2026-11-08.md](docs/auditoria-ui-2026-11-08.md).
- Problemas más importantes: contraste del texto secundario en modo claro, y
  títulos de Contacto y Proyectos que chocan con la imagen a 1280 px.

### 2026-11-08 — Skills de diseño

- Se copiaron a `.claude/` las skills y agentes de diseño UI/UX de
  `arness_inicial` (`impeccable` y relacionadas). El agente `disenador` se
  adaptó para leer `MEMORIA.md` en vez de `PROYECTO.md`.

### 2026-11-08 — Fondo de redes neuronales en celular y revisión general

- El fondo de redes neuronales parpadeaba o desaparecía en el celular porque
  se reconstruía cada vez que la barra del navegador cambiaba de tamaño. Se
  reescribió: red estable, más liviana (sin degradados por cuadro), 30 fps en
  táctil, pausa cuando no se ve y responde al dedo. Con CPU 4× más lenta, el
  peor tirón bajó de 250 ms a 133 ms.
- Se quitó el `backdrop-blur` encima del fondo en celular y se frenaron los
  orbes animados en pantallas chicas.
- Bug de CSS: la regla de "reducir movimiento" estaba antes de la animación de
  los orbes y nunca se aplicaba. Corregido.
- SEO: el sitemap, `robots.txt` y las vistas previas apuntaban a
  `ieeecisuni.vercel.app` (ya da 404). Ahora usan `ieee.cis.uni.edu.pe`, y el
  sitemap se regenera cada hora (antes seguía mostrando `/proyectos/proyectos`).
- Revisión: `tsc`, `eslint` y `next build` sin errores; las 9 páginas
  recorridas en un celular simulado sin errores de consola ni desborde horizontal.

### 2026-11-04 / 08 — Bugs del webmaster, versión móvil y equipo del proyecto

- Se corrigieron los bugs reportados por el webmaster:
  - Botones del Hero ("Explorar Proyectos" → `/proyectos`, "Conócenos" → `/nosotros`).
  - Enlaces externos que fallaban (se agregó `normalizeUrl`).
  - Correo del footer.
  - Tarjetas de Respaldo Institucional, ahora enteras clicables con "Visitar sitio".
  - Eventos pasados que salían como próximos.
  - Títulos de pestaña duplicados.
  - Ruleta (animación al salir de la página, "restaurar" mientras gira).
  - Búsqueda del blog por autor.
- Versión móvil revisada página por página: sin desborde horizontal, textos más
  chicos, organigrama en columna y menú con scroll.
- Navbar: la pestaña actual queda resaltada.
- Proyectos: sección "Equipo del proyecto" (columna `autores`) e imagen completa en el detalle.
- PractiCIS: imagen subida y slug cambiado de `proyectos` a `practicis`.
- Robot 3D del Inicio restaurado en celular, encima del texto.
- Documentación: `docs/supabase-contenido.md` (guía para el equipo), README
  actualizado y creación de esta memoria.

### Antes (resumen del historial de git)

- **May-2026:** versión inicial (Sebastián Huaypar). Glassmorphism y animaciones.
- **Jun-2026:** Ruleta CIS, carrusel de Nosotros desde Supabase, heros con
  "liquid glass", robot 3D de Spline, GlobalCIS, rediseño del blog, correcciones
  de imágenes (Kevin Pinto), organigrama de miembros.
- **Jul-2026:** robot 3D también en el hero de Proyectos y mejoras de UI.
