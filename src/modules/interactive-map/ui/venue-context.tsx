"use client";

import { useTranslations } from "next-intl";

/**
 * Marco urbano del plano: calles colindantes, veredas, estacionamiento,
 * accesos, arbolado y delimitación de sectores.
 *
 * Nada de esto sale del CAD de la Cámara — el CAD dibuja el predio y su
 * borde, no la manzana alrededor. Es contexto de lectura: sin él, el plano
 * son 220 formas geométricas flotando en negro y no se entiende por dónde
 * se entra ni qué sector es cada cosa.
 *
 * Por eso las calles van rotuladas por función ("vía de acceso vehicular")
 * y no con nombres propios: ponerles nombres reales sin tenerlos
 * confirmados sería inventar sobre un plano que el resto del sitio
 * presenta como calco.
 *
 * Toda la capa es decorativa — `aria-hidden` y sin eventos de puntero — así
 * no compite por el foco ni por el click con los stands, que sí son
 * botones.
 */

/**
 * El calco ocupa 1200x865. El marco agrega vereda y calzada alrededor sin
 * tocar una sola coordenada de las zonas: solo corre el encuadre. La
 * proporción (1,38) es la misma que tenía el lienzo original.
 */
export const VENUE_VIEW_BOX = "-90 -70 1380 1000";

const CYAN = "var(--color-cyan)";
/**
 * El lienzo del mapa es siempre oscuro (#070b1e), incluso en tema claro,
 * donde --color-paper y --color-line invierten valores. Por eso acá van
 * blancos literales y no tokens: un token invertido quedaría invisible.
 */
const EDGE = "rgba(255,255,255,0.14)";
const EDGE_SOFT = "rgba(255,255,255,0.07)";
const ASPHALT = "rgba(255,255,255,0.075)";
const MARKING = "rgba(255,255,255,0.20)";
const LABEL = "rgba(245,241,232,0.42)";
const LABEL_STRONG = "rgba(245,241,232,0.66)";

const MONO = { fontFamily: "var(--font-mono)" } as const;

/** Borde del predio, calcado a ojo del contorno exterior del CAD. */
const PARCEL =
  "96,6 1048,6 1048,296 1204,392 1204,706 1010,794 792,802 768,858 284,858 238,794 120,794 120,652 8,652 8,556 96,296";

/** Arbolado: el borde oeste sigue la diagonal del cerco, como en el CAD. */
const TREES: [number, number][] = [
  [102, 322],
  [88, 362],
  [75, 402],
  [61, 442],
  [48, 482],
  [34, 522],
  [148, 690],
  [196, 636],
  [262, 676],
  [312, 676],
  [1214, 372],
  [1214, 432],
  [1214, 664],
];

/** Manzanas linderas, en el suelo que queda fuera del cerco. */
const NEIGHBOURS: [number, number, number, number][] = [
  [-16, 40, 100, 172],
  [16, 232, 76, 68],
  [0, 662, 112, 206],
];

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill="rgba(45,227,214,0.07)" stroke="rgba(45,227,214,0.30)" strokeWidth={1.2} />
      <circle cx={x} cy={y} r={2.4} fill="rgba(45,227,214,0.42)" />
    </g>
  );
}

/** Flecha maciza de ingreso. `angle` en grados: 0 apunta al este. */
function AccessArrow({
  x,
  y,
  angle = 0,
  scale = 1,
}: {
  x: number;
  y: number;
  angle?: number;
  scale?: number;
}) {
  return (
    <path
      d="M -10 -11 L 8 0 L -10 11 L -5 0 Z"
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}
      fill={CYAN}
      opacity={0.9}
    />
  );
}

/** Calzada: asfalto, cordones y eje partido para dejar lugar al rótulo. */
function Street({
  x,
  y,
  width,
  height,
  dashes,
  vertical = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Tramos del eje central, en coordenadas del sentido largo de la calle. */
  dashes: [number, number][];
  vertical?: boolean;
}) {
  const mid = vertical ? x + width / 2 : y + height / 2;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={ASPHALT} />
      <line
        x1={x}
        y1={y}
        x2={vertical ? x : x + width}
        y2={vertical ? y + height : y}
        stroke={EDGE}
        strokeWidth={1.2}
      />
      <line
        x1={vertical ? x + width : x}
        y1={vertical ? y : y + height}
        x2={x + width}
        y2={y + height}
        stroke={EDGE}
        strokeWidth={1.2}
      />
      {dashes.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={vertical ? mid : from}
          y1={vertical ? from : mid}
          x2={vertical ? mid : to}
          y2={vertical ? to : mid}
          stroke={MARKING}
          strokeWidth={1.6}
          strokeDasharray="16 14"
        />
      ))}
    </g>
  );
}

/** Senda peatonal: las bandas blancas de una cebra. */
function Crosswalk({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const bars = 5;
  const step = width / (bars * 2 - 1);
  return (
    <g>
      {Array.from({ length: bars }, (_, i) => (
        <rect key={i} x={x + i * step * 2} y={y} width={step} height={height} fill="rgba(255,255,255,0.22)" />
      ))}
    </g>
  );
}

/** Recuadro punteado que agrupa un sector del predio. */
function SectorOutline({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={12}
      fill="none"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth={1.2}
      strokeDasharray="12 9"
    />
  );
}

export function VenueContext({ drawn }: { drawn: boolean }) {
  const t = useTranslations("InteractiveMap.context");

  return (
    <g
      aria-hidden="true"
      style={{
        pointerEvents: "none",
        // Aparece con el marco del lienzo, antes de que se tracen los
        // stands: primero el terreno, después lo que se planta encima.
        opacity: drawn ? 1 : "var(--map-box-border, 0)",
      }}
    >
      <defs>
        <pattern id="venue-ctx-grid" width={40} height={40} patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        </pattern>
        <pattern
          id="venue-ctx-hatch"
          width={9}
          height={9}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1={0} y1={0} x2={0} y2={9} stroke="rgba(255,255,255,0.09)" strokeWidth={1.4} />
        </pattern>
      </defs>

      {/* ── Manzanas linderas: lo que rodea al predio ─────────────────── */}
      {NEIGHBOURS.map(([x, y, w, h]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.03)" />
          <rect x={x} y={y} width={w} height={h} fill="url(#venue-ctx-hatch)" />
          <rect x={x} y={y} width={w} height={h} fill="none" stroke={EDGE_SOFT} strokeWidth={1.2} />
        </g>
      ))}

      {/* ── Calles colindantes ────────────────────────────────────────── */}
      <Street
        x={-90}
        y={-66}
        width={1380}
        height={42}
        dashes={[
          [-90, 420],
          [700, 1290],
        ]}
      />
      <Street
        x={-90}
        y={884}
        width={1380}
        height={42}
        dashes={[
          [-90, 480],
          [720, 1290],
        ]}
      />
      <Street
        x={-84}
        y={-70}
        width={42}
        height={1000}
        vertical
        dashes={[
          [-70, 200],
          [465, 930],
        ]}
      />
      <Street
        x={1226}
        y={-70}
        width={42}
        height={1000}
        vertical
        dashes={[
          [-70, 290],
          [570, 930],
        ]}
      />

      <g
        className="max-sm:hidden"
        style={MONO}
        fill={LABEL}
        fontSize={18}
        letterSpacing={1.5}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        <text x={560} y={-45}>
          {t("streetNorth")}
        </text>
        <text x={600} y={905}>
          {t("streetSouth")}
        </text>
        <text x={-63} y={330} transform="rotate(-90 -63 330)">
          {t("streetWest")}
        </text>
        <text x={1247} y={430} transform="rotate(-90 1247 430)">
          {t("streetEast")}
        </text>
      </g>

      {/* ── Terreno del predio ────────────────────────────────────────── */}
      <polygon points={PARCEL} fill="rgba(255,255,255,0.022)" />
      <polygon points={PARCEL} fill="url(#venue-ctx-grid)" opacity={0.55} />
      <polygon points={PARCEL} fill="none" stroke="rgba(45,227,214,0.45)" strokeWidth={2} strokeLinejoin="round" />

      {/* ── Estacionamiento, al noreste, fuera del cerco ───────────────── */}
      <g>
        <rect x={1064} y={10} width={140} height={260} fill="rgba(255,255,255,0.035)" stroke={EDGE} strokeWidth={1.2} />
        <line x1={1134} y1={38} x2={1134} y2={264} stroke={EDGE_SOFT} strokeWidth={1.2} />
        {Array.from({ length: 9 }, (_, i) => 62 + i * 23).map((y) => (
          <g key={y}>
            <line x1={1066} y1={y} x2={1132} y2={y} stroke={EDGE_SOFT} strokeWidth={1} />
            <line x1={1136} y1={y} x2={1202} y2={y} stroke={EDGE_SOFT} strokeWidth={1} />
          </g>
        ))}
        {/* Boca de entrada de autos desde la calle del este. */}
        <rect x={1204} y={118} width={24} height={54} fill={ASPHALT} />
        <text
          x={1134}
          y={26}
          className="max-sm:hidden"
          style={MONO}
          fill={LABEL_STRONG}
          fontSize={15}
          letterSpacing={1.2}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {t("parking")}
        </text>
      </g>

      {/* ── Pabellón: techo y estructura, para que no sea un rectángulo ── */}
      <g>
        <rect x={380} y={17} width={660} height={353} fill="rgba(255,255,255,0.028)" />
        {Array.from({ length: 11 }, (_, i) => 392 + i * 64).map((x) => (
          <line key={x} x1={x} y1={19} x2={x} y2={368} stroke="rgba(255,255,255,0.035)" strokeWidth={1} />
        ))}
        <line x1={382} y1={86} x2={1038} y2={86} stroke="rgba(255,255,255,0.035)" strokeWidth={1} />
        <line x1={382} y1={370} x2={1038} y2={370} stroke="rgba(255,255,255,0.09)" strokeWidth={1.4} />
      </g>

      {/* ── Circulación interna: el eje que baja del acceso y el paseo
           que corre frente al pabellón ─────────────────────────────── */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M 16 610 L 116 610 L 156 646 L 772 648 L 862 664 L 946 640"
          stroke="rgba(45,227,214,0.09)"
          strokeWidth={28}
        />
        <path
          d="M 16 610 L 116 610 L 156 646 L 772 648 L 862 664 L 946 640"
          stroke="rgba(45,227,214,0.30)"
          strokeWidth={1.4}
          strokeDasharray="14 12"
        />
        <path d="M 396 492 L 560 488 L 890 470" stroke="rgba(45,227,214,0.07)" strokeWidth={22} />
        <path
          d="M 396 492 L 560 488 L 890 470"
          stroke="rgba(45,227,214,0.24)"
          strokeWidth={1.2}
          strokeDasharray="12 10"
        />
      </g>

      {/* ── Delimitación de sectores ──────────────────────────────────── */}
      <SectorOutline x={372} y={10} width={680} height={366} />
      <SectorOutline x={104} y={16} width={236} height={290} />
      <SectorOutline x={288} y={662} width={478} height={192} />
      <SectorOutline x={880} y={366} width={316} height={330} />

      <g
        className="max-sm:hidden"
        style={MONO}
        fill={LABEL_STRONG}
        fontSize={22}
        letterSpacing={2}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        <text x={221} y={-9}>
          {t("sectorInstitutional")}
        </text>
        <text x={710} y={-9}>
          {t("sectorPavilion")}
        </text>
        <text x={525} y={871}>
          {t("sectorFood")}
        </text>
        <text x={1215} y={530} fontSize={20} transform="rotate(-90 1215 530)">
          {t("sectorServices")}
        </text>
        <text x={-16} y={400} fontSize={20} transform="rotate(-90 -16 400)">
          {t("sectorOutdoor")}
        </text>
      </g>

      {/* ── Accesos ───────────────────────────────────────────────────── */}
      <g>
        {/* Principal y peatonal, por el oeste: calzada, cebra y flecha. */}
        <rect x={-42} y={578} width={50} height={62} fill={ASPHALT} />
        <Crosswalk x={-34} y={582} width={34} height={54} />
        <AccessArrow x={132} y={608} scale={1.5} />
        <text
          x={64}
          y={552}
          className="max-sm:hidden"
          style={MONO}
          fill={CYAN}
          fontSize={16}
          letterSpacing={1.2}
          textAnchor="middle"
        >
          {t("accessMain")}
        </text>

        {/* Vehicular, por el noreste, desde el estacionamiento. */}
        <AccessArrow x={1062} y={288} angle={180} scale={1.2} />
        <text
          x={1084}
          y={288}
          className="max-sm:hidden"
          style={MONO}
          fill={CYAN}
          fontSize={14}
          letterSpacing={1.2}
          dominantBaseline="middle"
        >
          {t("accessVehicle")}
        </text>

        {/* Ingresos al pabellón: dos por el oeste, tres por el sur. */}
        <AccessArrow x={360} y={210} />
        <AccessArrow x={360} y={300} />
        <AccessArrow x={525} y={392} angle={-90} />
        <AccessArrow x={660} y={392} angle={-90} />
        <AccessArrow x={855} y={392} angle={-90} />

        {/* Salida de emergencia: la escalera del ángulo noroeste del CAD. */}
        <rect x={336} y={58} width={36} height={58} fill="url(#venue-ctx-hatch)" stroke={EDGE_SOFT} strokeWidth={1} />
        <AccessArrow x={354} y={42} angle={-90} scale={0.8} />
      </g>

      {TREES.map(([x, y]) => (
        <Tree key={`${x}-${y}`} x={x} y={y} />
      ))}

      {/* ── Norte y escala gráfica ────────────────────────────────────── */}
      <g className="max-sm:hidden">
        <circle cx={1152} cy={800} r={22} fill="none" stroke={EDGE} strokeWidth={1.2} />
        <path d="M 1152 782 L 1158 802 L 1152 798 L 1146 802 Z" fill={CYAN} opacity={0.85} />
        <text x={1152} y={766} style={MONO} fill={LABEL_STRONG} fontSize={16} textAnchor="middle">
          {t("north")}
        </text>
      </g>
      <g className="max-sm:hidden">
        {/* 6,8 px por metro: la cota de D28 en el CAD son 15,00 m y mide 95 px. */}
        <rect x={986} y={848} width={68} height={8} fill="rgba(255,255,255,0.30)" />
        <rect x={1054} y={848} width={68} height={8} fill="rgba(255,255,255,0.08)" />
        <rect x={986} y={848} width={136} height={8} fill="none" stroke={EDGE} strokeWidth={1} />
        <text x={986} y={838} style={MONO} fill={LABEL} fontSize={14} textAnchor="middle">
          0
        </text>
        <text x={1122} y={838} style={MONO} fill={LABEL} fontSize={14} textAnchor="middle">
          {t("scale")}
        </text>
      </g>
    </g>
  );
}
