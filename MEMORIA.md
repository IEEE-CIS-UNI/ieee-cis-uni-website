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
- [ ] Avisar a Google Search Console del nuevo sitemap
      (`https://ieee.cis.uni.edu.pe/sitemap.xml`), si el capítulo tiene acceso.
- [ ] Datos en Supabase: despublicar "Publicación de prueba" del blog; completar
      enlaces faltantes de LinkedIn/GitHub en `miembros`.

---

## 6. Historial de sesiones

> Al cerrar cada conversación, agregar una entrada arriba de la anterior
> (fecha, qué se hizo, decisiones, pendientes nuevos).

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
