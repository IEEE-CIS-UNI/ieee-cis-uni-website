"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";

const Spinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: Spinner,
});

/**
 * Escena 3D de Spline que no frena el resto de la página:
 *
 * - Se pausa (`stop()`) cuando sale de la pantalla y se reanuda (`play()`) al
 *   volver. Antes el robot seguía dibujando en 3D aunque se bajara por la
 *   página, y en celular eso trababa el scroll.
 * - En pantallas táctiles se monta cuando la página ya cargó y el navegador
 *   está libre: primero se puede leer y tocar la página y el robot aparece un
 *   instante después (con el mismo indicador de carga). En escritorio carga
 *   como siempre.
 */
export default function LazySpline({ scene }: { scene: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const visibleRef = useRef(true);
  const [ready, setReady] = useState(false);

  // Cuándo montar la escena
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) {
      // Escritorio: igual que antes. Va en un efecto porque matchMedia no existe
      // en el servidor y el HTML inicial debe coincidir al hidratar.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      } else {
        timeoutId = setTimeout(() => setReady(true), 300);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  // Pausar cuando no se ve
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      const app = appRef.current;
      if (!app) return;
      if (entry.isIntersecting) app.play();
      else app.stop();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full">
      {ready ? (
        <Spline
          scene={scene}
          onLoad={(app) => {
            appRef.current = app;
            if (!visibleRef.current) app.stop();
          }}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
}
