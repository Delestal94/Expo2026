import type { EditorZone } from "./zone-editor";

/**
 * Calco del plano simplificado de EXPOJUY 2024 (Ciudad Cultural).
 *
 * La fuente es la versión limpia del plano (1200x850), no el CAD original con
 * cotas y capas de fondo: al tener las mismas dimensiones que el lienzo del
 * editor, las coordenadas se leen 1:1 y no hay reescalado que deforme nada.
 *
 * Sigue siendo un calco hecho a ojo sobre una imagen: es el punto de partida
 * para ajustar con el mouse (con el plano de fondo activado se calza exacto),
 * no un plano de obra.
 */

type ZoneInput = Omit<EditorZone, "shape" | "rotation" | "areaM2" | "notes"> & Partial<EditorZone>;

function zone(input: ZoneInput): EditorZone {
  return { shape: "rect", rotation: 0, areaM2: null, notes: "", ...input };
}

/** Zona definida por su caja (x1,y1)-(x2,y2) en coordenadas del plano. */
function box(
  input: Omit<ZoneInput, "x" | "y" | "width" | "height"> & { at: [number, number, number, number] },
): EditorZone {
  const { at, ...rest } = input;
  const [x1, y1, x2, y2] = at;
  return zone({ ...rest, x: x1, y: y1, width: Math.max(8, x2 - x1), height: Math.max(8, y2 - y1) });
}

// ── Pabellón cubierto ───────────────────────────────────────────────────────
// Va primero para dibujarse por debajo de las series A, B y C que contiene.
const pabellon = box({
  id: "pabellon",
  label: "Pabellón cubierto",
  category: "infraestructura",
  at: [380, 17, 1040, 370],
  notes: "Salón techado con las series A, B y C",
});

// ── Bloque institucional (la L de la esquina superior izquierda) ────────────
const institucional: EditorZone[] = [
  box({ id: "inst-eventos", label: "Eventos CCE", category: "institucional", at: [110, 27, 250, 88] }),
  box({ id: "inst-emergencia", label: "Emergencia", category: "institucional", at: [250, 27, 332, 88] }),
  box({ id: "inst-fne", label: "FNE", category: "institucional", at: [110, 88, 250, 190] }),
  box({
    id: "inst-ministerio",
    label: "Ministerio de la Producción",
    category: "institucional",
    at: [110, 190, 250, 296],
  }),
];

// ── Serie A — fila superior del pabellón ────────────────────────────────────
// La numeración del plano intercala A21 entre A16 y A17.
const A_LABELS = [
  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10",
  "A11", "A12", "A13", "A14", "A15", "A16", "A21", "A17", "A18", "A19",
];
const A_START = 383;
const A_STEP = (1035 - A_START) / A_LABELS.length;
const aSeries: EditorZone[] = A_LABELS.map((label, i) =>
  box({
    id: label,
    label,
    category: "cubierto",
    at: [
      Math.round(A_START + i * A_STEP),
      20,
      Math.round(A_START + (i + 1) * A_STEP) - 1,
      72,
    ],
  }),
);

// A20 y A22 van aparte, en el borde inferior izquierdo del pabellón.
const aExtra: EditorZone[] = [
  box({ id: "A20", label: "A20", category: "cubierto", at: [385, 310, 435, 338] }),
  box({ id: "A22", label: "A22", category: "cubierto", at: [400, 338, 450, 365] }),
];

// ── Serie B — 117 stands en espina de pescado ───────────────────────────────
// Retícula de rombos con pasillos diagonales en el mismo sentido que el plano
// (bajan hacia la derecha), lo que separa los bloques en bandas.
const bSeries: EditorZone[] = (() => {
  const out: EditorZone[] = [];
  const left = 425;
  const top = 92;
  const right = 950;
  const bottom = 345;
  const cols = 16;
  const rows = 11;
  const stepX = (right - left) / cols;
  const stepY = (bottom - top) / rows;
  // Los rombos están rotados 45°: su diagonal mide lado*1.41, así que el lado
  // ronda dos tercios del paso para que se toquen por las puntas sin encimarse.
  const size = Math.round(stepX * 0.66);

  let n = 1;
  for (let r = 0; r < rows && n <= 117; r++) {
    for (let c = 0; c < cols && n <= 117; c++) {
      if ((c - r + 40) % 4 === 3) continue; // pasillo
      const offset = r % 2 === 0 ? 0 : stepX / 2;
      out.push(
        zone({
          id: `B${n}`,
          label: `B${n}`,
          category: "cubierto",
          rotation: 45,
          x: Math.round(left + c * stepX + offset - size / 2),
          y: Math.round(top + r * stepY - size / 2),
          width: size,
          height: size,
        }),
      );
      n++;
    }
  }
  return out;
})();

// ── Serie C — 28 stands de artesanos, sobre el lateral derecho del pabellón ─
const cSeries: EditorZone[] = (() => {
  const out: EditorZone[] = [];
  const add = (label: string, at: [number, number, number, number]) =>
    out.push(box({ id: label, label, category: "artesano", at }));

  // Columna angosta pegada al borde derecho del pabellón.
  for (let i = 0; i < 5; i++) {
    const y = 150 + i * 15;
    add(`C${i + 1}`, [1010, y, 1032, y + 13]);
  }
  // Bloque de 2x2 en el medio.
  for (let i = 0; i < 4; i++) {
    const r = Math.floor(i / 2);
    const c = i % 2;
    add(`C${6 + i}`, [968 + c * 20, 215 + r * 16, 986 + c * 20, 229 + r * 16]);
  }
  // Bloque inferior, tres columnas.
  for (let i = 0; i < 19; i++) {
    const r = Math.floor(i / 3);
    const c = i % 3;
    add(`C${10 + i}`, [960 + c * 25, 288 + r * 16, 982 + c * 25, 302 + r * 16]);
  }
  return out;
})();

// ── Serie D — stands descubiertos, con las cotas que trae el plano ──────────
const dSeries: EditorZone[] = [
  box({ id: "D1", label: "D1", category: "descubierto", at: [120, 318, 180, 365], areaM2: 80 }),
  box({ id: "D2", label: "D2", category: "descubierto", at: [120, 365, 180, 425], areaM2: 100 }),
  box({ id: "D3", label: "D3", category: "descubierto", at: [120, 425, 180, 480], areaM2: 100 }),
  box({ id: "D4", label: "D4", category: "descubierto", at: [95, 508, 180, 548], areaM2: 55, rotation: -12 }),
  box({ id: "D5", label: "D5", category: "descubierto", at: [296, 104, 345, 176], areaM2: 50 }),
  box({ id: "DB6", label: "DB6", category: "descubierto", at: [215, 335, 265, 375], areaM2: 40 }),
  box({ id: "D8-40", label: "D8", category: "descubierto", at: [215, 375, 265, 410], areaM2: 40 }),
  box({ id: "D7", label: "D7", category: "descubierto", at: [296, 318, 345, 370], areaM2: 50 }),
  box({ id: "D8-50", label: "D8", category: "descubierto", at: [296, 370, 345, 425], areaM2: 50 }),
  box({ id: "D9", label: "D9", category: "descubierto", at: [300, 455, 345, 495], areaM2: 25 }),
  box({ id: "D10", label: "D10", category: "descubierto", at: [345, 445, 390, 485], areaM2: 25 }),
  box({ id: "D11", label: "D11", category: "descubierto", at: [380, 395, 425, 440], areaM2: 25, rotation: -12 }),
  box({ id: "D12", label: "D12", category: "descubierto", at: [420, 405, 462, 450], areaM2: 25, rotation: -12 }),
  box({ id: "D13", label: "D13", category: "descubierto", at: [458, 425, 503, 470], areaM2: 25, rotation: -12 }),
  box({ id: "D14-a", label: "D14", category: "descubierto", at: [558, 420, 630, 470], areaM2: 70, rotation: -10 }),
  box({ id: "D14-b", label: "D14", category: "descubierto", at: [630, 412, 690, 460], areaM2: 70, rotation: -10 }),
  box({ id: "D15", label: "D15", category: "descubierto", at: [660, 405, 730, 455], areaM2: 75, rotation: -10 }),
  box({ id: "D7-b", label: "D7", category: "descubierto", at: [733, 402, 766, 447], rotation: -10 }),
  box({ id: "D16", label: "D16", category: "descubierto", at: [895, 400, 940, 442], areaM2: 25 }),
  box({ id: "D42", label: "D42", category: "descubierto", at: [370, 508, 405, 550], areaM2: 25 }),
  box({ id: "D24", label: "D24", category: "descubierto", at: [405, 508, 440, 550], areaM2: 25 }),
  box({ id: "D18", label: "D18", category: "descubierto", at: [440, 508, 475, 550], areaM2: 96 }),
  box({ id: "D19", label: "D19", category: "descubierto", at: [475, 508, 510, 550], areaM2: 25 }),
  box({ id: "D20", label: "D20", category: "descubierto", at: [565, 512, 635, 552], areaM2: 80 }),
  box({ id: "D21", label: "D21", category: "descubierto", at: [635, 512, 690, 552], areaM2: 50 }),
  box({ id: "D22", label: "D22", category: "descubierto", at: [738, 508, 773, 550], areaM2: 25 }),
  box({ id: "D23", label: "D23", category: "descubierto", at: [773, 508, 805, 550], areaM2: 25 }),
  box({ id: "D25", label: "D25", category: "descubierto", at: [805, 508, 840, 550], areaM2: 25 }),
  box({ id: "D26", label: "D26", category: "descubierto", at: [245, 573, 310, 630], areaM2: 80 }),
  box({ id: "D27", label: "D27", category: "descubierto", at: [310, 573, 375, 630], areaM2: 80 }),
  box({ id: "D28", label: "D28", category: "descubierto", at: [400, 573, 495, 630], areaM2: 120 }),
  box({ id: "D29", label: "D29", category: "descubierto", at: [565, 573, 635, 630], areaM2: 80 }),
  box({ id: "D31", label: "D31", category: "descubierto", at: [130, 715, 185, 770] }),
  box({ id: "D32", label: "D32", category: "descubierto", at: [185, 715, 235, 770] }),
];

// ── Zonas E — polígonos rojos del sector de servicios y juegos ──────────────
const eZones: EditorZone[] = [
  box({
    id: "E1",
    label: "E1 — Bomberos",
    category: "infraestructura",
    shape: "polygon",
    points: [
      [0.025, 0.22],
      [0.975, 0],
      [1, 0.78],
      [0.05, 1],
    ],
    at: [890, 375, 1090, 465],
    areaM2: 450,
  }),
  box({
    id: "E-medio",
    label: "Servicios",
    category: "infraestructura",
    shape: "polygon",
    points: [
      [0.03, 0.15],
      [1, 0],
      [1, 0.7],
      [0, 1],
    ],
    at: [905, 480, 1090, 545],
  }),
  box({
    id: "E2",
    label: "E2 — Juegos infantiles",
    category: "juego",
    shape: "polygon",
    points: [
      [0, 0.07],
      [0.8, 0],
      [1, 0.54],
      [0.75, 1],
      [0.29, 1],
      [0, 0.54],
    ],
    at: [900, 545, 1155, 685],
    areaM2: 700,
  }),
];

// ── Escenario, patio de comidas y acceso ────────────────────────────────────
const escenario = box({
  id: "escenario",
  label: "Escenario",
  category: "infraestructura",
  at: [800, 573, 850, 630],
});

const patioComidas = box({
  id: "patio-comidas",
  label: "Área patio de comidas",
  category: "gastronomico",
  shape: "polygon",
  points: [
    [0.01, 0],
    [0.95, 0],
    [1, 1],
    [0, 1],
  ],
  at: [355, 670, 750, 790],
});

const acceso = box({
  id: "acceso",
  label: "Acceso",
  category: "infraestructura",
  at: [10, 578, 80, 606],
});

// ── Serie F — gastronómicos: dos pares sueltos y la fila F03..F10 ───────────
const fSeries: EditorZone[] = [
  box({ id: "F1-a", label: "F01", category: "gastronomico", at: [130, 663, 185, 715] }),
  box({ id: "F2-a", label: "F02", category: "gastronomico", at: [185, 663, 235, 715] }),
  box({ id: "F1-b", label: "F01", category: "gastronomico", at: [770, 690, 818, 745] }),
  box({ id: "F2-b", label: "F02", category: "gastronomico", at: [820, 690, 870, 745] }),
  box({ id: "F3", label: "F03", category: "gastronomico", at: [296, 795, 351, 845] }),
  box({ id: "F4", label: "F04", category: "gastronomico", at: [355, 795, 410, 845] }),
  box({ id: "F5", label: "F05", category: "gastronomico", at: [410, 795, 465, 845] }),
  box({ id: "F6", label: "F06", category: "gastronomico", at: [465, 795, 520, 845] }),
  box({ id: "F7", label: "F07", category: "gastronomico", at: [520, 795, 578, 845] }),
  box({ id: "F8", label: "F08", category: "gastronomico", at: [580, 795, 636, 845] }),
  box({ id: "F9", label: "F09", category: "gastronomico", at: [638, 795, 694, 845] }),
  box({ id: "F10", label: "F10", category: "gastronomico", at: [696, 795, 751, 845] }),
];

export const VENUE_2024_SEED: EditorZone[] = [
  pabellon,
  ...institucional,
  ...aSeries,
  ...aExtra,
  ...bSeries,
  ...cSeries,
  ...dSeries,
  ...eZones,
  escenario,
  patioComidas,
  acceso,
  ...fSeries,
];
