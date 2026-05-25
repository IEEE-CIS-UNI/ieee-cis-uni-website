"use client";

/**
 * NeuralNetworkBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas que simula una red neuronal profunda real:
 *
 * Arquitectura:
 *  - 5 capas (input → 3 hidden → output) con nodos de distinto tamaño.
 *  - Las conexiones van de izquierda a derecha entre capas adyacentes,
 *    como en un MLP (Multi-Layer Perceptron) real.
 *  - Además de las conexiones estructurales hay partículas de "señal"
 *    que viajan a lo largo de las conexiones, simulando propagación de datos.
 *
 * Interacción con el cursor:
 *  - Al pasar el cursor cerca de un nodo, ese nodo y todas sus conexiones
 *    se "activan": brillan más y las señales se aceleran.
 *  - El halo de activación se propaga visualmente hacia las capas siguientes.
 *
 * Performance:
 *  - pointer-events: none → nunca bloquea clicks.
 *  - Cleanup correcto de requestAnimationFrame y ResizeObserver.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";

/* ── Parámetros de la red ─────────────────────────────────────── */
// Nodos por capa: [input, hidden1, hidden2, hidden3, output]
const LAYER_SIZES   = [4, 7, 9, 7, 3];
const COLOR_ACTIVE  = "6, 107, 243";   // RGB: brand-accent (#066BF3)
const COLOR_IDLE    = "80, 130, 230";  // azul más suave para idle
const CURSOR_RADIUS = 220;             // px: radio de influencia del cursor
const SIGNAL_SPEED  = 1.8;            // velocidad base de las señales (px/frame)
/* ─────────────────────────────────────────────────────────────── */

interface NetworkNode {
  x: number;
  y: number;
  layer: number;
  index: number;
  radius: number;
  activation: number;   // 0..1, qué tan activado está (para animación)
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

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Cursor fantasma */
    const mouse = { x: -9999, y: -9999 };

    /* ── Construye la red según el tamaño del canvas ── */
    const buildNetwork = (W: number, H: number) => {
      const nodes: NetworkNode[] = [];
      const connections: Connection[] = [];

      const layerCount = LAYER_SIZES.length;
      /* Margen horizontal para que los nodos no queden en el borde */
      const xMargin = W * 0.12;
      const xStep   = (W - xMargin * 2) / (layerCount - 1);

      /* Crear nodos */
      for (let l = 0; l < layerCount; l++) {
        const count = LAYER_SIZES[l];
        const x = xMargin + l * xStep;
        const yStep = H / (count + 1);

        /* Nodos más grandes en capas extremas (input/output) */
        const baseRadius = l === 0 || l === layerCount - 1 ? 7 : 5;

        for (let i = 0; i < count; i++) {
          nodes.push({
            x,
            y: yStep * (i + 1),
            layer: l,
            index: i,
            radius: baseRadius + Math.random() * 1.5,
            activation: Math.random() * 0.3,  // activación inicial baja
          });
        }
      }

      /* Crear conexiones: cada nodo conecta con TODOS los nodos de la siguiente capa */
      const byLayer = LAYER_SIZES.map((_, l) => nodes.filter(n => n.layer === l));

      for (let l = 0; l < layerCount - 1; l++) {
        for (const fromNode of byLayer[l]) {
          for (const toNode of byLayer[l + 1]) {
            connections.push({
              from: fromNode,
              to: toNode,
              /* Peso visual aleatorio: simula que no todas las conexiones son igual de fuertes */
              weight: 0.2 + Math.random() * 0.8,
            });
          }
        }
      }

      return { nodes, connections };
    };

    /* ── Estado de señales que viajan por la red ── */
    const signals: Signal[] = [];

    /* ── Inicializa señales dispersas en todas las conexiones ── */
    const spawnInitialSignals = (connections: Connection[]) => {
      signals.length = 0;
      /* Una señal por cada ~3 conexiones, con progreso inicial aleatorio */
      for (let i = 0; i < connections.length; i += 2 + Math.floor(Math.random() * 3)) {
        signals.push({
          conn: connections[i],
          progress: Math.random(),
          speed: SIGNAL_SPEED * (0.6 + Math.random() * 0.8),
          opacity: 0.5 + Math.random() * 0.5,
        });
      }
    };

    /* ── Resize ── */
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    let { nodes, connections } = buildNetwork(canvas.width, canvas.height);
    spawnInitialSignals(connections);

    /* ── Eventos del cursor ── */
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    /* ── Inyecta señales nuevas periódicamente desde los nodos de input ── */
    let signalTimer = 0;

    /* ── Loop principal ── */
    let rafId: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* — 1. Actualizar activación de cada nodo según la distancia al cursor — */
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const target = dist < CURSOR_RADIUS
          ? 0.6 + (1 - dist / CURSOR_RADIUS) * 0.4   // 0.6..1.0 al estar cerca
          : 0.05 + Math.random() * 0.05;               // idle: activación mínima
        /* Interpolación suave hacia el target */
        n.activation += (target - n.activation) * 0.06;
      }

      /* — 2. Dibujar conexiones — */
      for (const conn of connections) {
        const { from, to, weight } = conn;

        /* Activación media de los dos nodos extremos */
        const act = (from.activation + to.activation) / 2;

        /* Opacidad base proporcional al peso y la activación */
        const baseAlpha = weight * 0.12;
        const activeAlpha = weight * act * 0.55;
        const alpha = baseAlpha + activeAlpha;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        /* Gradiente de color a lo largo de la conexión */
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `rgba(${COLOR_IDLE}, ${alpha * 0.7})`);
        grad.addColorStop(1, `rgba(${COLOR_ACTIVE}, ${alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.6 + act * 1.4;
        ctx.stroke();
      }

      /* — 3. Actualizar y dibujar señales (partículas que viajan) — */
      signalTimer++;

      /* Generar señales nuevas desde input cada N frames */
      if (signalTimer % 18 === 0) {
        const inputNodes = nodes.filter(n => n.layer === 0);
        const randomInput = inputNodes[Math.floor(Math.random() * inputNodes.length)];
        const outgoing = connections.filter(c => c.from === randomInput);
        if (outgoing.length > 0) {
          const conn = outgoing[Math.floor(Math.random() * outgoing.length)];
          signals.push({
            conn,
            progress: 0,
            speed: SIGNAL_SPEED * (0.8 + Math.random() * 0.6),
            opacity: 0.8 + Math.random() * 0.2,
          });
        }
      }

      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        const { from, to } = sig.conn;

        /* Velocidad aumenta si la señal está cerca del cursor */
        const midX = from.x + (to.x - from.x) * sig.progress;
        const midY = from.y + (to.y - from.y) * sig.progress;
        const distMid = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
        const speedMult = distMid < CURSOR_RADIUS
          ? 1 + (1 - distMid / CURSOR_RADIUS) * 2.5
          : 1;

        /* Avanzar la señal a lo largo de la conexión */
        const connLen = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
        sig.progress += (sig.speed * speedMult) / connLen;

        if (sig.progress >= 1) {
          /* La señal llegó al nodo destino → actívalo y propágala */
          sig.conn.to.activation = Math.min(1, sig.conn.to.activation + 0.3);

          /* Propagar: generar señal en la siguiente capa */
          const nextConns = connections.filter(c => c.from === sig.conn.to);
          if (nextConns.length > 0 && Math.random() > 0.35) {
            const nextConn = nextConns[Math.floor(Math.random() * nextConns.length)];
            signals.push({
              conn: nextConn,
              progress: 0,
              speed: sig.speed * (0.85 + Math.random() * 0.3),
              opacity: sig.opacity * 0.85,
            });
          }
          /* Eliminar señal que terminó */
          signals.splice(i, 1);
          continue;
        }

        /* Dibujar la señal como un punto brillante */
        const sx = from.x + (to.x - from.x) * sig.progress;
        const sy = from.y + (to.y - from.y) * sig.progress;

        /* Halo de la señal */
        const glowRadius = 8 + speedMult * 3;
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowRadius);
        glow.addColorStop(0, `rgba(${COLOR_ACTIVE}, ${sig.opacity * 0.9})`);
        glow.addColorStop(0.4, `rgba(${COLOR_ACTIVE}, ${sig.opacity * 0.3})`);
        glow.addColorStop(1, `rgba(${COLOR_ACTIVE}, 0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        /* Núcleo de la señal */
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sig.opacity})`;
        ctx.fill();
      }

      /* — 4. Dibujar nodos — */
      for (const n of nodes) {
        const act = n.activation;

        /* Halo exterior de activación */
        if (act > 0.15) {
          const halo = ctx.createRadialGradient(
            n.x, n.y, n.radius,
            n.x, n.y, n.radius * (3 + act * 4)
          );
          halo.addColorStop(0, `rgba(${COLOR_ACTIVE}, ${act * 0.35})`);
          halo.addColorStop(1, `rgba(${COLOR_ACTIVE}, 0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * (3 + act * 4), 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }

        /* Relleno del nodo: gradiente radial */
        const nodeGrad = ctx.createRadialGradient(
          n.x - n.radius * 0.3, n.y - n.radius * 0.3, 0,
          n.x, n.y, n.radius
        );
        nodeGrad.addColorStop(0, `rgba(255, 255, 255, ${0.3 + act * 0.7})`);
        nodeGrad.addColorStop(1, `rgba(${COLOR_ACTIVE}, ${0.4 + act * 0.6})`);

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeGrad;
        ctx.fill();

        /* Borde del nodo */
        ctx.strokeStyle = `rgba(${COLOR_ACTIVE}, ${0.4 + act * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    /* ── ResizeObserver: reconstruye la red al redimensionar ── */
    const ro = new ResizeObserver(() => {
      resize();
      const net = buildNetwork(canvas.width, canvas.height);
      nodes = net.nodes;
      connections = net.connections;
      spawnInitialSignals(connections);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ pointerEvents: "none" }}
      className="absolute inset-0 w-full h-full opacity-80"
      aria-hidden="true"
    />
  );
};

export default NeuralNetworkBackground;
