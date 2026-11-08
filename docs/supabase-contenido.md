# Guía para editar el contenido de la web (Supabase)

Todo el contenido de la web (proyectos, eventos, miembros y blog) se edita en
**Supabase → Table Editor**. No hace falta tocar código ni hacer un deploy.

## ¿Cuándo se ven los cambios?

| Dónde | Tiempo |
| --- | --- |
| Listas (Inicio, /proyectos, /eventos, /miembros, /blog) | Al recargar la página |
| Página de detalle de un proyecto o post (`/proyectos/...`, `/blog/...`) | Hasta **5 minutos** (caché de la web) |

Si no ves el cambio, recarga con **Ctrl + F5**.

> La web solo tiene permiso de **lectura** sobre Supabase. Los cambios se hacen
> siempre desde el panel de Supabase con una cuenta del equipo.

---

## Reglas generales

- **Enlaces** (LinkedIn, GitHub, demo, registro): pueden escribirse con o sin
  `https://`. La web los corrige sola.
- **Enlace vacío = no se muestra.** Si un miembro no tiene GitHub o un evento no
  tiene link de registro, deja la celda vacía (`NULL`). El ícono o el botón
  desaparecen y vuelven a aparecer cuando se llena. No uses `#`.
- **Listas** (`tags`, `interests`, `autores`): el Table Editor pide **JSON**, con
  corchetes y comillas dobles: `["IA", "Web"]`. No uses llaves `{}`.

## Imágenes

1. Ve a **Storage**, elige el bucket (`proyectos`, `eventos`, `miembros`; para el blog u otras imágenes, `assets`).
2. Sube la imagen (preferible `.webp` o `.png`, menos de 1 MB).
3. Clic en el archivo → **Get URL** / copiar URL pública.
4. Pega esa URL en la columna `image_url` de la fila.

**Para reemplazar una imagen, súbela con otro nombre** (por ejemplo
`practicis2.webp`) y actualiza la URL. Si sobrescribes el mismo archivo, la
caché puede seguir mostrando la imagen vieja durante un tiempo.

### Carruseles (sin tablas)

Estos carruseles muestran **todas las imágenes de una carpeta**, en orden
alfabético (máximo 10). Basta con subir o borrar archivos:

| Carrusel | Bucket / carpeta |
| --- | --- |
| Hero de /nosotros | bucket `aboutus`, carpeta `about` |
| Hero de /eventos | bucket `hero-eventos` (raíz) |

Para elegir el orden, nómbralas `01-...`, `02-...`, etc.

Las imágenes con fondo transparente (PNG/WebP) se adaptan al modo claro y al
oscuro. Las imágenes verticales se muestran completas en el detalle del proyecto.

---

## Tabla `proyectos`

| Columna | Qué poner |
| --- | --- |
| `titulo` | Nombre del proyecto |
| `slug` | La dirección de la página: `practicis` → `/proyectos/practicis`. Solo minúsculas, números y guiones, sin espacios ni tildes. **Si lo cambias, el enlace viejo deja de funcionar.** |
| `descripcion_corta` | Texto de la tarjeta |
| `descripcion_larga` | Texto del detalle (respeta los saltos de línea) |
| `image_url` | URL pública de la imagen |
| `tags` | `["IA", "Educación"]`. También son los filtros de /proyectos |
| `estado` | `Desarrollo`, `Beta` o `Completado` |
| `github_link`, `demo_link` | Botones "Ver Repositorio" / "Ver Demo Live". Vacíos = no aparecen |
| `highlighted` | `true` para mostrarlo en la página de Inicio |
| `autores` | Equipo del proyecto (ver abajo) |

### Equipo del proyecto (`autores`)

Formato JSON, con el rol opcional entre paréntesis:

```json
["Ismael Rojas (Líder)", "Camila Ceferino (Frontend)", "Persona Externa"]
```

- Si el nombre coincide con alguien de la tabla `miembros`, sale **con su foto y
  su LinkedIn**. No importan tildes ni mayúsculas, pero deben coincidir al menos
  **nombre y apellido** (solo "Luis" no basta).
- Si no coincide (por ejemplo, alguien de fuera del capítulo), sale con su inicial.
- Vacío = la sección "Equipo del proyecto" no aparece.

## Tabla `eventos`

| Columna | Qué poner |
| --- | --- |
| `fecha` | Fecha del evento. **Si ya pasó, el evento se marca como pasado solo** (hora de Lima) |
| `is_past` | Opcional: `true` para forzar que se muestre como pasado |
| `link_registro` | Botón "Registrarme". Vacío = no aparece |
| `categoria` | Texto libre. Cada categoría distinta crea un filtro en /eventos |
| `hora`, `ubicacion`, `ponente`, `descripcion`, `image_url` | Datos del evento |

Si no hay eventos próximos, el Inicio muestra los 3 más recientes como
"Eventos Recientes".

## Tabla `miembros`

| Columna | Qué poner |
| --- | --- |
| `nombre`, `rol`, `image_url` | Datos de la tarjeta |
| `categoria` | `BOARD` para la directiva. Para el organigrama: `PROYECTOS`, `CAPACITACIONES`, `DESARROLLO`, `WEBMASTER`, `MARKETING`, `PUBLICIDAD`, `MEMBRESIA`, `RELACIONES PUBLICAS`, `EVENTOS` |
| `orden` | Número. Menor = aparece primero |
| `rol` en el organigrama | Si contiene "Director" o "Subdirector", se coloca en ese puesto del área |
| `linkedin`, `github` | Íconos de la tarjeta. Vacíos = no aparecen |
| `interests` | `["IA", "Robótica"]`. Se muestran 3 en la tarjeta |

## Tabla `blog`

| Columna | Qué poner |
| --- | --- |
| `slug` | Dirección del post (`/blog/mi-post`), mismas reglas que en proyectos |
| `published` | `true` para que se vea; `false` lo oculta (borrador) |
| `category` | Cada categoría distinta crea un filtro en /blog |
| `level` | `Básico`, `Intermedio` o `Avanzado` |
| `read_time` | Por ejemplo `5 min` |
| `author_id` | `id` del miembro autor (sale su nombre y foto) |
