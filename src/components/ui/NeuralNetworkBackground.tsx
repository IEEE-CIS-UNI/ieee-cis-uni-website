"use client";

/**
 * NeuralNetworkBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas que simula una red neuronal profunda (MLP de 5 capas) con "señales"
 * que viajan entre capas. Los nodos cercanos al cursor (o al dedo, en celular)
 * se activan y aceleran las señales.
 *
 * Pensado para usarse como fondo fijo a pantalla completa:
 *   <div className="fixed inset-0 ..."><NeuralNetworkBackground /></div>
 *
 * Rendimiento y celular:
 *  - La altura del canvas usa `100lvh` (alto de pantalla con la barra del
 *    navegador oculta), así no cambia de tamaño cada vez que la barra de
 *    direcciones del celular aparece o desaparece al hacer scroll. Antes eso
 *    reconstruía la red en cada scroll y el fondo parpadeaba o desaparecía.
 *  - Si el tamaño cambia de verdad (girar el celular, redimensionar la
 *    ventana), los nodos se reubican en vez de crear una red nueva.
 *  - Sin degradados por cuadro: las conexiones son trazos de color sólido y
 *    los brillos se dibujan con un sprite pre-renderizado.
 *  - En celular (puntero táctil) se dibuja a 30 fps; se pausa si la pestaña
 *    está oculta o el canvas no se ve.
 *  - Con "reducir movimiento" activado se dibuja un solo cuadro estático.
 *  - pointer-events: none → nunca bloquea clicks.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";

/* ── Parámetros de la red ─────────────────────────────────────── */
// Nodos por capa: [input, hidden1, hidden2, hidden3, output]
const LAYER_SIZES   = [4, 7, 9, 7, 3];
const COLOR_ACTIVE  = "6, 107, 243";   // RGB: brand-accent (#066BF3)
const COLOR_LINE    = "43, 118, 236";  // mezcla del azul idle y el activo
const CURSOR_RADIUS = 220;             // px: radio de influencia del cursor
const SIGNAL_SPEED  = 1.8;             // velocidad base de las señales (px por cuadro a 60 fps)
const MAX_SIGNALS   = 120;             // tope de señales simultáneas
const MOBILE_FPS    = 30;
/* ─────────────────────────────────────────────────────────────── */

interface NetworkNode {
  /** Posición relativa (0..1) dentro del canvas; x/y se recalculan al redimensionar */
  fx: number;
  fy: number;
  x: number;
  y: number;
  layer: number;
  radius: number;
  activation: number;   // 0..1
  outgoing: Connection[];
}

interface Connection {
  from: NetworkNode;
  to: NetworkNode;
  weight: number;       // 0..1, fuerza visual de la conexión
}

interface Signal {
  conn: Connection;
  progress: number;     // 0..1 a lo largo de la conexión
  speed: number;
  opacity: number;
}

/** Brillo radial azul pre-renderizado una sola vez (reemplaza createRadialGradient por cuadro). */
function createGlowSprite(size = 64): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const g = sprite.getContext("2d");
  if (g) {
    const r = size / 2;
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, `rgba(${COLOR_ACTIVE}, 1)`);
    grad.addColorStop(0.4, `rgba(${COLOR_ACTIVE}, 0.33)`);
    grad.addColorStop(1, `rgba(${COLOR_ACTIVE}, 0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return sprite;
}

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frameInterval = isTouch ? 1000 / MOBILE_FPS : 0;
    // Las velocidades están pensadas para 60 fps; a 30 fps cada paso avanza el doble.
    const stepScale = isTouch ? 60 / MOBILE_FPS : 1;

    const glow = createGlowSprite();

    /* Cursor / dedo fuera de pantalla por defecto */
    const pointer = { x: -9999, y: -9999 };

    /* ── Construye la red una sola vez (posiciones relativas) ── */
    const nodes: NetworkNode[] = [];
    const connections: Connection[] = [];
    const layerCount = LAYER_SIZES.length;
    const byLayer: NetworkNode[][] = [];

    for (let l = 0; l < layerCount; l++) {
      const count = LAYER_SIZES[l];
      const baseRadius = l === 0 || l === layerCount - 1 ? 7 : 5;
      const layerNodes: NetworkNode[] = [];
      for (let i = 0; i < count; i++) {
        const node: NetworkNode = {
          fx: 0.12 + (0.76 * l) / (layerCount - 1),
          fy: (i + 1) / (count + 1),
          x: 0,
          y: 0,
          layer: l,
          radius: baseRadius + Math.random() * 1.5,
          activation: Math.random() * 0.3,
          outgoing: [],
        };
        layerNodes.push(node);
        nodes.push(node);
      }
      byLayer.push(layerNodes);
    }

    for (let l = 0; l < layerCount - 1; l++) {
      for (const from of byLayer[l]) {
        for (const to of byLayer[l + 1]) {
          const conn = { from, to, weight: 0.2 + Math.random() * 0.8 };
          connections.push(conn);
          from.outgoing.push(conn);
        }
      }
    }

    const signals: Signal[] = [];
    for (let i = 0; i < connections.length; i += 2 + Math.floor(Math.random() * 3)) {
      signals.push({
        conn: connections[i],
        progress: Math.random(),
        speed: SIGNAL_SPEED * (0.6 + Math.random() * 0.8),
        opacity: 0.5 + Math.random() * 0.5,
      });
    }

    /* ── Tamaño: solo reubica nodos, nunca recrea la red ── */
    let W = 0;
    let H = 0;
    const resize = () => {
      const w = Math.round(canvas.clientWidth);
      const h = Math.round(canvas.clientHeight);
      if (w === 0 || h === 0 || (w === W && h === H)) return;
      W = canvas.width = w;
      H = canvas.height = h;
      for (const n of nodes) {
        n.x = n.fx * W;
        n.y = n.fy * H;
      }
    };
    resize();

    /* ── Puntero (mouse en escritorio, dedo en celular) ── */
    // El canvas tiene pointer-events: none, así que se escucha a nivel de ventana.
    const handlePointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const resetPointer = () => { pointer.x = -9999; pointer.y = -9999; };
    const handlePointerEnd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") resetPointer();
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("pointerup", handlePointerEnd, { passive: true });
    window.addEventListener("pointercancel", handlePointerEnd, { passive: true });
    document.documentElement.addEventListener("mouseleave", resetPointer);

    /* ── Dibujo de un cuadro ── */
    let tick = 0;
    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, W, H);

      /* 1. Activación de cada nodo según la distancia al puntero */
      for (const n of nodes) {
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const target = dist < CURSOR_RADIUS
          ? 0.6 + (1 - dist / CURSOR_RADIUS) * 0.4
          : 0.05 + Math.random() * 0.05;
        n.activation += (target - n.activation) * Math.min(1, 0.06 * stepScale);
      }

      /* 2. Conexiones: trazo sólido (sin degradado por cuadro) */
      for (const { from, to, weight } of connections) {
        const act = (from.activation + to.activation) / 2;
        const alpha = weight * 0.12 + weight * act * 0.55;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(${COLOR_LINE}, ${alpha * 0.85})`;
        ctx.lineWidth = 0.6 + act * 1.4;
        ctx.stroke();
      }

      /* 3. Señales */
      if (animate) {
        tick += stepScale;
        if (tick >= 18) {
          tick = 0;
          const input = byLayer[0][Math.floor(Math.random() * byLayer[0].length)];
          if (input.outgoing.length > 0 && signals.length < MAX_SIGNALS) {
            signals.push({
              conn: input.outgoing[Math.floor(Math.random() * input.outgoing.length)],
              progress: 0,
              speed: SIGNAL_SPEED * (0.8 + Math.random() * 0.6),
              opacity: 0.8 + Math.random() * 0.2,
            });
          }
        }
      }

      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        const { from, to } = sig.conn;

        let sx = from.x + (to.x - from.x) * sig.progress;
        let sy = from.y + (to.y - from.y) * sig.progress;
        const distMid = Math.sqrt((pointer.x - sx) ** 2 + (pointer.y - sy) ** 2);
        const speedMult = distMid < CURSOR_RADIUS ? 1 + (1 - distMid / CURSOR_RADIUS) * 2.5 : 1;

        if (animate) {
          const connLen = Math.max(1, Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2));
          sig.progress += (sig.speed * speedMult * stepScale) / connLen;

          if (sig.progress >= 1) {
            /* Llegó al nodo destino → lo activa y se propaga a la siguiente capa */
            to.activation = Math.min(1, to.activation + 0.3);
            if (to.outgoing.length > 0 && Math.random() > 0.35 && signals.length < MAX_SIGNALS) {
              signals.push({
                conn: to.outgoing[Math.floor(Math.random() * to.outgoing.length)],
                progress: 0,
                speed: sig.speed * (0.85 + Math.random() * 0.3),
                opacity: sig.opacity * 0.85,
              });
            }
            signals.splice(i, 1);
            continue;
          }
          sx = from.x + (to.x - from.x) * sig.progress;
          sy = from.y + (to.y - from.y) * sig.progress;
        }

        /* Halo (sprite) + núcleo blanco */
        const glowRadius = 8 + speedMult * 3;
        ctx.globalAlpha = sig.opacity * 0.9;
        ctx.drawImage(glow, sx - glowRadius, sy - glowRadius, glowRadius * 2, glowRadius * 2);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sig.opacity})`;
        ctx.fill();
      }

      /* 4. Nodos */
      for (const n of nodes) {
        const act = n.activation;
        if (act > 0.15) {
          const haloR = n.radius * (3 + act * 4);
          ctx.globalAlpha = act * 0.35;
          ctx.drawImage(glow, n.x - haloR, n.y - haloR, haloR * 2, haloR * 2);
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR_ACTIVE}, ${0.4 + act * 0.6})`;
        ctx.fill();
        // Brillo blanco interior (antes era un degradado radial por nodo)
        ctx.beginPath();
        ctx.arc(n.x - n.radius * 0.25, n.y - n.radius * 0.25, n.radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + act * 0.6})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLOR_ACTIVE}, ${0.4 + act * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    /* ── Loop: limitado a 30 fps en táctil; pausado si no se ve ── */
    let rafId = 0;
    let lastFrame = 0;
    let visible = true;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (frameInterval && now - lastFrame < frameInterval - 2) return;
      lastFrame = now;
      draw(true);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw(false);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(canvas);

    if (reducedMotion) {
      draw(false);
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // max(100%, 100lvh): en celular toma el alto con la barra del navegador
      // oculta, así el canvas no cambia de tamaño al hacer scroll. Si el
      // navegador no soporta `lvh`, se ignora y queda h-full.
      style={{ pointerEvents: "none", height: "max(100%, 100lvh)" }}
      className="neural-canvas absolute inset-x-0 top-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

export default NeuralNetworkBackground;
