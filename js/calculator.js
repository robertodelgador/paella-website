'use strict';

// Constants from Excel
const TAZAS_POR_LB     = 2.35;   // C35
const OZ_FLUIDA_POR_TAZA = 8;    // C39
const TAZAS_COCIDAS_POR_CRUDA = 4.3; // C40
const ML_PER_OZ_FLUIDA = 33.8140227018;
const L_PER_GALON      = 3.785411784;
const ACEITE_GALON     = 3.785411784;
const PERSONAS_PER_LITER = 2.212389;

function fmt(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return parseFloat(val.toFixed(decimals)).toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

function setRow(id, name, sub, value, unit, extraClass = '') {
  const el = document.getElementById(id);
  if (!el) return;
  const cls = extraClass ? ` ${extraClass}` : '';
  el.className = `ing-row${cls}`;
  el.innerHTML = `
    <span class="ing-name">${name}${sub ? `<small>${sub}</small>` : ''}</span>
    <span><span class="ing-val">${fmt(value)}</span><span class="ing-unit">${unit}</span></span>
  `;
}

function calculate() {
  const personas   = Math.max(1, parseFloat(document.getElementById('personas').value)   || 1);
  const caldo      = Math.max(0, parseFloat(document.getElementById('caldo').value)      || 0);
  const diam_arriba = parseFloat(document.getElementById('diam_arriba').value) || 83;
  const diam_abajo  = parseFloat(document.getElementById('diam_abajo').value)  || 72;
  const alto        = parseFloat(document.getElementById('alto').value)        || 11.5;

  // ── Ingredients ──────────────────────────────────────────────
  const arroz_lbs        = 20/100 * personas;
  const arroz_tazas      = arroz_lbs * TAZAS_POR_LB;
  const chorizo          = 6/100   * personas;
  const camaron          = 25/100  * personas;
  const camaron_adorno   = 6/100   * personas;
  const calamar          = 25/100  * personas;
  const almeja           = 10/100  * personas;
  const cebolla          = 6.25/100 * personas;
  const pollo            = 20/100  * personas;
  const ajo              = personas / 1.6;
  const azafran          = personas / 4;
  const tomates          = 5/100   * personas;
  const zanahoria        = 6/100   * personas;
  const alberja          = 5/100   * personas;
  const chile            = 1.65/100 * personas;
  const aceite           = (ACEITE_GALON / 2 / 100) * personas;

  // ── Liquids ──────────────────────────────────────────────────
  const liquido_total    = arroz_tazas * OZ_FLUIDA_POR_TAZA / ML_PER_OZ_FLUIDA * 2;
  const agua_adicional   = liquido_total - caldo;

  // ── Salt ─────────────────────────────────────────────────────
  const sal_cucharaditas = liquido_total * ML_PER_OZ_FLUIDA / 8;
  const sal_oz_peso      = sal_cucharaditas * 1.5 / 1000 * 2.20462262185 * 16;

  // ── Paellera ─────────────────────────────────────────────────
  const r = (diam_arriba + diam_abajo) / 2 / 2;
  const vol_litros   = r * r * Math.PI * alto / 1000;
  const vol_galones  = vol_litros / L_PER_GALON;
  const vol_tazas    = vol_litros * ML_PER_OZ_FLUIDA / 8;
  const personas_cap = vol_litros * PERSONAS_PER_LITER;

  // ── Render ingredients ───────────────────────────────────────
  setRow('arroz-lbs',    'Arroz crudo',    null,              arroz_lbs,      'Lbs.');
  setRow('arroz-tazas',  'Arroz crudo',    null,              arroz_tazas,    'Tazas');
  setRow('camaron',      'Camarón',        'Grande y mediano', camaron,       'Lbs.');
  setRow('camaron-adorno','Camarón',       'Grande (adorno)',  camaron_adorno,'Lbs.');
  setRow('calamar',      'Calamar',        null,              calamar,        'Lbs.');
  setRow('almeja',       'Almeja',         'Con concha',       almeja,        'Lbs.');
  setRow('pollo',        'Pollo',          'Pechugas cortadas en 6', pollo,   'Lbs.');
  setRow('chorizo',      'Chorizo',        null,              chorizo,        'Lbs.');
  setRow('cebolla',      'Cebolla',        null,              cebolla,        'Lbs.');
  setRow('tomates',      'Tomates',        null,              tomates,        'Lbs.');
  setRow('zanahoria',    'Zanahoria',      null,              zanahoria,      'Lbs.');
  setRow('alberja',      'Alberja',        null,              alberja,        'Lbs.');
  setRow('chile',        'Chile pimiento', 'Adorno (lata 1.65 kg)', chile,   'Kg.');
  setRow('ajo',          'Ajo',            null,              ajo,            'Dientes');
  setRow('azafran',      'Azafrán molido', '1 sobre c/4 personas', azafran,  'Sobres');
  setRow('aceite',       'Aceite de oliva',null,              aceite,         'Litros');
  setRow('sal-oz',       'Sal gruesa',     'Si se usa agua pura', sal_oz_peso,'Oz. peso');
  setRow('sal-cucharaditas','Sal gruesa',  'Si se usa agua pura', sal_cucharaditas,'Cucharaditas');
  setRow('liquido-total','Líquido total necesario', null,    liquido_total,  'Litros');
  setRow('agua-adicional','Agua adicional al caldo', null,   agua_adicional, 'Litros',
    agua_adicional < 0 ? 'warning' : '');

  // ── Render paellera ──────────────────────────────────────────
  document.getElementById('vol-litros').textContent  = fmt(vol_litros, 1);
  document.getElementById('vol-galones').textContent = fmt(vol_galones, 2);
  document.getElementById('vol-tazas').textContent   = fmt(vol_tazas, 0);
  document.getElementById('personas-cap').textContent = fmt(personas_cap, 0);

  const pct = Math.min(personas / personas_cap * 100, 100);
  const fill = document.getElementById('capacity-fill');
  fill.style.width = pct + '%';
  fill.className = 'capacity-fill' + (personas > personas_cap ? ' over' : '');

  const pctLabel = personas > personas_cap
    ? `⚠ ${fmt(personas / personas_cap * 100, 0)}% — necesitas una paellera más grande`
    : `${fmt(pct, 0)}% de capacidad`;
  document.getElementById('capacity-pct').textContent = pctLabel;
}

function step(id, delta) {
  const el = document.getElementById(id);
  el.value = Math.max(1, (parseFloat(el.value) || 0) + delta);
  calculate();
}

// Init
calculate();
