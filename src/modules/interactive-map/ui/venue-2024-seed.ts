import type { EditorZone } from "./zone-editor";

/**
 * Calco editable del plano CAD de EXPOJUY 2024 (Ciudad Cultural).
 *
 * Las coordenadas se obtuvieron midiendo posiciones sobre la imagen del plano
 * y escalándolas al lienzo de 1200x750 (el CAD original ronda 1650x1200, de ahí
 * los factores de abajo). Es un calco hecho a ojo sobre una imagen rasterizada,
 * no una conversión vectorial: sirve como punto de partida para ajustar con el
 * mouse, no como plano de obra.
 *
 * Referencias del informe oficial de la Cámara: 167 stands — 95 cubiertos,
 * 25 artesanos, 32 descubiertos, 13 gastronómicos, 2 juegos.
 */

const CAD_W = 1650;
const CAD_H = 1200;
const VIEW_W = 1200;
const VIEW_H = 750;

/** Pasa una medida horizontal del plano CAD al lienzo del editor. */
const sx = (cadX: number) => Math.round((cadX / CAD_W) * VIEW_W);
/** Pasa una medida vertical del plano CAD al lienzo del editor. */
const sy = (cadY: number) => Math.round((cadY / CAD_H) * VIEW_H);

type ZoneInput = Omit<EditorZone, "shape" | "rotation" | "areaM2" | "notes"> & Partial<EditorZone>;

function zone(input: ZoneInput): EditorZone {
  return { shape: "rect", rotation: 0, areaM2: null, notes: "", ...input };
}

/** Zona definida directamente con coordenadas del plano CAD (x1,y1)-(x2,y2). */
function cadZone(
  input: Omit<ZoneInput, "x" | "y" | "width" | "height"> & {
    cad: [number, number, number, number];
  },
): EditorZone {
  const { cad, ...rest } = input;
  const [x1, y1, x2, y2] = cad;
  return zone({
    ...rest,
    x: sx(x1),
    y: sy(y1),
    width: Math.max(8, sx(x2) - sx(x1)),
    height: Math.max(8, sy(y2) - sy(y1)),
  });
}

// ── Bloque institucional (esquina superior izquierda) ────────────────────────
const institucional: EditorZone[] = [
  cadZone({ id: "inst-eventos", label: "Eventos CCE", category: "institucional", cad: [155, 60, 330, 145] }),
  cadZone({ id: "inst-emergencia", label: "Emergencia", category: "institucional", cad: [332, 60, 437, 145] }),
  cadZone({ id: "inst-fne", label: "FNE", category: "institucional", cad: [155, 148, 330, 262] }),
  cadZone({
    id: "inst-ministerio",
    label: "Ministerio de la Producción",
    category: "institucional",
    cad: [155, 264, 330, 392],
  }),
];

// ── Serie A — fila recta contra el borde superior del pabellón ───────────────
// El plano numera A01..A16, después intercala A21, y sigue con A17, A18, A19.
const A_LABELS = [
  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10",
  "A11", "A12", "A13", "A14", "A15", "A16", "A21", "A17", "A18", "A19",
];
const aSeries: EditorZone[] = A_LABELS.map((label, i) => {
  const cadX = 515 + i * 45;
  return cadZone({ id: label, label, category: "cubierto", cad: [cadX, 88, cadX + 42, 126] });
});

// A20 y A22 van aparte, sobre el borde inferior izquierdo del pabellón.
const aExtra: EditorZone[] = [
  cadZone({ id: "A20", label: "A20", category: "cubierto", cad: [520, 425, 592, 470] }),
  cadZone({ id: "A22", label: "A22", category: "cubierto", cad: [543, 470, 610, 500] }),
];

// ── Serie B — espina de pescado (117 stands cubiertos) ───────────────────────
// Rombos en retícula diagonal con pasillos: en la mitad superior los pasillos
// corren en un sentido y en la inferior en el otro, que es lo que arma el
// patrón de espina/chevrón del plano en vez de una grilla pareja.
const bSeries: EditorZone[] = (() => {
  const out: EditorZone[] = [];
  const rows = 10;
  const cols = 16;
  const stepX = (sx(1240) - sx(580)) / cols;
  const stepY = (sy(468) - sy(155)) / rows;
  const originX = sx(592);
  const originY = sy(168);
  // Los rombos se tocan por las puntas sin encimarse: al estar rotados 45°, su
  // diagonal mide lado*1.41, así que el lado tiene que quedar en ~0.66 del paso
  // horizontal (las filas van intercaladas media celda, como en el plano).
  const size = Math.round(stepX * 0.66);
  const midRow = Math.floor(rows / 2);

  let n = 1;
  for (let r = 0; r < rows && n <= 117; r++) {
    for (let c = 0; c < cols && n <= 117; c++) {
      const isAisle = r < midRow ? (c + r) % 4 === 3 : (c - r + 40) % 4 === 3;
      if (isAisle) continue;
      const offset = r % 2 === 0 ? 0 : stepX / 2;
      out.push(
        zone({
          id: `B${n}`,
          label: `B${n}`,
          category: "cubierto",
          rotation: 45,
          x: Math.round(originX + c * stepX + offset - size / 2),
          y: Math.round(originY + r * stepY - size / 2),
          width: size,
          height: size,
        }),
      );
      n++;
    }
  }
  return out;
})();

// ── Serie C — 28 stands de artesanos, en los dos bloques del lateral derecho ─
const cSeries: EditorZone[] = (() => {
  const out: EditorZone[] = [];
  const add = (label: string, cad: [number, number, number, number]) =>
    out.push(cadZone({ id: label, label, category: "artesano", cad }));

  // Columna angosta pegada al borde derecho (C1..C9, de abajo hacia arriba).
  for (let i = 0; i < 9; i++) {
    const cadY = 232 + i * 30;
    add(`C${9 - i}`, [1316, cadY, 1352, cadY + 26]);
  }
  // Bloque superior de 3x3 (C10..C18).
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cadX = 1245 + c * 34;
      const cadY = 305 + r * 32;
      add(`C${10 + r * 3 + c}`, [cadX, cadY, cadX + 30, cadY + 27]);
    }
  }
  // Bloque inferior (C19..C28): tres filas de 3 más uno.
  for (let i = 0; i < 10; i++) {
    const r = Math.floor(i / 3);
    const c = i % 3;
    const cadX = 1192 + c * 34;
    const cadY = 402 + r * 30;
    add(`C${19 + i}`, [cadX, cadY, cadX + 30, cadY + 25]);
  }
  return out;
})();

// ── Serie D — 32 stands descubiertos, con sus m² reales del plano ────────────
// La banda del medio (D11..D15) sigue el camino diagonal que cruza el predio,
// por eso va rotada; los bloques de los extremos están alineados a los ejes.
const dSeries: EditorZone[] = [
  cadZone({ id: "D1", label: "D1", category: "descubierto", cad: [165, 435, 237, 488], areaM2: 80 }),
  cadZone({ id: "D2", label: "D2", category: "descubierto", cad: [165, 490, 250, 562], areaM2: 100 }),
  cadZone({ id: "D3", label: "D3", category: "descubierto", cad: [165, 565, 250, 660], areaM2: 100 }),
  cadZone({ id: "D4", label: "D4", category: "descubierto", cad: [175, 680, 250, 733], areaM2: 55, rotation: -8 }),
  cadZone({ id: "D5", label: "D5", category: "descubierto", cad: [405, 190, 452, 243], areaM2: 50 }),
  cadZone({ id: "D6b", label: "D6b", category: "descubierto", cad: [295, 460, 357, 505], areaM2: 40 }),
  cadZone({ id: "D6", label: "D6", category: "descubierto", cad: [295, 508, 357, 552], areaM2: 40 }),
  cadZone({ id: "D7", label: "D7", category: "descubierto", cad: [400, 440, 452, 492], areaM2: 50 }),
  cadZone({ id: "D8", label: "D8", category: "descubierto", cad: [400, 520, 452, 572], areaM2: 50 }),
  cadZone({ id: "D9", label: "D9", category: "descubierto", cad: [400, 608, 452, 655], areaM2: 25 }),
  cadZone({ id: "D10", label: "D10", category: "descubierto", cad: [463, 592, 515, 640], areaM2: 25 }),
  cadZone({ id: "D11", label: "D11", category: "descubierto", cad: [512, 552, 566, 606], areaM2: 25, rotation: -16 }),
  cadZone({ id: "D12", label: "D12", category: "descubierto", cad: [550, 560, 604, 616], areaM2: 25, rotation: -16 }),
  cadZone({ id: "D13", label: "D13", category: "descubierto", cad: [612, 578, 666, 632], areaM2: 25, rotation: -16 }),
  cadZone({ id: "D14", label: "D14", category: "descubierto", cad: [742, 568, 832, 638], areaM2: 70, rotation: -12 }),
  cadZone({ id: "D14b", label: "D14*", category: "descubierto", cad: [834, 568, 882, 622], areaM2: 30, rotation: -12 }),
  cadZone({ id: "D15", label: "D15", category: "descubierto", cad: [884, 553, 976, 617], areaM2: 75, rotation: -12 }),
  cadZone({ id: "D16", label: "D16", category: "descubierto", cad: [1185, 543, 1237, 592], areaM2: 25 }),
  cadZone({ id: "D17", label: "D17", category: "descubierto", cad: [500, 678, 542, 732], areaM2: 25 }),
  cadZone({ id: "D24", label: "D24", category: "descubierto", cad: [543, 678, 583, 732], areaM2: 25 }),
  cadZone({ id: "D18", label: "D18", category: "descubierto", cad: [584, 678, 624, 732], areaM2: 25 }),
  cadZone({ id: "D19", label: "D19", category: "descubierto", cad: [625, 678, 667, 732], areaM2: 25 }),
  cadZone({ id: "D20", label: "D20", category: "descubierto", cad: [748, 678, 832, 737], areaM2: 50 }),
  cadZone({ id: "D21", label: "D21", category: "descubierto", cad: [836, 678, 920, 737], areaM2: 50 }),
  cadZone({ id: "D22", label: "D22", category: "descubierto", cad: [972, 672, 1018, 727], areaM2: 25 }),
  cadZone({ id: "D23", label: "D23", category: "descubierto", cad: [1020, 672, 1062, 727], areaM2: 25 }),
  cadZone({ id: "D25", label: "D25", category: "descubierto", cad: [1064, 672, 1108, 727], areaM2: 25 }),
  cadZone({ id: "D26", label: "D26", category: "descubierto", cad: [330, 752, 416, 832], areaM2: 80 }),
  cadZone({ id: "D27", label: "D27", category: "descubierto", cad: [420, 752, 502, 832], areaM2: 80 }),
  cadZone({ id: "D28", label: "D28", category: "descubierto", cad: [540, 748, 672, 832], areaM2: 120 }),
  cadZone({ id: "D29", label: "D29", category: "descubierto", cad: [745, 752, 842, 832], areaM2: 80 }),
  cadZone({ id: "D30", label: "D30", category: "descubierto", cad: [190, 855, 250, 928], areaM2: 75 }),
  cadZone({ id: "D31", label: "D31", category: "descubierto", cad: [252, 855, 312, 928], areaM2: 75 }),
  cadZone({ id: "D32", label: "D32", category: "descubierto", cad: [330, 878, 367, 917], areaM2: 18 }),
];

// ── Zonas E — servicios y juegos: polígonos en ángulo, como en el CAD ────────
const eZones: EditorZone[] = [
  cadZone({
    id: "E1",
    label: "E1 — Bomberos/Policía/Ejército",
    category: "infraestructura",
    shape: "polygon",
    points: [
      [0.02, 0.12],
      [0.92, 0],
      [1, 0.82],
      [0.1, 1],
    ],
    cad: [1185, 518, 1428, 662],
    areaM2: 450,
    notes: "Bomberos, Policía, Ejército, Educación vial",
  }),
  cadZone({
    id: "E2",
    label: "E2 — Juegos Infantiles",
    category: "juego",
    shape: "polygon",
    points: [
      [0.02, 0.2],
      [0.78, 0],
      [1, 0.28],
      [0.9, 0.9],
      [0.36, 1],
      [0, 0.68],
    ],
    cad: [1180, 655, 1522, 882],
    areaM2: 700,
  }),
  cadZone({
    id: "E2-pista",
    label: "Juegos — pista",
    category: "juego",
    shape: "circle",
    cad: [1345, 705, 1495, 855],
    notes: "Pista circular dentro de E2",
  }),
];

// ── Escenario, patio de comidas y accesos ───────────────────────────────────
const escenario = cadZone({
  id: "escenario",
  label: "Escenario",
  category: "infraestructura",
  cad: [1072, 752, 1122, 832],
});

const patioComidas = cadZone({
  id: "patio-comidas",
  label: "Área patio de comidas",
  category: "gastronomico",
  shape: "polygon",
  points: [
    [0, 0],
    [1, 0],
    [0.97, 1],
    [0.03, 1],
  ],
  cad: [505, 875, 955, 1015],
  notes: "Sector de mesas del patio de comidas",
});

const acceso = cadZone({
  id: "acceso",
  label: "Acceso principal",
  category: "infraestructura",
  cad: [10, 762, 130, 800],
});

const gates: EditorZone[] = [
  cadZone({ id: "cce-1", label: "CCE", category: "infraestructura", cad: [88, 838, 133, 862] }),
  cadZone({ id: "cce-2", label: "CCE", category: "infraestructura", cad: [136, 838, 180, 862] }),
];

// ── Serie F — 13 stands gastronómicos en 3 grupos, como en el plano ─────────
const fSeries: EditorZone[] = [
  cadZone({ id: "F1", label: "F01", category: "gastronomico", cad: [365, 928, 412, 985] }),
  cadZone({ id: "F2", label: "F02", category: "gastronomico", cad: [365, 987, 412, 1042] }),
  cadZone({ id: "F3", label: "F03", category: "gastronomico", cad: [410, 1058, 482, 1105], rotation: -4 }),
  cadZone({ id: "F4", label: "F04", category: "gastronomico", cad: [490, 1053, 556, 1100], rotation: -4 }),
  cadZone({ id: "F5", label: "F05", category: "gastronomico", cad: [558, 1048, 622, 1095], rotation: -5 }),
  cadZone({ id: "F6", label: "F06", category: "gastronomico", cad: [624, 1046, 690, 1092], rotation: -6 }),
  cadZone({ id: "F7", label: "F07", category: "gastronomico", cad: [700, 1038, 766, 1085], rotation: -8 }),
  cadZone({ id: "F8", label: "F08", category: "gastronomico", cad: [774, 1028, 840, 1078], rotation: -9 }),
  cadZone({ id: "F9", label: "F09", category: "gastronomico", cad: [845, 1018, 911, 1070], rotation: -10 }),
  cadZone({ id: "F10", label: "F10", category: "gastronomico", cad: [918, 1008, 990, 1060], rotation: -11 }),
  cadZone({ id: "F11", label: "F11", category: "gastronomico", cad: [984, 938, 1044, 986] }),
  cadZone({ id: "F12", label: "F12", category: "gastronomico", cad: [1046, 938, 1106, 986] }),
];

export const VENUE_2024_SEED: EditorZone[] = [
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
  ...gates,
  ...fSeries,
];
