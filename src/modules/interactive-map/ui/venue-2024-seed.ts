import type { EditorZone } from "./zone-editor";

/**
 * Aproximación editable del plano CAD de EXPOJUY 2024 (Ciudad Cultural),
 * generada a partir del plano que compartió el usuario y el informe oficial
 * de la Cámara (167 stands: 95 cubiertos, 25 artesanos, 32 descubiertos,
 * 13 gastronómicos, 2 juegos). No son coordenadas trazadas píxel a píxel del
 * plano — eso no se puede hacer con confianza desde una imagen rasterizada —
 * son posiciones/tamaños razonables respetando la estructura real (fila recta,
 * espina de pescado rotada 45°, grilla densa, stands descubiertos con sus
 * m² reales, zona circular de juegos) para que el punto de partida sea
 * "ajustar", no "crear todo de cero".
 */

function zone(partial: Omit<EditorZone, "shape" | "rotation" | "areaM2" | "notes"> & Partial<EditorZone>): EditorZone {
  return {
    shape: "rect",
    rotation: 0,
    areaM2: null,
    notes: "",
    ...partial,
  };
}

const institucional: EditorZone[] = [
  zone({ id: "inst-eventos", label: "Eventos CCE", category: "institucional", x: 20, y: 20, width: 120, height: 68 }),
  zone({ id: "inst-emergencia", label: "Emergencia", category: "institucional", x: 148, y: 20, width: 82, height: 68 }),
  zone({ id: "inst-fne", label: "FNE", category: "institucional", x: 20, y: 96, width: 210, height: 58 }),
  zone({
    id: "inst-ministerio",
    label: "Ministerio de la Producción",
    category: "institucional",
    x: 20,
    y: 162,
    width: 210,
    height: 112,
  }),
];

// Serie A — fila recta contra el borde superior del pabellón (~20 stands cubiertos).
const A_COUNT = 20;
const aSeries: EditorZone[] = Array.from({ length: A_COUNT }, (_, i) => {
  const n = i + 1;
  const width = 34;
  const gap = 3;
  return zone({
    id: `A${n}`,
    label: `A${String(n).padStart(2, "0")}`,
    category: "cubierto",
    x: 380 + i * (width + gap),
    y: 55,
    width,
    height: 26,
  });
});

// Serie B — espina de pescado, 9 filas x 13 = 117 stands cubiertos, rotados 45°.
const B_ROWS = 9;
const B_COLS = 13;
const bSeries: EditorZone[] = [];
{
  const cellW = 46;
  const cellH = 46;
  const originX = 400;
  const originY = 110;
  const size = 30;
  let n = 1;
  for (let r = 0; r < B_ROWS; r++) {
    const offset = r % 2 === 0 ? 0 : cellW / 2;
    for (let c = 0; c < B_COLS; c++) {
      bSeries.push(
        zone({
          id: `B${n}`,
          label: `B${n}`,
          category: "cubierto",
          rotation: 45,
          x: originX + c * cellW + offset - size / 2,
          y: originY + r * cellH - size / 2,
          width: size,
          height: size,
        }),
      );
      n++;
    }
  }
}

// Serie C — grilla densa junto al ingreso de proveedores (~25 stands de artesanos).
const cSeries: EditorZone[] = [];
{
  let n = 1;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      cSeries.push(
        zone({
          id: `C${n}`,
          label: `C${n}`,
          category: "artesano",
          x: 1030 + c * 26,
          y: 130 + r * 26,
          width: 22,
          height: 22,
        }),
      );
      n++;
    }
  }
}

// Serie D — stands descubiertos, tamaños reales del plano 2024 (32 stands, 18–120 m²).
const dSeries: EditorZone[] = [
  zone({ id: "D1", label: "D1", category: "descubierto", x: 20, y: 300, width: 60, height: 50, areaM2: 80 }),
  zone({ id: "D2", label: "D2", category: "descubierto", x: 20, y: 355, width: 70, height: 55, areaM2: 100 }),
  zone({ id: "D3", label: "D3", category: "descubierto", x: 20, y: 415, width: 70, height: 55, areaM2: 100 }),
  zone({ id: "D4", label: "D4", category: "descubierto", x: 20, y: 475, width: 55, height: 40, areaM2: 55 }),
  zone({ id: "D5", label: "D5", category: "descubierto", x: 260, y: 55, width: 50, height: 60, areaM2: 50 }),
  zone({ id: "D6", label: "D6", category: "descubierto", x: 210, y: 290, width: 44, height: 44, areaM2: 40 }),
  zone({ id: "D6b", label: "D6b", category: "descubierto", x: 210, y: 338, width: 44, height: 44, areaM2: 40 }),
  zone({ id: "D7", label: "D7", category: "descubierto", x: 262, y: 290, width: 48, height: 48, areaM2: 50 }),
  zone({ id: "D8", label: "D8", category: "descubierto", x: 262, y: 342, width: 48, height: 48, areaM2: 50 }),
  zone({ id: "D9", label: "D9", category: "descubierto", x: 320, y: 400, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D10", label: "D10", category: "descubierto", x: 358, y: 400, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D11", label: "D11", category: "descubierto", x: 396, y: 370, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D12", label: "D12", category: "descubierto", x: 434, y: 370, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D13", label: "D13", category: "descubierto", x: 472, y: 370, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D14", label: "D14", category: "descubierto", x: 510, y: 395, width: 46, height: 40, areaM2: 70 }),
  zone({ id: "D14b", label: "D14*", category: "descubierto", x: 562, y: 395, width: 34, height: 34, areaM2: 30 }),
  zone({ id: "D15", label: "D15", category: "descubierto", x: 602, y: 390, width: 48, height: 44, areaM2: 75 }),
  zone({ id: "D16", label: "D16", category: "descubierto", x: 745, y: 390, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D17", label: "D17", category: "descubierto", x: 340, y: 445, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D24", label: "D24", category: "descubierto", x: 378, y: 445, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D18", label: "D18", category: "descubierto", x: 416, y: 445, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D19", label: "D19", category: "descubierto", x: 454, y: 445, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D20", label: "D20", category: "descubierto", x: 510, y: 440, width: 46, height: 44, areaM2: 50 }),
  zone({ id: "D21", label: "D21", category: "descubierto", x: 562, y: 440, width: 46, height: 44, areaM2: 50 }),
  zone({ id: "D22", label: "D22", category: "descubierto", x: 630, y: 445, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D23", label: "D23", category: "descubierto", x: 668, y: 445, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D25", label: "D25", category: "descubierto", x: 706, y: 445, width: 34, height: 34, areaM2: 25 }),
  zone({ id: "D26", label: "D26", category: "descubierto", x: 120, y: 545, width: 68, height: 55, areaM2: 80 }),
  zone({ id: "D27", label: "D27", category: "descubierto", x: 196, y: 545, width: 68, height: 55, areaM2: 80 }),
  zone({ id: "D28", label: "D28", category: "descubierto", x: 296, y: 540, width: 90, height: 60, areaM2: 120 }),
  zone({ id: "D29", label: "D29", category: "descubierto", x: 418, y: 545, width: 68, height: 55, areaM2: 80 }),
  zone({ id: "D30", label: "D30", category: "descubierto", x: 20, y: 605, width: 60, height: 55, areaM2: 75 }),
  zone({ id: "D31", label: "D31", category: "descubierto", x: 86, y: 605, width: 60, height: 55, areaM2: 75 }),
  zone({ id: "D32", label: "D32", category: "descubierto", x: 152, y: 615, width: 30, height: 35, areaM2: 18 }),
];

const eZones: EditorZone[] = [
  zone({
    id: "E1",
    label: "E1 — Bomberos/Policía/Ejército",
    category: "infraestructura",
    x: 780,
    y: 390,
    width: 150,
    height: 110,
    areaM2: 450,
    notes: "Educación vial",
  }),
  zone({
    id: "E2",
    label: "E2 — Juegos Infantiles",
    category: "juego",
    shape: "circle",
    x: 950,
    y: 430,
    width: 170,
    height: 170,
    areaM2: 700,
  }),
];

const escenario = zone({
  id: "escenario",
  label: "Escenario",
  category: "infraestructura",
  x: 860,
  y: 560,
  width: 90,
  height: 70,
});

const acceso = zone({
  id: "acceso",
  label: "Acceso principal",
  category: "infraestructura",
  x: 20,
  y: 690,
  width: 120,
  height: 40,
});

// Serie F — patio de comidas, en arco suave siguiendo la curva real del predio (12 stands).
const F_COUNT: number = 12;
const fSeries: EditorZone[] = Array.from({ length: F_COUNT }, (_, i) => {
  const n = i + 1;
  const t = F_COUNT === 1 ? 0 : i / (F_COUNT - 1);
  const startX = 220;
  const endX = 800;
  return zone({
    id: `F${n}`,
    label: `F${String(n).padStart(2, "0")}`,
    category: "gastronomico",
    x: startX + t * (endX - startX),
    y: 660 - Math.sin(t * Math.PI) * 25,
    width: 46,
    height: 34,
    rotation: Math.round((t - 0.5) * 20),
  });
});

export const VENUE_2024_SEED: EditorZone[] = [
  ...institucional,
  ...aSeries,
  ...bSeries,
  ...cSeries,
  ...dSeries,
  ...eZones,
  escenario,
  acceso,
  ...fSeries,
];
