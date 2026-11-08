# Auditoría de UI/UX — 2026-11-08

Hecha con las skills de diseño de `.claude/skills/` sobre la web publicada
(https://ieee.cis.uni.edu.pe), en computadora (1280×800) y celular (360–390 px):

- **impeccable audit**: detector automático sobre el código y sobre las 9 páginas
  en vivo (281 avisos en computadora, cifra parecida en celular), revisados a mano.
- **mobile-native**: checklist de detalles de celular.
- **review-animations** (criterios de Emil Kowalski): movimiento y animaciones.
- **break-ui**: se reemplazaron las respuestas de Supabase por datos extremos
  (nombres larguísimos, palabras sin espacios, campos vacíos, 7 tags, fotos
  faltantes) y se midió qué se rompe.

> El detector revisó la web en **modo claro**: casi todos los problemas de
> contraste son de ese modo. El modo oscuro está mejor, salvo el texto del footer.

## Puntaje

| # | Dimensión | Puntaje | Hallazgo principal |
|---|---|---|---|
| 1 | Accesibilidad | 2/4 | Texto secundario con contraste insuficiente en modo claro (≈150 casos) |
| 2 | Rendimiento | 3/4 | 66 `transition-all`; robot 3D pesado en el celular (decisión tomada) |
| 3 | Tema claro/oscuro | 3/4 | Fondos de "sin foto" quedan casi negros en modo claro |
| 4 | Responsive | 3/4 | Sin desborde horizontal; pero títulos que chocan en laptops de 1280 px |
| 5 | Integridad | 3/4 | Sistema coherente; un error de Spline sin capturar en /proyectos |
| | **Total** | **14/20** | **Bueno**: atender accesibilidad y los títulos |

## Hallazgos por prioridad

### P1 — Arreglar pronto

1. **Contraste del texto secundario en modo claro.**
   - `--brand-text-muted` en modo claro es `rgba(10,22,40,0.55)` (3,9:1 sobre
     el fondo). Varios textos además le suman `opacity-60` u `opacity-70`.
   - Casos peores:
     - Footer (todas las páginas): 2,1:1.
     - Insignia "Próximo" de eventos (blanco sobre verde): 2,1:1.
     - Nivel "Básico" del blog (verde sobre celeste): 1,5:1.
     - Estadísticas de /nosotros: 2,2:1.
   - Norma: WCAG 1.4.3 (mínimo 4,5:1).
   - Arreglo: subir el token a ~0,72 de opacidad, quitar los `opacity-*` que se
     suman y oscurecer los verdes de las insignias en modo claro.
   - Comando sugerido: `/impeccable colorize`.
2. **Títulos que chocan con la imagen en computadora (1280 px).**
   - /contacto: la palabra "Conexión" se sale 110 px y queda cortada detrás del mapa.
   - /proyectos: "Transformando" se monta sobre el recuadro del robot.
   - Arreglo: limitar el tamaño con `clamp()` según el ancho de la columna.
   - Comando sugerido: `/impeccable layout`.

### P2 — Siguiente ronda

3. **Texto de 9–10 px.** Roles del organigrama, tags y etiquetas del
   formulario de contacto están por debajo del mínimo de 11 px. En celular hay
   105 casos. → `/impeccable typeset`
4. **Encabezados que saltan de nivel** (h1 → h3/h4) en Nosotros, Miembros,
   Proyectos y Blog. Afecta a lectores de pantalla. → `/impeccable typeset`
5. **Animaciones sin "reducir movimiento".**
   - Framer Motion no respeta esa preferencia del sistema.
     Arreglo: `<MotionConfig reducedMotion="user">` en el layout.
   - Las entradas duran 0,5–0,8 s y se desplazan 75–100 px (`Reveal`, `About`).
     El estándar es menos de 300 ms con un desplazamiento chico.
   - Hay 66 `transition-all`; conviene nombrar las propiedades.
   - Comando sugerido: `/impeccable animate`.
6. **"Sin foto" oscuro en modo claro.** El recuadro de reemplazo de proyectos y
   miembros sin imagen tiene colores oscuros fijos. → `/impeccable harden`
7. **Tags y filtros con una palabra muy larga** se salen del borde de la
   tarjeta o de la pantalla. Falta `break-words` en las etiquetas. → `/impeccable harden`
8. **Error de Spline sin capturar en /proyectos** (escritorio):
   `Cannot read properties of undefined (reading 'position')`. El filtro de
   errores no lo detecta en producción porque los archivos tienen otro nombre.
   Revisar la escena en Spline o ampliar el filtro. → `/impeccable harden`
9. **Detalles de celular (mobile-native).**
   - No hay `theme-color`: la barra del navegador no toma el color de la web.
   - Al tocar un enlace aparece un destello azul (`-webkit-tap-highlight-color`).
   - Falta `touch-action: manipulation` en botones.
   - El cuadro de texto de la Ruleta usa 14 px, así que el iPhone hace zoom al tocarlo.
   - Comando sugerido: `/impeccable adapt`.

### P3 — Si hay tiempo

10. **Identidad visual.** El detector marca patrones muy usados en webs
    genéricas: degradados morado/cian, brillos, la etiqueta encima del título y
    las mismas esquinas decorativas repetidas en los 7 heros. No es un error,
    pero resta personalidad. → `/impeccable critique` para una opinión de diseño completa.
11. **Texto:** "Transformando Ideas en Soluciones **Realidad**" (/proyectos)
    parece un error. ¿Debería decir "Soluciones **Reales**"? Hay que confirmarlo
    con el equipo antes de cambiarlo.

## Lo que está bien

- Ninguna página se desborda hacia los costados en celular, ni siquiera con datos extremos.
- Las tarjetas de miembros recortan bien los nombres y roles largos.
- El formulario de contacto: validación, filtro anti-bots y límite de envíos.
- Variables de color para claro y oscuro usadas en casi todo el sitio.
- Imágenes optimizadas con `next/image`; `alt` y `aria-label` en enlaces e íconos.
- Los campos de texto usan 16 px (no hacen zoom en iPhone), salvo el de la Ruleta.

## Orden recomendado

1. `/impeccable colorize`: contraste del modo claro (P1).
2. `/impeccable layout`: títulos que chocan en 1280 px (P1).
3. `/impeccable typeset`: texto mínimo de 11 px y orden de encabezados (P2).
4. `/impeccable animate`: reducir movimiento, duraciones y `transition-all` (P2).
5. `/impeccable harden`: "sin foto" en modo claro, tags largos y error de Spline (P2).
6. `/impeccable adapt`: detalles de celular (P2).
7. `/impeccable polish`: pasada final.

Después de los arreglos, volver a correr `/impeccable audit` para comparar el puntaje.

---

## Arreglos aplicados (sin publicar, en revisión local)

Mismo detector, mismas 9 páginas, contra el servidor local:

| Aviso | Antes (computadora / celular) | Después |
|---|---|---|
| Contraste bajo | 155 / 178 | 11 / 19 (casi todos en el límite, 4,1–4,5:1) |
| Texto menor a 11 px | 63 / 105 | 0 / 0 |
| Encabezados fuera de orden | 4 / 4 | 0 / 0 |
| Texto que se sale de su caja | 2 | 0 |
| Error de script (robot 3D) | 1 | 0 en el detector (ver nota) |
| **Total** | **281 / 335** | **67 / 66** |

Los avisos que quedan son de estilo (degradados morado/cian, brillos, etiqueta
encima del título, esquinas decorativas): la sección P3 del informe, que es una
decisión de diseño y no se tocó.

**Qué se cambió**

1. **Contraste (P1).**
   - Texto secundario en modo claro de 0,55 a 0,72 de opacidad.
   - Se quitaron los `opacity-*` que se sumaban encima.
   - Acento azul del modo claro de `#066BF3` a `#0452C4`, y ahora cambia con el
     tema (antes era el mismo azul en ambos modos).
   - Colores de estado (verde, ámbar, rojo) como variables con tonos oscuros
     en modo claro.
   - Fondo celeste del modo claro menos intenso y orbes más tenues.
2. **Títulos que chocaban (P1).** Contacto y Proyectos usan `clamp()` según el
   ancho de la columna.
3. **Texto muy chico (P2).** Todo lo de 7–10 px pasó a 11 px (59 usos en 19 archivos).
4. **Encabezados (P2).** Títulos ocultos para lectores de pantalla en Nosotros,
   Miembros, Proyectos y Blog; las cifras de /nosotros dejaron de ser títulos.
5. **Animaciones (P2).**
   - Framer Motion respeta "reducir movimiento" (`MotionProvider`).
   - Entradas más cortas: desplazamientos de 24–32 px (antes 50–100) y 0,5 s
     como máximo (antes hasta 1 s).
   - 66 `transition-all` pasaron a propiedades concretas.
6. **Sin foto y etiquetas largas (P2).**
   - Miembros sin foto usan un reemplazo con los colores del tema (antes una
     imagen casi negra).
   - El recuadro de proyecto sin imagen ya no es negro en modo claro.
   - Tags, categorías y filtros largos se recortan con "…" y no se salen de la caja.
7. **Detalles de celular (P2).**
   - Color de la barra del navegador por tema.
   - Sin destello azul al tocar.
   - `touch-action: manipulation` en botones y enlaces.
   - Cuadro de texto de la Ruleta a 16 px.
   - Alturas con `svh`.
8. **Barra de navegación en tablets (nuevo, P1).** Entre 768 y ~1250 px (iPad
   vertical y horizontal, laptops chicas) la barra se cortaba y "Contacto" y
   "Únete" quedaban fuera de pantalla. Ahora el menú de hamburguesa se usa hasta
   1280 px.

**Verificado**

- `tsc`, `eslint` y `next build` sin errores.
- Sin desborde horizontal en las 9 páginas a 360, 768, 1024 y 1366 px.
- Con datos extremos de Supabase, nada se sale de la pantalla.
- Sin errores de consola en las 9 páginas.

**Nota sobre el robot 3D de Proyectos:** el error `reading 'position'` viene de
la escena de Spline, no del código de la web. Ya existía y los visitantes no lo
notan, pero en modo desarrollo Next lo muestra como un aviso rojo "1 Issue". Se
amplió el filtro de errores, pero la solución de fondo es revisar la escena en
el editor de Spline.

### Fondo unificado (pedido después de revisar en local)

En modo claro, Nosotros, Proyectos, Blog y los detalles tenían un degradado
celeste distinto al del Inicio y el cambio entre páginas se sentía brusco. Ahora
todas usan el mismo fondo de marca: orbe azul a la izquierda y morado a la
derecha (`BrandOrbs`), con la red neuronal encima donde ya estaba.

- Modo claro: orbe azul claro (`#60a5fa`) y el morado original (`#7c3aed`,
  opacidad 0,6–0,8 en computadora y 0,22 en celular). El texto secundario subió
  a 0,76 de opacidad para mantener 4,5:1 también sobre el morado.
- Las etiquetas chicas de los heros usan `--brand-accent-text` (azul más
  profundo en modo claro).
- El botón "Contáctanos ahora" del footer pasó a azules más oscuros; el cian
  del hover dejaba el texto blanco ilegible.

Resultado del detector en las 9 páginas: **0 avisos de contraste** en computadora
y 2 "en el límite" (4,4:1) en celular. Total de avisos: 281 → 56 (computadora)
y 335 → 49 (celular).

### Revisión de animaciones y de modo claro/oscuro

**Animaciones** (criterios de `review-animations` y `emil-design-eng`):

- Respuestas al pasar el mouse bajaron a 300 ms (estaban entre 500 y 1000 ms);
  el zoom de imágenes a 500 ms. Los carruseles y el brillo del botón de
  contacto quedaron igual (son decorativos).
- Cascadas de entrada de 60–80 ms entre elementos (antes 150–300 ms, la última
  tarjeta tardaba hasta 1,5 s).
- Inicio: se quitó `Reveal` alrededor de cada sección, que hacía que todo
  entrara dos veces.
- Botones: hover 2 % y presión 3 % (antes 5 % y 5 %).
- Píldoras del menú: curva sin rebote.
- "Reducir movimiento" también detiene los pulsos y rebotes decorativos.

**Modo claro/oscuro:**

- Cambio de tema parejo: se pausan las transiciones durante el cambio y toda
  la página hace un fundido de 250 ms (View Transitions). Antes cada elemento
  cambiaba de color a su propio ritmo.
- Nuevo token `--brand-accent-text` (utilidad `text-brand-accent-text`): en modo
  oscuro el texto azul usa `#2f86ff`, porque `#056cf2` sobre el fondo casi
  negro daba 4,27:1. Los botones siguen con `--brand-accent`.
- Miembros y la Ruleta usan el mismo `BrandOrbs` que el resto (tenían su propia
  versión de los orbes).
- Contraste medido en las 9 páginas, en los dos temas, a 1280 y 390 px:
  **0 textos bajo el mínimo**.
