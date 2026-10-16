'use strict';

/* =====================================================================
   TEXTOS Y PARÁMETROS EDITABLES — cambia aquí lo que necesites
   ===================================================================== */
const CONFIG = {
  // Párrafos separados por una línea en blanco. No toques el orden si quieres conservar el diseño:
  // 1º = encabezado, 2º = lista numerada, "Qué ingenuos." = frase destacada, último = firma.
  letter: `INSTRUCCIONES PARA LOS QUE SE ATREVEN A REGRESAR:

1. NO olvidéis lo que vivisteis la última vez.
2. NO creáis que esta vez será igual.
3. NO subestiméis al Negromante.

Ha pasado un año desde que os enfrentasteis a mis juegos. Un año desde que pusisteis a prueba vuestra suerte, vuestra paciencia y vuestra cordura. Quizá pensasteis que todo había terminado. Quizá creísteis que habíais escapado para siempre.

Qué ingenuos.

Mis juegos nunca terminaron. Tan solo estaban esperando.

Este Halloween, las puertas volverán a abrirse. Nuevas pruebas aguardan en la oscuridad. Nuevos enigmas os separarán de la salida. Y nuevas torturas pondrán a prueba todo aquello que creíais dominar.

Ya conozco vuestros miedos. He visto de lo que sois capaces. Esta vez no habrá lugar para confiarse, porque cada paso puede acercaros a la libertad… o hundiros todavía más en mi juego.

No habéis sido elegidos al azar. Vuestros nombres siguen escritos en mis registros. Sois mis antiguos jugadores. Mis viejas víctimas.

Y ha llegado la hora de reclamaros de nuevo.

Aún podéis demostrar que sois más astutos que mis trampas, más pacientes que el tiempo y más fuertes que vuestros propios miedos. Pero recordad: cada decisión tendrá un precio, cada error una consecuencia y cada prueba os acercará a una verdad que quizá preferiríais no descubrir.

¿Seréis capaces de superar mis nuevos juegos? ¿Conseguiréis llegar hasta el final? ¿O esta vez la oscuridad os reclamará para siempre?

EL NEGROMANTE OS ESPERA.
Los juegos han vuelto. Vosotros también deberíais.`,

  // Frases que se colorean dentro de la carta (deben coincidir exactamente con el texto)
  red: ['Qué ingenuos.', 'Nuevas pruebas', 'Nuevos enigmas', 'nuevas torturas', 'Mis viejas víctimas.', 'cada error una consecuencia', 'EL NEGROMANTE OS ESPERA.'],
  purple: ['Mis juegos nunca terminaron.', 'Vuestros nombres siguen escritos en mis registros.', 'Sois mis antiguos jugadores.', 'Y ha llegado la hora de reclamaros de nuevo.', 'la oscuridad os reclamará para siempre'],

  // Normas. **texto** = resaltado en rojo. "nota" es opcional.
  rules: [
    { t: 'Llegar **10 minutos antes** para recibir las instrucciones.' },
    { t: 'Presentar el **ticket digital** que os entregará la web una vez toméis vuestra decisión final.', nota: 'Recomendable dejarla descargada o a mano para cuando comiencen los juegos tenerla lista para mostrarla, sino no podréis jugar.' },
    { t: 'Se exige **consentimiento verbal** antes de cada prueba.' }
  ],

  labels: { acepto: 'ACEPTO JUGAR', rechazo: 'RECHAZO LA CONVOCATORIA' },
  errorNombre: 'El Negromante no acepta firmas vacías. Escribe tu nombre.',

  // {nombre} se sustituye por el nombre escrito
  final: {
    acepto: { kicker: 'Pacto sellado', titulo: 'Estás dentro', linea: 'Tu nombre, {nombre}, ya ha quedado inscrito en mis registros. Ahora el juego también te pertenece a ti.' },
    rechazo: { kicker: 'Respuesta registrada', titulo: 'Qué decepción', linea: 'Como quieras, {nombre}. Las puertas permanecerán abiertas… y tu nombre, escrito. Yo no olvido. Y vuelvo a esperar.' }
  },

  // Texto editable: cómo debe enviarse la confirmación al organizador (no incluye número ni enlace)
  envio: 'Para que tu respuesta sea oficial, descarga esta tarjeta (o haz una captura de pantalla) y envíasela al Negromante por WhatsApp. Tu respuesta solo cuenta como comunicada cuando la hayas enviado.',

  modalConfirm: '¿Seguro que quieres firmar como «{nombre}» y responder: {decision}? Después podrás volver a empezar recargando la página.',
  tituloTarjeta: 'LOS JUEGOS DEL NEGROMANTE · 2026',
  descarga: 'Imagen guardada. Envíala por WhatsApp para confirmar.',
  archivo: 'confirmacion-negromante.png'
};

/* =====================================================================
   CÓDIGO
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
let state = { nombre: '', decision: '', fecha: '' };

/* Brasas */
if (!reduce) {
  const box = $('embers');
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span'), z = 2 + Math.random() * 3;
    s.style.cssText = `left:${Math.random() * 100}%;width:${z}px;height:${z}px;--dx:${(Math.random() - .5) * 120}px;animation-duration:${9 + Math.random() * 12}s;animation-delay:${-Math.random() * 18}s`;
    box.appendChild(s);
  }
}

/* Carta */
function renderLetter() {
  const hl = (s) => {
    s = esc(s);
    CONFIG.red.forEach((p) => { s = s.split(esc(p)).join(`<em class="r">${esc(p)}</em>`); });
    CONFIG.purple.forEach((p) => { s = s.split(esc(p)).join(`<em class="p">${esc(p)}</em>`); });
    return s;
  };
  const wrap = $('letter');
  CONFIG.letter.split('\n\n').forEach((b, i) => {
    let el;
    if (i === 0) { el = document.createElement('h3'); el.textContent = b; }
    else if (/^1\. /.test(b)) {
      el = document.createElement('ol');
      b.split('\n').forEach((l) => {
        const li = document.createElement('li');
        li.innerHTML = '<em class="r">NO</em>' + esc(l.replace(/^\d\.\s*NO/, ''));
        li.value = parseInt(l, 10);
        el.appendChild(li);
      });
      el.style.listStyle = 'decimal'; el.style.paddingLeft = '2.2rem';
    } else if (b === 'Qué ingenuos.') { el = document.createElement('p'); el.className = 'ing'; el.textContent = b; }
    else if (b.indexOf('\n') > -1) {
      el = document.createElement('p'); el.className = 'sello';
      const [a, c] = b.split('\n');
      el.innerHTML = `<em>${esc(a)}</em>${esc(c)}`;
    } else { el = document.createElement('p'); el.innerHTML = hl(b); }
    el.classList.add('rv');
    wrap.appendChild(el);
  });
  if (reduce || !('IntersectionObserver' in window)) { $('carta').classList.add('all'); $('mostrarTodo').hidden = true; return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .25 });
  wrap.querySelectorAll('.rv').forEach((n) => io.observe(n));
}
$('mostrarTodo').addEventListener('click', () => { $('carta').classList.add('all'); $('mostrarTodo').hidden = true; });

/* Normas */
CONFIG.rules.forEach((r) => {
  const li = document.createElement('li');
  li.innerHTML = esc(r.t).replace(/\*\*(.+?)\*\*/g, '<em class="r">$1</em>') + (r.nota ? `<small>${esc(r.nota)}</small>` : '');
  $('rules').appendChild(li);
});
renderLetter();

/* Entrada → invitación */
$('abrir').addEventListener('click', () => {
  const e = $('entrada');
  e.style.transition = reduce ? 'none' : 'opacity .9s, filter .9s';
  e.style.opacity = 0; e.style.filter = 'blur(10px)';
  setTimeout(() => { e.hidden = true; $('juego').hidden = false; window.scrollTo(0, 0); $('juego').animate && !reduce && $('juego').animate([{ opacity: 0 }, { opacity: 1 }], 900); }, reduce ? 0 : 800);
});

/* Volver: de la convocatoria a la entrada */
$('volverInicio').addEventListener('click', () => {
  $('juego').hidden = true;
  const e = $('entrada');
  e.hidden = false; e.style.opacity = 1; e.style.filter = 'none';
  window.scrollTo(0, 0);
});

/* Volver: de la pantalla final a la decisión (conserva el nombre escrito) */
$('volverDecidir').addEventListener('click', () => {
  document.body.classList.remove('cap'); $('salirCap').hidden = true;
  $('dlStatus').textContent = '';
  $('final').hidden = true; $('juego').hidden = false;
  $('confirmar').scrollIntoView({ block: 'start' });
});

/* Modales */
let lastFocus = null;
function openModal(m, focusEl) { lastFocus = document.activeElement; m.hidden = false; focusEl.focus(); }
function closeModal(m) { m.hidden = true; lastFocus && lastFocus.focus && lastFocus.focus(); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') ['mConfirm', 'mCap'].forEach((id) => !$(id).hidden && closeModal($(id))); });

/* Decisión */
function pedir(decision) {
  const nombre = $('nombre').value.trim().replace(/\s+/g, ' ');
  if (!nombre) {
    $('err').textContent = CONFIG.errorNombre;
    $('nombre').classList.remove('shake'); void $('nombre').offsetWidth; $('nombre').classList.add('shake');
    $('nombre').focus(); return;
  }
  $('err').textContent = '';
  state.nombre = nombre; state.decision = decision;
  $('mcP').textContent = CONFIG.modalConfirm.replace('{nombre}', nombre).replace('{decision}', '«' + decision + '»');
  openModal($('mConfirm'), $('mcNo'));
}
$('acepto').addEventListener('click', () => pedir(CONFIG.labels.acepto));
$('rechazo').addEventListener('click', () => pedir(CONFIG.labels.rechazo));
$('nombre').addEventListener('input', () => { $('err').textContent = ''; });
$('mcNo').addEventListener('click', () => closeModal($('mConfirm')));
$('mcOk').addEventListener('click', () => {
  $('mConfirm').hidden = true;
  state.fecha = new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
  const ok = state.decision === CONFIG.labels.acepto, f = CONFIG.final[ok ? 'acepto' : 'rechazo'];
  $('fKicker').textContent = f.kicker; $('fTitle').textContent = f.titulo;
  $('fLine').textContent = f.linea.replace('{nombre}', state.nombre);
  $('cName').textContent = state.nombre; $('cDec').textContent = state.decision; $('cDate').textContent = state.fecha;
  $('fSend').textContent = CONFIG.envio;
  $('juego').hidden = true; $('final').hidden = false; window.scrollTo(0, 0);
});

/* Captura manual */
$('captura').addEventListener('click', () => openModal($('mCap'), $('mpOk')));
$('mpNo').addEventListener('click', () => closeModal($('mCap')));
$('mpOk').addEventListener('click', () => { $('mCap').hidden = true; document.body.classList.add('cap'); $('salirCap').hidden = false; window.scrollTo(0, 0); });
$('salirCap').addEventListener('click', () => { document.body.classList.remove('cap'); $('salirCap').hidden = true; });

/* Descarga PNG (dibujada con canvas: sin librerías externas) */
function fit(ctx, text, font, size, maxW) {
  do { ctx.font = font.replace('{s}', size); size -= 2; } while (ctx.measureText(text).width > maxW && size > 20);
  return text;
}
async function dibujarTarjeta() {
  await Promise.all([document.fonts.load('80px Creepster'), document.fonts.load('700 60px "Amatic SC"'), document.fonts.load('400 40px "Amatic SC"')]);
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), cx = W / 2;
  x.fillStyle = '#050407'; x.fillRect(0, 0, W, H);
  let g = x.createRadialGradient(cx, 0, 0, cx, 0, 900); g.addColorStop(0, '#2a0f45'); g.addColorStop(1, 'transparent'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  g = x.createRadialGradient(cx, H, 0, cx, H, 800); g.addColorStop(0, '#4a0510'); g.addColorStop(1, 'transparent'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#e0001a'; x.lineWidth = 6; x.strokeRect(40, 40, W - 80, H - 80);
  x.strokeStyle = '#9b30ff'; x.lineWidth = 2; x.strokeRect(62, 62, W - 124, H - 124);
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';

  const skull = new Path2D(document.querySelector('#skull path').getAttribute('d'));
  x.save(); x.translate(cx - 130, 110); x.scale(2.6, 2.6); x.shadowColor = '#9b30ff'; x.shadowBlur = 40; x.fillStyle = '#efe8e0'; x.fill(skull, 'evenodd'); x.restore();

  x.shadowBlur = 0; x.fillStyle = '#efe8e0'; fit(x, 'LOS JUEGOS DEL', '{s}px Creepster', 78, 900); x.fillText('LOS JUEGOS DEL', cx, 470);
  x.shadowColor = '#9b30ff'; x.shadowBlur = 30; x.fillStyle = '#9b30ff'; fit(x, 'NEGROMANTE', '{s}px Creepster', 140, 900); x.fillText('NEGROMANTE', cx, 590);
  x.shadowBlur = 0; x.fillStyle = '#8c8497'; x.font = '700 44px "Amatic SC"'; x.fillText('HALLOWEEN 2026', cx, 650);

  // Ticket
  const tx = 90, ty = 720, tw = 900, th = 330, sw = 190;
  x.fillStyle = '#000'; x.fillRect(tx, ty, tw - sw, th);
  x.fillStyle = '#9b30ff'; x.fillRect(tx + tw - sw + 10, ty, sw - 10, th);
  x.strokeStyle = '#fff'; x.lineWidth = 6; x.setLineDash([26, 16]); x.beginPath(); x.moveTo(tx + tw - sw + 4, ty + 6); x.lineTo(tx + tw - sw + 4, ty + th - 6); x.stroke(); x.setLineDash([]);
  x.fillStyle = '#9b30ff'; for (let i = 0; i < 28; i++) { [ty + 22, ty + th - 22].forEach((yy) => { x.beginPath(); x.arc(tx + 30 + i * 22, yy, 5, 0, 7); x.fill(); }); }
  x.save(); x.translate(tx + 34, ty + 80); x.scale(1.7, 1.7); x.fillStyle = '#fff'; x.fill(skull, 'evenodd'); x.restore();
  const mx = tx + 150 + (tw - sw - 150) / 2, mw = tw - sw - 190;
  x.fillStyle = '#fff'; x.font = '44px Creepster'; x.fillText('JUGADOR', mx, ty + 100);
  x.save(); x.shadowColor = '#4a1190'; x.shadowOffsetX = 4; x.shadowOffsetY = 4; x.fillStyle = '#e0001a';
  fit(x, state.nombre, '{s}px Creepster', 100, mw); x.fillText(state.nombre, mx, ty + 205); x.restore();
  // Código de barras decorativo (depende del nombre)
  let seed = 0; for (const ch of state.nombre) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
  x.fillStyle = '#000'; let by = ty + 50;
  while (by < ty + th - 50) { seed = (seed * 75 + 74) % 65537; const h = 3 + (seed % 5); x.fillRect(tx + tw - sw + 45, by, sw - 80, h); by += h + 3 + (seed % 4); }

  // Decisión y fecha
  const ok = state.decision === CONFIG.labels.acepto;
  x.shadowColor = ok ? '#e0001a' : '#9b30ff'; x.shadowBlur = 24; x.fillStyle = ok ? '#e0001a' : '#b57bff';
  fit(x, state.decision, '700 {s}px "Amatic SC"', 96, 880); x.fillText(state.decision, cx, 1150);
  x.shadowBlur = 0; x.fillStyle = '#cfc6d8'; x.font = '700 46px "Amatic SC"'; x.fillText(state.fecha, cx, 1210);
  x.fillStyle = '#645b70'; x.font = '700 34px "Amatic SC"'; x.fillText('LOS JUEGOS DEL NEGROMANTE · HALLOWEEN 2026', cx, 1272);
  return c;
}
$('descargar').addEventListener('click', async () => {
  const st = $('dlStatus'); st.textContent = 'Preparando imagen…';
  try {
    const c = await dibujarTarjeta();
    c.toBlob((b) => {
      if (!b) { st.textContent = 'No se pudo crear la imagen. Usa «Hacer captura de pantalla».'; return; }
      const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = CONFIG.archivo;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      st.textContent = CONFIG.descarga;
    }, 'image/png');
  } catch (e) { st.textContent = 'No se pudo crear la imagen. Usa «Hacer captura de pantalla».'; }
});

/* Sonido ambiente (opcional, apagado por defecto; drone sintetizado, sin archivos) */
let ac = null, gain = null, on = false;
const vol = () => (+$('sndVol').value / 100) * 0.18;
$('sndBtn').addEventListener('click', () => {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  if (!ac) {
    ac = new AC(); gain = ac.createGain(); gain.gain.value = vol();
    const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 240; f.connect(gain); gain.connect(ac.destination);
    [55, 55.6, 82.4, 110.3].forEach((hz) => { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz; o.connect(f); o.start(); });
    const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .07; lg.gain.value = 90; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
  }
  on = !on; on ? ac.resume() : ac.suspend();
  $('sndBtn').setAttribute('aria-pressed', on); $('sndBtn').textContent = 'Ambiente: ' + (on ? 'encendido' : 'apagado');
});
$('sndVol').addEventListener('input', () => { if (gain) gain.gain.value = vol(); });
