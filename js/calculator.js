'use strict';

const TAZAS_POR_LB        = 2.35;
const OZ_FLUIDA_POR_TAZA  = 8;
const ML_PER_OZ_FLUIDA    = 33.8140227018;
const L_PER_GALON         = 3.785411784;
const PERSONAS_PER_LITER  = 2.212389;
const MAX_ICONS           = 30;

function fmt(val, dec = 2) {
  if (val === null || isNaN(val)) return '—';
  return parseFloat(val.toFixed(dec)).toLocaleString('es', {
    minimumFractionDigits: 0, maximumFractionDigits: dec
  });
}

function setRow(id, name, sub, value, unit, warn = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'ing-row' + (warn ? ' warning' : '');
  el.innerHTML = `
    <span class="ing-name">${name}${sub ? `<small>${sub}</small>` : ''}</span>
    <span class="ing-badge">
      <span class="ing-val">${fmt(value)}</span>
      <span class="ing-unit">${unit}</span>
    </span>`;
}

function setStat(id, val, dec = 1) {
  const el = document.getElementById(id);
  if (el) el.textContent = fmt(val, dec);
}

function updatePersonaIcons(n) {
  const wrap = document.getElementById('personas-icons');
  if (!wrap) return;
  wrap.innerHTML = '';
  const show = Math.min(n, MAX_ICONS);
  for (let i = 0; i < show; i++) {
    const span = document.createElement('span');
    span.className = 'persona-icon';
    span.textContent = '👤';
    span.style.animationDelay = (i * 18) + 'ms';
    wrap.appendChild(span);
  }
  if (n > MAX_ICONS) {
    const more = document.createElement('span');
    more.className = 'persona-icon';
    more.textContent = `+${n - MAX_ICONS}`;
    more.style.fontSize = '12px';
    more.style.fontWeight = '700';
    more.style.color = 'rgba(255,255,255,.7)';
    more.style.alignSelf = 'center';
    wrap.appendChild(more);
  }
}

function calculate() {
  const personas    = Math.max(1, parseFloat(document.getElementById('personas').value) || 1);
  const caldo       = Math.max(0, parseFloat(document.getElementById('caldo').value)    || 0);
  const diam_arriba = parseFloat(document.getElementById('diam_arriba').value) || 83;
  const diam_abajo  = parseFloat(document.getElementById('diam_abajo').value)  || 72;
  const alto        = parseFloat(document.getElementById('alto').value)        || 11.5;

  // ── Ingredients ──
  const arroz_lbs      = 20/100   * personas;
  const arroz_tazas    = arroz_lbs * TAZAS_POR_LB;
  const chorizo        = 6/100    * personas;
  const camaron        = 25/100   * personas;
  const camaron_adorno = 6/100    * personas;
  const calamar        = 25/100   * personas;
  const almeja         = 10/100   * personas;
  const cebolla        = 6.25/100 * personas;
  const pollo          = 20/100   * personas;
  const ajo            = personas / 1.6;
  const azafran        = personas / 4;
  const tomates        = 5/100    * personas;
  const zanahoria      = 6/100    * personas;
  const alberja        = 5/100    * personas;
  const chile          = 1.65/100 * personas;
  const aceite         = (L_PER_GALON / 2 / 100) * personas;

  // ── Liquids ──
  const liquido_total    = arroz_tazas * OZ_FLUIDA_POR_TAZA / ML_PER_OZ_FLUIDA * 2;
  const agua_adicional   = liquido_total - caldo;
  const sal_cucharaditas = liquido_total * ML_PER_OZ_FLUIDA / 8;
  const sal_oz_peso      = sal_cucharaditas * 1.5 / 1000 * 2.20462262185 * 16;

  // ── Paellera ──
  const r            = (diam_arriba + diam_abajo) / 2 / 2;
  const vol_litros   = r * r * Math.PI * alto / 1000;
  const vol_galones  = vol_litros / L_PER_GALON;
  const vol_tazas    = vol_litros * ML_PER_OZ_FLUIDA / 8;
  const personas_cap = vol_litros * PERSONAS_PER_LITER;
  const pct          = Math.min(personas / personas_cap * 100, 100);
  const over         = personas > personas_cap;

  // ── Render ingredients ──
  setRow('arroz-lbs',       'Arroz crudo',    null,                   arroz_lbs,      'Lbs.');
  setRow('arroz-tazas',     'Arroz crudo',    null,                   arroz_tazas,    'Tazas');
  setRow('camaron',         'Camarón',        'Grande y mediano',     camaron,        'Lbs.');
  setRow('camaron-adorno',  'Camarón',        'Grande (adorno)',       camaron_adorno, 'Lbs.');
  setRow('calamar',         'Calamar',        null,                   calamar,        'Lbs.');
  setRow('almeja',          'Almeja',         'Con concha',           almeja,         'Lbs.');
  setRow('pollo',           'Pollo',          'Pechugas en 6 piezas', pollo,          'Lbs.');
  setRow('chorizo',         'Chorizo',        null,                   chorizo,        'Lbs.');
  setRow('cebolla',         'Cebolla',        null,                   cebolla,        'Lbs.');
  setRow('tomates',         'Tomates',        null,                   tomates,        'Lbs.');
  setRow('zanahoria',       'Zanahoria',      null,                   zanahoria,      'Lbs.');
  setRow('alberja',         'Alberja',        null,                   alberja,        'Lbs.');
  setRow('chile',           'Chile pimiento', 'Adorno (lata 1.65 kg)',chile,          'Kg.');
  setRow('ajo',             'Ajo',            null,                   ajo,            'Dientes');
  setRow('azafran',         'Azafrán molido', '1 sobre c/4 personas', azafran,        'Sobres');
  setRow('aceite',          'Aceite de oliva',null,                   aceite,         'Litros');
  setRow('sal-oz',          'Sal gruesa',     'Si se usa agua pura',  sal_oz_peso,    'Oz. peso');
  setRow('sal-cucharaditas','Sal gruesa',     'Si se usa agua pura',  sal_cucharaditas,'Cdtas.');
  setRow('liquido-total',   'Líquido total',  null,                   liquido_total,  'Litros');
  setRow('agua-adicional',  'Agua adicional al caldo', null,          agua_adicional, 'Litros', agua_adicional < 0);

  // ── Render paellera ──
  setStat('vol-litros',  vol_litros,  1);
  setStat('vol-galones', vol_galones, 2);
  setStat('vol-tazas',   vol_tazas,   0);

  const fill = document.getElementById('pan-fill');
  if (fill) {
    fill.style.height = pct + '%';
    fill.className = 'pan-fill' + (over ? ' over' : '');
  }

  const panLabel = document.getElementById('pan-label');
  if (panLabel) panLabel.textContent = fmt(pct, 0) + '%';

  const panDims = document.getElementById('pan-dims');
  if (panDims) {
    panDims.innerHTML =
      `Cap. <strong>${fmt(personas_cap, 0)}</strong> personas<br>` +
      `⌀ ${diam_arriba}/${diam_abajo} cm · h ${alto} cm`;
  }

  const status = document.getElementById('capacity-status');
  if (status) {
    if (over) {
      status.className = 'capacity-status warning';
      status.textContent = `⚠ Necesitas una paellera más grande — capacidad máx. ${fmt(personas_cap, 0)} personas`;
    } else {
      status.className = 'capacity-status';
      status.textContent = `✓ Tu paellera cabe ${fmt(personas_cap, 0)} personas — usando el ${fmt(pct, 0)}%`;
    }
  }

  // ── Persona icons ──
  updatePersonaIcons(Math.round(personas));
}

function step(id, delta) {
  const el = document.getElementById(id);
  el.value = Math.max(1, (parseFloat(el.value) || 0) + delta);
  calculate();
}

calculate();
