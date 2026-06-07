"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft, HiTrash, HiPlus } from "react-icons/hi";

// Paleta de colores para nuevos elementos
const COLORS = [
  '#0077cc', '#00b464', '#cc6600', '#9b2cc0', '#e63946', 
  '#f4a261', '#2a9d8f', '#e9c46a', '#e76f51', '#264653'
];

export default function RuletaPage() {
  // Estado del título editable
  const [title, setTitle] = useState("");
  
  // Estado del textarea crudo
  const [rawText, setRawText] = useState("");
  
  // Estado dinámico de los elementos (áreas/nombres)
  const [areas, setAreas] = useState<Array<{ id: string; label: string; color: string }>>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (!rawText.trim()) {
      setAreas([]);
      setActiveIds([]);
      return;
    }
    const parsed = rawText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
    const newAreas = parsed.map((label, index) => ({
      id: index.toString(),
      label,
      color: COLORS[index % COLORS.length]
    }));
    setAreas(newAreas);
    setActiveIds(newAreas.map(a => a.id));
  }, [rawText]);

  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<typeof areas>([]);
  const [result, setResult] = useState<{ label: string; color: string } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelAngleRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const activeAreas = useMemo(() => {
    return areas.filter(a => activeIds.includes(a.id));
  }, [areas, activeIds]);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = 150, cy = 150, r = 140;
    ctx.clearRect(0, 0, 300, 300);

    if (activeAreas.length === 0) {
      ctx.fillStyle = '#1a2840';
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Vacío', cx, cy);
      return;
    }

    const n = activeAreas.length;
    const slice = (2 * Math.PI) / n;

    for (let i = 0; i < n; i++) {
      const start = angle + i * slice;
      const end = start + slice;
      const mid = start + slice / 2;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = activeAreas[i].color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(mid);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      
      // Ajustar tamaño de fuente si hay muchos elementos
      const fontSize = n > 15 ? 9 : n > 10 ? 11 : 13;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(activeAreas[i].label, r - 14, 0);
      ctx.restore();
    }

    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,119,204,0.5)'; ctx.lineWidth = 4; ctx.stroke();

    ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1628'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,119,204,0.6)'; ctx.lineWidth = 2; ctx.stroke();
  };

  useEffect(() => {
    drawWheel(wheelAngleRef.current);
  }, [activeAreas]);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

  const getWinner = (angle: number) => {
    const n = activeAreas.length;
    if (n === 0) return null;
    const slice = (2 * Math.PI) / n;
    const POINTER = -Math.PI / 2;
    let rel = ((POINTER - angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const idx = Math.floor(rel / slice) % n;
    return activeAreas[idx];
  };

  const spinWheel = () => {
    if (spinning || activeAreas.length === 0) return;

    setSpinning(true);
    setResult(null);

    const n = activeAreas.length;
    const slice = (2 * Math.PI) / n;
    const winnerIdx = Math.floor(Math.random() * n);
    
    const segCenter = winnerIdx * slice + slice / 2;
    const POINTER = -Math.PI / 2;
    const targetBase = POINTER - segCenter;
    const minSpin = 5 * 2 * Math.PI;
    let delta = ((targetBase - wheelAngleRef.current) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    if (delta < 0.1) delta += 2 * Math.PI;
    delta += minSpin + Math.random() * 3 * 2 * Math.PI;

    const totalAngle = wheelAngleRef.current + delta;
    const duration = 3800 + Math.random() * 800;
    const t0 = performance.now();
    const startAngle = wheelAngleRef.current;

    const animate = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      wheelAngleRef.current = startAngle + delta * easeOut(t);
      drawWheel(wheelAngleRef.current);
      
      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        wheelAngleRef.current = totalAngle;
        drawWheel(wheelAngleRef.current);
        setSpinning(false);
        const confirmed = getWinner(wheelAngleRef.current);
        if (confirmed) {
          setResult({ label: confirmed.label, color: confirmed.color });
          setHistory(prev => [...prev, confirmed]);
        }
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const restoreAll = () => {
    wheelAngleRef.current = 0;
    setHistory([]);
    setResult(null);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden text-[var(--brand-text)]">
      {/* Fondo orbes (azul y fucsia) */}
      <div className="hero-orb-a absolute top-1/3 -left-40 w-[600px] h-[600px] bg-brand-accent rounded-full blur-[160px] opacity-100 -z-10" />
      <div className="hero-orb-b absolute bottom-1/4 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-100 -z-10" style={{ backgroundColor: "#7C3AED" }} />

      <div className="w-full max-w-6xl mx-auto mb-8 relative z-10">
        <Link href="/proyectos" className="inline-flex items-center text-sm font-bold text-[var(--brand-text-muted)] hover:text-brand-accent transition-colors">
          <HiArrowLeft className="mr-2" /> Volver a Proyectos
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Imagen del pingüino a la izquierda con temática de hielo */}
        <div className="flex-shrink-0 relative w-64 h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] flex items-center justify-center mt-10 lg:mt-0">
          
          {/* Cristales de hielo flotantes (Fragmentos de glaciar) */}
          {/* Shard 1 - Superior izquierdo */}
          <div 
            className="absolute top-[15%] -left-[8%] w-10 h-12 bg-gradient-to-b from-white/90 to-cyan-400/30 backdrop-blur-md border-t-2 border-l border-white/80 shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-bounce z-20"
            style={{ clipPath: 'polygon(50% 0%, 100% 30%, 80% 100%, 20% 90%, 0% 40%)', animationDuration: '3.5s' }} 
          />
          {/* Shard 2 - Medio derecho */}
          <div 
            className="absolute top-[40%] -right-[12%] w-14 h-16 bg-gradient-to-br from-cyan-100/80 to-blue-500/30 backdrop-blur-md border-t-2 border-r border-white/70 shadow-[0_0_20px_rgba(0,255,255,0.5)] animate-pulse z-0"
            style={{ clipPath: 'polygon(30% 0%, 100% 20%, 90% 80%, 40% 100%, 0% 60%)', animationDuration: '4s', animationDelay: '1s' }} 
          />
          {/* Shard 3 - Inferior izquierdo */}
          <div 
            className="absolute bottom-[25%] -left-[15%] w-8 h-10 bg-gradient-to-tr from-white/80 to-cyan-300/40 backdrop-blur-sm border-t border-white/90 shadow-[0_0_10px_rgba(0,255,255,0.3)] animate-bounce z-20"
            style={{ clipPath: 'polygon(40% 10%, 90% 0%, 100% 60%, 50% 100%, 0% 70%)', animationDuration: '2.8s', animationDelay: '0.5s' }} 
          />
          {/* Shard 4 - Superior derecho (pequeño) */}
          <div 
            className="absolute top-[10%] right-[5%] w-6 h-8 bg-gradient-to-b from-cyan-50/90 to-cyan-400/20 backdrop-blur-md border-t border-white/80 shadow-[0_0_10px_rgba(0,255,255,0.4)] animate-bounce z-0"
            style={{ clipPath: 'polygon(50% 0%, 100% 40%, 70% 100%, 20% 90%, 0% 30%)', animationDuration: '2s', animationDelay: '1.5s' }} 
          />
          {/* Shard 5 - Medio izquierdo (detrás) */}
          <div 
            className="absolute top-[50%] left-[10%] w-12 h-10 bg-gradient-to-r from-blue-300/40 to-cyan-200/20 backdrop-blur-sm shadow-[0_0_15px_rgba(0,180,255,0.3)] animate-pulse z-0"
            style={{ clipPath: 'polygon(20% 0%, 80% 10%, 100% 60%, 60% 100%, 0% 80%)', animationDuration: '5s', animationDelay: '2s' }} 
          />

          {/* Plataforma de Hielo - Glaciar Realista */}
          <div className="absolute bottom-[-12%] w-[120%] h-[120px] z-0 filter drop-shadow-[0_15px_30px_rgba(0,180,255,0.5)]">
            {/* Base profunda del hielo (agua/oscura) */}
            <div 
              className="absolute bottom-0 left-[5%] w-[90%] h-[80px] bg-gradient-to-b from-cyan-400/50 to-blue-800/60 backdrop-blur-sm"
              style={{ clipPath: 'polygon(15% 0%, 85% 0%, 95% 40%, 75% 100%, 30% 95%, 5% 50%)' }}
            />
            {/* Capa media (reflejos internos) */}
            <div 
              className="absolute bottom-[15px] left-[2%] w-[96%] h-[70px] bg-gradient-to-r from-cyan-100/60 via-white/30 to-cyan-300/60 backdrop-blur-md"
              style={{ clipPath: 'polygon(8% 15%, 92% 5%, 100% 50%, 85% 95%, 15% 85%, 0% 45%)' }}
            />
            {/* Superficie superior clara (donde se para) */}
            <div 
              className="absolute bottom-[35px] left-0 w-full h-[60px] bg-gradient-to-b from-white/90 to-cyan-200/50 backdrop-blur-xl"
              style={{ clipPath: 'polygon(10% 20%, 88% 10%, 100% 60%, 85% 100%, 15% 90%, 0% 50%)' }}
            />
            {/* Detalles de rotura/brillos en el hielo */}
            <div 
              className="absolute bottom-[35px] left-[10%] w-[80%] h-[60px] border-t-[3px] border-l-[2px] border-white/80 mix-blend-overlay"
              style={{ clipPath: 'polygon(10% 20%, 88% 10%, 100% 60%, 85% 100%, 15% 90%, 0% 50%)' }}
            />
          </div>
          
          {/* Pingüino (estático) */}
          <div className="relative z-10 w-full h-full drop-shadow-[0_0_40px_rgba(0,119,204,0.4)]">
            <Image
              src="/images/pinguinocis.png"
              alt="Pingüino CIS en hielo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Contenido de la Ruleta */}
        <div className="flex-1 flex flex-col items-center bg-[var(--brand-surface)]/40 backdrop-blur-xl border border-[var(--brand-border)] rounded-3xl p-8 shadow-2xl w-full max-w-[500px]">
          
          {/* Título Dinámico Editable */}
          <div className="text-center mb-8 w-full">
            <h1 className="text-xs font-bold text-[var(--brand-text-muted)] tracking-widest uppercase mb-3">IEEE CIS UNI</h1>
            <textarea 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl md:text-3xl font-bold text-[#FFD700] text-center bg-transparent border border-transparent hover:border-white/10 focus:border-brand-accent/50 rounded-lg outline-none resize-none overflow-hidden transition-all placeholder-white/30"
              rows={2}
              placeholder="Escribe el título aquí..."
            />
          </div>

          <div className="relative w-[300px] h-[300px] mb-8">
            <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-[#FFD700] drop-shadow-[0_2px_6px_rgba(255,215,0,0.6)] z-20" />
            <canvas ref={canvasRef} width={300} height={300} className="rounded-full shadow-[0_0_40px_rgba(0,119,204,0.4),0_0_0_3px_rgba(0,119,204,0.3)] bg-[#0a1628]" />
            <button
              onClick={spinWheel}
              disabled={spinning}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full bg-[#0077cc] border-4 border-white flex items-center justify-center text-xl z-20 shadow-[0_0_20px_rgba(0,119,204,0.7)] transition-all hover:scale-110 active:scale-95 text-white ${spinning ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {spinning ? '⏳' : '🎤'}
            </button>
          </div>

          {/* Resultado */}
          <div
            className={`w-full max-w-[340px] rounded-2xl p-4 text-center border transition-all duration-300 mb-8 flex flex-col items-center justify-center gap-1 min-h-[80px]
              ${result ? 'border-[#FFD700]/60 bg-[#FFD700]/10 shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'border-[#0077cc]/40 bg-[#0077cc]/15'}`}
          >
            <span className="text-[11px] text-[var(--brand-text-muted)] uppercase tracking-widest">el turno es de...</span>
            <span
              className="text-2xl font-bold transition-all"
              style={{ color: result ? result.color : 'white' }}
            >
              {result ? result.label : '— — —'}
            </span>
            {result && (
              <div className="flex flex-col items-center mt-1">
                <span className="text-xs text-[var(--brand-text-muted)] mb-3">¡Manos a la obra!</span>
                <button
                  onClick={() => {
                    const parsed = rawText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0 && s !== result.label);
                    setRawText(parsed.join("\n"));
                    setResult(null);
                  }}
                  className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                >
                  Eliminar de la ruleta
                </button>
              </div>
            )}
          </div>

          {/* Opciones y Áreas Dinámicas */}
          <div className="w-full mb-6">
            <div className="text-xs text-[var(--brand-text-muted)] uppercase tracking-widest text-center mb-3">Elementos ({areas.length})</div>
            
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Ejemplo: Azul, Amarillo, Negro&#10;o sepáralos por Enter"
              className="w-full bg-[var(--brand-background)]/80 border border-[var(--brand-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent text-[var(--brand-text)] resize-y min-h-[120px] custom-scrollbar placeholder-white/20"
            />

            <div className="text-center mt-4">
              <button
                onClick={restoreAll}
                className="text-xs text-[var(--brand-text-muted)] border border-[var(--brand-border)] rounded-lg px-4 py-1.5 hover:text-brand-accent hover:border-brand-accent/50 transition-all"
              >
                ↺ Limpiar Historial
              </button>
            </div>
          </div>

          {/* Historial */}
          {history.length > 0 && (
            <div className="w-full">
              <div className="text-xs text-[var(--brand-text-muted)] uppercase tracking-widest text-center mb-2">Historial de turnos</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {history.map((h, i) => (
                  <div key={i} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--brand-border)] text-[var(--brand-text-muted)] bg-[var(--brand-background)]/50">
                    {i + 1}. {h.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
