
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  #app {
    min-height: 600px;
    padding: 1.5rem 1rem;
    position: relative;
    overflow: hidden;
    background: #0a1628;
    border-radius: var(--border-radius-lg);
    color: white;
  }
  #app::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(0,119,204,0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(0,180,100,0.10) 0%, transparent 50%),
      linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%);
    z-index: 0;
  }
  #app::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(0,119,204,0.3) 1px, transparent 1px);
    background-size: 32px 32px;
    z-index: 0;
  }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }
  .header { text-align: center; padding: 0.5rem 0; }
  .header h1 { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.45); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; }
  .header h2 { font-size: 19px; font-weight: 500; color: white; line-height: 1.4; }
  .header .accent { color: #FFD700; }
  .header .sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }
  #wheel-wrapper { position: relative; width: 300px; height: 300px; }
  #wheel-canvas { border-radius: 50%; box-shadow: 0 0 40px rgba(0,119,204,0.4), 0 0 0 3px rgba(0,119,204,0.3); }
  #pointer {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 24px solid #FFD700;
    filter: drop-shadow(0 2px 6px rgba(255,215,0,0.6));
    z-index: 10;
  }
  #center-btn {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 52px; height: 52px; border-radius: 50%;
    background: #0077cc; border: 3px solid white;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 20px; z-index: 10;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 0 20px rgba(0,119,204,0.7);
  }
  #center-btn:hover { transform: translate(-50%, -50%) scale(1.08); }
  #center-btn:active { transform: translate(-50%, -50%) scale(0.95); }
  #center-btn.spinning { cursor: not-allowed; opacity: 0.7; }
  #result-box {
    background: rgba(0,119,204,0.15);
    border: 0.5px solid rgba(0,119,204,0.4);
    border-radius: var(--border-radius-lg);
    padding: 0.75rem 1.5rem; text-align: center;
    min-width: 260px; min-height: 70px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 4px; transition: all 0.3s;
  }
  #result-label { font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 2px; }
  #result-area { font-size: 22px; font-weight: 500; color: white; transition: all 0.3s; }
  #result-sub { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; display: none; }
  #result-box.winner { border-color: rgba(255,215,0,0.6); background: rgba(255,215,0,0.1); box-shadow: 0 0 20px rgba(255,215,0,0.2); }
  #result-box.winner #result-area { color: #FFD700; }
  #result-box.winner #result-sub { display: block; }
  .areas-section { width: 100%; max-width: 340px; }
  .areas-title { font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5rem; text-align: center; }
  .areas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .area-chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0.5rem 0.75rem; border-radius: 8px; border: 0.5px solid; font-size: 13px; font-weight: 500; transition: all 0.25s; }
  .area-chip.removed { opacity: 0.3; filter: grayscale(1); text-decoration: line-through; }
  .remove-btn { background: none; border: none; cursor: pointer; font-size: 14px; opacity: 0.4; padding: 0; line-height: 1; transition: opacity 0.2s; }
  .area-chip.active:hover .remove-btn { opacity: 1; }
  .chip-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .chip-label { flex: 1; text-align: left; }
  #restore-btn { font-size: 12px; color: rgba(255,255,255,0.4); background: none; border: 0.5px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 4px 12px; cursor: pointer; transition: all 0.2s; margin-top: 4px; }
  #restore-btn:hover { color: white; border-color: rgba(255,255,255,0.5); }
  #history { width: 100%; max-width: 340px; }
  .history-title { font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.4rem; text-align: center; }
  .history-list { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
  .history-item { font-size: 12px; padding: 3px 10px; border-radius: 20px; border: 0.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }
  .cis-badge { display: flex; align-items: center; gap: 8px; opacity: 0.4; margin-top: 0.25rem; }
  .cis-badge span { font-size: 11px; letter-spacing: 2px; color: rgba(255,255,255,0.8); text-transform: uppercase; }
  .ieee-logo { font-size: 13px; font-weight: 500; color: rgba(0,119,204,0.9); letter-spacing: 1px; }
</style>

<div id="app">
  <div class="content">
    <div class="header">
      <h1>IEEE CIS UNI &nbsp;·&nbsp; CIS Talks</h1>
      <h2>¿Qué área se encarga de <span class="accent">hostear</span> la ponencia?</h2>
      <p class="sub">Gira la ruleta para decidir</p>
    </div>

    <div id="wheel-wrapper">
      <div id="pointer"></div>
      <canvas id="wheel-canvas" width="300" height="300"></canvas>
      <button id="center-btn" onclick="spinWheel()" title="Girar">🎤</button>
    </div>

    <div id="result-box">
      <span id="result-label">Le toca hostear a...</span>
      <span id="result-area">— — —</span>
      <span id="result-sub">¡A preparar la bienvenida! 🎤</span>
    </div>

    <div class="areas-section">
      <div class="areas-title">Áreas en juego</div>
      <div class="areas-grid" id="areas-grid"></div>
      <div style="text-align:center; margin-top:6px;">
        <button id="restore-btn" onclick="restoreAll()">↺ Restaurar todas</button>
      </div>
    </div>

    <div id="history" style="display:none;">
      <div class="history-title">Historial de turnos</div>
      <div class="history-list" id="history-list"></div>
    </div>

    <div class="cis-badge">
      <span class="ieee-logo">IEEE</span>
      <span>CIS UNI · EOE</span>
    </div>
  </div>
</div>

<script>
const AREAS = [
  { id: 'rr',        label: 'RR. PP.',    color: '#0077cc' },
  { id: 'proyectos', label: 'Proyectos',  color: '#00b464' },
  { id: 'marketing', label: 'Marketing',  color: '#cc6600' },
  { id: 'junta',     label: 'Junta Ejec.',color: '#9b2cc0' },
];

let active = AREAS.map(a => a.id);
let spinning = false;
// El ángulo de rotación de la RUEDA (no del puntero).
// El puntero está fijo arriba (top center = -π/2 en coords canvas).
let wheelAngle = 0;
let history = [];

const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');

function getActive() { return AREAS.filter(a => active.includes(a.id)); }

// Dibuja la rueda rotada 'angle' radianes.
// El segmento i empieza en: angle + i*slice
// El puntero está en la parte superior del canvas = ángulo -π/2 (o 3π/2)
// => el segmento que "apunta arriba" es el que contiene el ángulo (-π/2 - angle) normalizado.
function drawWheel(angle) {
  const cx = 150, cy = 150, r = 140;
  const areas = getActive();
  ctx.clearRect(0, 0, 300, 300);

  if (areas.length === 0) {
    ctx.fillStyle = '#1a2840';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Sin áreas', cx, cy);
    return;
  }

  const n = areas.length;
  const slice = (2 * Math.PI) / n;

  for (let i = 0; i < n; i++) {
    const start = angle + i * slice;
    const end   = start + slice;
    const mid   = start + slice / 2;

    // Segmento
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = areas[i].color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Texto del segmento
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(mid);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'bold 13px sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 4;
    ctx.fillText(areas[i].label, r - 14, 0);
    ctx.restore();
  }

  // Anillo exterior
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(0,119,204,0.5)'; ctx.lineWidth = 4; ctx.stroke();

  // Centro
  ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI*2);
  ctx.fillStyle = '#0a1628'; ctx.fill();
  ctx.strokeStyle = 'rgba(0,119,204,0.6)'; ctx.lineWidth = 2; ctx.stroke();
}

// Dado el wheelAngle final, determina qué área queda bajo el puntero (arriba).
// El puntero apunta a ángulo -π/2 en el sistema del canvas.
// El segmento i ocupa [wheelAngle + i*slice, wheelAngle + (i+1)*slice].
// Queremos i tal que (wheelAngle + i*slice) <= (-π/2) mod 2π < (wheelAngle + (i+1)*slice)
function getWinner(angle) {
  const areas = getActive();
  const n = areas.length;
  const slice = (2 * Math.PI) / n;
  const POINTER = -Math.PI / 2; // ángulo del puntero en coords canvas

  // Normalizar el ángulo del puntero relativo a la rueda
  let rel = ((POINTER - angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  // rel está en [0, 2π), el segmento i empieza en i*slice
  const idx = Math.floor(rel / slice) % n;
  return areas[idx];
}

function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

function spinWheel() {
  if (spinning) return;
  const areas = getActive();
  if (areas.length === 0) { document.getElementById('result-area').textContent = '¡Sin áreas!'; return; }

  const n = areas.length;
  const slice = (2 * Math.PI) / n;

  spinning = true;
  const btn = document.getElementById('center-btn');
  btn.classList.add('spinning'); btn.textContent = '⏳';

  const rb = document.getElementById('result-box');
  rb.classList.remove('winner');
  rb.style.borderColor = ''; rb.style.boxShadow = '';
  document.getElementById('result-area').style.color = '';
  document.getElementById('result-area').textContent = '...';
  document.getElementById('result-sub').style.display = 'none';

  // Elegir ganador al azar
  const winnerIdx = Math.floor(Math.random() * n);
  const winner = areas[winnerIdx];

  // El centro del segmento ganador debe quedar en el puntero (-π/2).
  // Centro del segmento i en la rueda (antes de aplicar wheelAngle) = i*slice + slice/2
  // Con wheelAngle: ángulo del centro en canvas = wheelAngle + i*slice + slice/2
  // Queremos que ese ángulo = -π/2 + k*2π
  // => wheelAngle_final = -π/2 - (i*slice + slice/2)
  const segCenter = winnerIdx * slice + slice / 2;
  const POINTER = -Math.PI / 2;
  // Queremos un wheelAngle_final tal que (wheelAngle_final + segCenter) ≡ POINTER (mod 2π)
  // Pero también debemos hacer que la rueda gire hacia adelante (positivo) varias vueltas.

  // Calcular cuánto hay que rotar desde el wheelAngle actual
  const targetBase = POINTER - segCenter; // wheelAngle ideal sin vueltas extra
  // Normalizar: encontrar el targetBase equivalente que sea > wheelAngle + minSpin
  const minSpin = 5 * 2 * Math.PI; // mínimo 5 vueltas
  // delta positivo que lleva desde wheelAngle hasta target
  let delta = ((targetBase - wheelAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  if (delta < 0.1) delta += 2 * Math.PI; // evitar delta cero
  delta += minSpin + Math.random() * 3 * 2 * Math.PI; // sumar vueltas extra

  const totalAngle = wheelAngle + delta;
  const duration = 3800 + Math.random() * 800;
  const t0 = performance.now();
  const startAngle = wheelAngle;

  function animate(now) {
    const t = Math.min((now - t0) / duration, 1);
    wheelAngle = startAngle + delta * easeOut(t);
    drawWheel(wheelAngle);
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      wheelAngle = totalAngle;
      drawWheel(wheelAngle);
      spinning = false;
      btn.classList.remove('spinning'); btn.textContent = '🎤';
      // Verificar con getWinner para 100% de consistencia
      const confirmed = getWinner(wheelAngle);
      showResult(confirmed);
      addHistory(confirmed);
    }
  }
  requestAnimationFrame(animate);
}

function showResult(area) {
  const rb = document.getElementById('result-box');
  const ra = document.getElementById('result-area');
  const rs = document.getElementById('result-sub');
  ra.textContent = area.label;
  ra.style.color = area.color;
  rb.classList.add('winner');
  rb.style.borderColor = area.color + 'aa';
  rb.style.boxShadow = `0 0 24px ${area.color}44`;
  rs.style.display = 'block';
}

function addHistory(area) {
  history.push(area);
  document.getElementById('history').style.display = 'block';
  const chip = document.createElement('div');
  chip.className = 'history-item';
  chip.textContent = `${history.length}. ${area.label}`;
  document.getElementById('history-list').appendChild(chip);
}

function renderChips() {
  const grid = document.getElementById('areas-grid');
  grid.innerHTML = '';
  AREAS.forEach(area => {
    const isActive = active.includes(area.id);
    const chip = document.createElement('div');
    chip.className = 'area-chip ' + (isActive ? 'active' : 'removed');
    chip.style.backgroundColor = isActive ? area.color + '22' : 'transparent';
    chip.style.borderColor = isActive ? area.color + '88' : 'rgba(255,255,255,0.1)';
    chip.style.color = isActive ? area.color : 'rgba(255,255,255,0.3)';
    const dot = document.createElement('div');
    dot.className = 'chip-dot';
    dot.style.background = isActive ? area.color : 'rgba(255,255,255,0.2)';
    const label = document.createElement('span');
    label.className = 'chip-label';
    label.textContent = area.label;
    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.title = isActive ? 'Quitar' : 'Restaurar';
    btn.textContent = isActive ? '✕' : '↩';
    btn.style.color = isActive ? area.color : 'rgba(255,255,255,0.3)';
    btn.onclick = () => toggleArea(area.id);
    chip.appendChild(dot); chip.appendChild(label); chip.appendChild(btn);
    grid.appendChild(chip);
  });
  drawWheel(wheelAngle);
}

function toggleArea(id) {
  if (active.includes(id)) {
    if (active.length <= 1) { alert('Debe quedar al menos un área.'); return; }
    active = active.filter(a => a !== id);
  } else {
    active.push(id);
    active.sort((a,b) => AREAS.findIndex(x=>x.id===a) - AREAS.findIndex(x=>x.id===b));
  }
  renderChips();
}

function restoreAll() {
  active = AREAS.map(a => a.id);
  wheelAngle = 0; history = [];
  renderChips();
  const rb = document.getElementById('result-box');
  rb.classList.remove('winner');
  rb.style.borderColor = ''; rb.style.boxShadow = '';
  document.getElementById('result-area').style.color = '';
  document.getElementById('result-area').textContent = '— — —';
  document.getElementById('result-sub').style.display = 'none';
  document.getElementById('history').style.display = 'none';
  document.getElementById('history-list').innerHTML = '';
}

renderChips();
drawWheel(0);
</script>
