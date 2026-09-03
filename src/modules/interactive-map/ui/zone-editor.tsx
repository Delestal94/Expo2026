"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import { CATEGORIES, VENUE_PLAN, categoryMeta, polygonPoints } from "./venue-plan";
import type { Category, VenueZone, ZoneShape } from "./venue-plan";

// El lienzo usa las mismas dimensiones que el plano simplificado 2024
// (1200x850), así las coordenadas del calco se leen 1:1 y nada se deforma.
const VIEW_W = 1200;
const VIEW_H = 850;
const MIN_SIZE = 20;
const CREATE_THRESHOLD = 8;
const STORAGE_KEY = "expojuy:mapa-editor:zones:v1";
const REFERENCE_KEY = "expojuy:mapa-editor:referencia:v1";

function makeId() {
  return `zona-${Math.random().toString(36).slice(2, 9)}`;
}

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type Handle = (typeof HANDLES)[number];

function handlePoint(z: VenueZone, handle: Handle) {
  const midX = z.x + z.width / 2;
  const midY = z.y + z.height / 2;
  const map: Record<Handle, { x: number; y: number }> = {
    nw: { x: z.x, y: z.y },
    n: { x: midX, y: z.y },
    ne: { x: z.x + z.width, y: z.y },
    e: { x: z.x + z.width, y: midY },
    se: { x: z.x + z.width, y: z.y + z.height },
    s: { x: midX, y: z.y + z.height },
    sw: { x: z.x, y: z.y + z.height },
    w: { x: z.x, y: midY },
  };
  return map[handle];
}

/** Proyecta un punto del lienzo al espacio local (sin rotación) de la zona,
 * rotando alrededor de su centro — así el resize funciona igual estén o no
 * rotadas (necesario para el patrón de espina de pescado, rotado 45°). */
function toLocalPoint(zone: VenueZone, px: number, py: number) {
  if (!zone.rotation) return { x: px, y: py };
  const cx = zone.x + zone.width / 2;
  const cy = zone.y + zone.height / 2;
  const rad = (-zone.rotation * Math.PI) / 180;
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: cy + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

function computeResize(handle: Handle, origin: VenueZone, px: number, py: number) {
  const { x: lx, y: ly } = toLocalPoint(origin, px, py);
  let { x, y, width, height } = origin;
  const right = origin.x + origin.width;
  const bottom = origin.y + origin.height;
  if (handle.includes("w")) {
    x = Math.min(lx, right - MIN_SIZE);
    width = right - x;
  }
  if (handle.includes("e")) {
    width = Math.max(MIN_SIZE, lx - origin.x);
  }
  if (handle.includes("n")) {
    y = Math.min(ly, bottom - MIN_SIZE);
    height = bottom - y;
  }
  if (handle.includes("s")) {
    height = Math.max(MIN_SIZE, ly - origin.y);
  }
  return { x, y, width, height };
}

type DragState =
  | { kind: "move"; id: string; offsetX: number; offsetY: number }
  | { kind: "resize"; id: string; handle: Handle; origin: VenueZone }
  | { kind: "create" };

interface DraftRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ZoneEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const createStart = useRef<{ x: number; y: number } | null>(null);

  const [zones, setZones] = useState<VenueZone[]>(() => {
    if (typeof window === "undefined") return VENUE_PLAN;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : VENUE_PLAN;
    } catch {
      return VENUE_PLAN;
    }
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("descubierto");
  const [draft, setDraft] = useState<DraftRect | null>(null);
  // Imagen del plano CAD para calcar encima. Se guarda aparte de las zonas
  // porque pesa mucho más y conviene poder borrarla sin tocar el layout.
  const [reference, setReference] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(REFERENCE_KEY);
    } catch {
      return null;
    }
  });
  const [referenceOpacity, setReferenceOpacity] = useState(45);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
    } catch {
      // sin espacio o storage bloqueado — la edición sigue funcionando en memoria.
    }
  }, [zones]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing = target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (typing) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        setZones((prev) => prev.filter((z) => z.id !== selectedId));
        setSelectedId(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const toSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * VIEW_W,
      y: ((clientY - rect.top) / rect.height) * VIEW_H,
    };
  };

  const updateZone = (id: string, patch: Partial<VenueZone>) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...patch } : z)));
  };

  const addZone = (category: Category, x: number, y: number, width: number, height: number) => {
    const meta = categoryMeta(category);
    const zone: VenueZone = {
      id: makeId(),
      label: `Nuevo ${meta.label.toLowerCase()}`,
      category,
      shape: "rect",
      rotation: 0,
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(Math.max(MIN_SIZE, width)),
      height: Math.round(Math.max(MIN_SIZE, height)),
      areaM2: null,
      notes: "",
    };
    setZones((prev) => [...prev, zone]);
    setSelectedId(zone.id);
  };

  const quickAdd = (category: Category) => {
    setActiveCategory(category);
    addZone(category, 40, 40, 100, 70);
  };

  const handleBackgroundPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.target !== e.currentTarget) return;
    const { x, y } = toSvgPoint(e.clientX, e.clientY);
    createStart.current = { x, y };
    dragRef.current = { kind: "create" };
    setSelectedId(null);
    setDraft({ x, y, width: 0, height: 0 });
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handleZonePointerDown = (e: ReactPointerEvent<SVGGElement>, zone: VenueZone) => {
    e.stopPropagation();
    const { x, y } = toSvgPoint(e.clientX, e.clientY);
    setSelectedId(zone.id);
    dragRef.current = { kind: "move", id: zone.id, offsetX: x - zone.x, offsetY: y - zone.y };
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handleHandlePointerDown = (
    e: ReactPointerEvent<SVGRectElement>,
    zone: VenueZone,
    handle: Handle,
  ) => {
    e.stopPropagation();
    dragRef.current = { kind: "resize", id: zone.id, handle, origin: zone };
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const { x, y } = toSvgPoint(e.clientX, e.clientY);

    if (drag.kind === "create" && createStart.current) {
      const sx = createStart.current.x;
      const sy = createStart.current.y;
      setDraft({
        x: Math.min(sx, x),
        y: Math.min(sy, y),
        width: Math.abs(x - sx),
        height: Math.abs(y - sy),
      });
      return;
    }

    if (drag.kind === "move") {
      const nextX = Math.max(0, Math.min(VIEW_W - MIN_SIZE, x - drag.offsetX));
      const nextY = Math.max(0, Math.min(VIEW_H - MIN_SIZE, y - drag.offsetY));
      updateZone(drag.id, { x: nextX, y: nextY });
      return;
    }

    if (drag.kind === "resize") {
      const patch = computeResize(drag.handle, drag.origin, x, y);
      updateZone(drag.id, patch);
    }
  };

  const handlePointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (drag?.kind === "create" && draft) {
      if (draft.width > CREATE_THRESHOLD && draft.height > CREATE_THRESHOLD) {
        addZone(activeCategory, draft.x, draft.y, draft.width, draft.height);
      }
    }
    dragRef.current = null;
    createStart.current = null;
    setDraft(null);
    if (svgRef.current?.hasPointerCapture(e.pointerId)) {
      svgRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(zones, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zones.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error("El archivo no contiene una lista de zonas.");
        setZones(parsed);
        setSelectedId(null);
      })
      .catch(() => {
        window.alert("No se pudo importar el archivo — verificá que sea un JSON exportado desde este editor.");
      })
      .finally(() => {
        e.target.value = "";
      });
  };

  const handleReferenceUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setReference(dataUrl);
      try {
        localStorage.setItem(REFERENCE_KEY, dataUrl);
      } catch {
        // Una imagen grande puede no entrar en localStorage: se sigue viendo
        // en esta sesión, pero no sobrevive al recargar.
        window.alert(
          "La imagen se cargó, pero es muy grande para guardarla en este navegador: al recargar la página vas a tener que volver a subirla.",
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleReferenceRemove = () => {
    setReference(null);
    try {
      localStorage.removeItem(REFERENCE_KEY);
    } catch {
      // nada que hacer: igual queda fuera del estado en memoria.
    }
  };

  const handleRestoreBase = () => {
    if (window.confirm("Esto descarta tus cambios y vuelve al plano base 2024. ¿Continuar?")) {
      setZones(VENUE_PLAN.map((z) => ({ ...z })));
      setSelectedId(null);
    }
  };

  const handleClearAll = () => {
    if (zones.length === 0) return;
    if (window.confirm(`Esto borra las ${zones.length} zonas actuales (sin restaurar el plano base). ¿Continuar?`)) {
      setZones([]);
      setSelectedId(null);
    }
  };

  const selected = zones.find((z) => z.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-[#121022] p-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => quickAdd(cat.id)}
            onDoubleClick={() => setActiveCategory(cat.id)}
            title={`Click: agregar zona ${cat.label.toLowerCase()}. Doble click: usar esta categoría al dibujar.`}
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition"
            style={{
              borderColor: activeCategory === cat.id ? cat.color : "var(--color-line)",
              color: activeCategory === cat.id ? "var(--color-paper)" : "var(--color-paper-dim)",
            }}
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
            + {cat.label}
          </button>
        ))}
        <span className="mx-2 h-5 w-px bg-line" aria-hidden="true" />
        <button
          type="button"
          onClick={handleExport}
          className="rounded-full bg-accent px-3 py-1.5 font-mono text-xs font-semibold text-ink"
        >
          Exportar JSON
        </button>
        <label className="cursor-pointer rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper hover:border-paper-dim">
          Importar JSON
          <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </label>
        <button
          type="button"
          onClick={handleRestoreBase}
          className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper-dim hover:border-paper-dim"
        >
          Restaurar plano base 2024
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper-dim hover:border-paper-dim"
        >
          Vaciar todo
        </button>
        <span className="mx-2 h-5 w-px bg-line" aria-hidden="true" />
        {reference ? (
          <>
            <label className="flex items-center gap-2 font-mono text-xs text-paper-dim">
              Plano de fondo
              <input
                type="range"
                min={0}
                max={100}
                value={referenceOpacity}
                onChange={(e) => setReferenceOpacity(Number(e.target.value))}
                className="w-24"
                aria-label="Opacidad del plano de referencia"
              />
              <span className="tabular-nums">{referenceOpacity}%</span>
            </label>
            <button
              type="button"
              onClick={handleReferenceRemove}
              className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper-dim hover:border-paper-dim"
            >
              Quitar plano
            </button>
          </>
        ) : (
          <label
            className="cursor-pointer rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper hover:border-paper-dim"
            title="Subí la imagen del plano CAD para calcar las zonas encima"
          >
            Plano de fondo
            <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
          </label>
        )}
        <span className="ml-auto font-mono text-xs text-paper-dim">{zones.length} zonas</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-line bg-[#121022] p-2">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full touch-none select-none"
            style={{ cursor: draft ? "crosshair" : "default" }}
            onPointerDown={handleBackgroundPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <rect
              x={0}
              y={0}
              width={VIEW_W}
              height={VIEW_H}
              fill="rgba(255,255,255,0.02)"
              style={{ pointerEvents: "none" }}
            />
            {reference && (
              // El plano de referencia va detrás de todo y no recibe clics, así
              // que se puede calcar encima sin que interfiera con la edición.
              <image
                href={reference}
                x={0}
                y={0}
                width={VIEW_W}
                height={VIEW_H}
                preserveAspectRatio="xMidYMid meet"
                opacity={referenceOpacity / 100}
                style={{ pointerEvents: "none" }}
              />
            )}
            {zones.map((zone) => {
              const meta = categoryMeta(zone.category);
              const isSelected = zone.id === selectedId;
              const cx = zone.x + zone.width / 2;
              const cy = zone.y + zone.height / 2;
              const rotate =
                zone.shape !== "circle" && zone.rotation
                  ? `rotate(${zone.rotation} ${cx} ${cy})`
                  : undefined;
              const shapeStyle = {
                fill: isSelected ? meta.color : "rgba(255,255,255,0.06)",
                stroke: meta.color,
                strokeWidth: isSelected ? 2.5 : 1.5,
                opacity: isSelected ? 0.85 : 0.6,
              };
              return (
                <g
                  key={zone.id}
                  transform={rotate}
                  onPointerDown={(e) => handleZonePointerDown(e, zone)}
                  style={{ cursor: "move" }}
                >
                  {zone.shape === "circle" ? (
                    <ellipse cx={cx} cy={cy} rx={zone.width / 2} ry={zone.height / 2} style={shapeStyle} />
                  ) : zone.shape === "polygon" && zone.points?.length ? (
                    <polygon points={polygonPoints(zone)} style={shapeStyle} />
                  ) : (
                    <rect x={zone.x} y={zone.y} width={zone.width} height={zone.height} rx={6} style={shapeStyle} />
                  )}
                  {(() => {
                    // En el plano conviven stands de 20px con sectores de 300px.
                    // Los stands llevan el código centrado; los sectores grandes
                    // (pabellón, camino, patio) lo llevan arriba a la izquierda,
                    // como un título, para no taparse con lo que contienen.
                    if (zone.width < 14 || zone.height < 10) return null;
                    const isContainer = zone.width > 120 || zone.height > 90;
                    const fontSize = isContainer
                      ? 11
                      : Math.max(6, Math.min(11, Math.round(zone.width / 3.4)));
                    const usableWidth = isContainer ? zone.width - 12 : zone.width;
                    const maxChars = Math.max(2, Math.floor(usableWidth / (fontSize * 0.62)));
                    const text =
                      zone.label.length > maxChars ? `${zone.label.slice(0, maxChars - 1)}…` : zone.label;
                    const tx = isContainer ? zone.x + 6 : cx;
                    const ty = isContainer ? zone.y + 14 : cy;
                    return (
                      <text
                        x={tx}
                        y={ty}
                        // Contrarrota la etiqueta para que se lea horizontal aunque
                        // el stand esté rotado, como los códigos del plano.
                        transform={zone.rotation ? `rotate(${-zone.rotation} ${cx} ${cy})` : undefined}
                        textAnchor={isContainer ? "start" : "middle"}
                        dominantBaseline={isContainer ? "auto" : "central"}
                        fill={isSelected ? "var(--color-ink)" : "var(--color-paper)"}
                        fontFamily="var(--font-mono)"
                        fontSize={fontSize}
                        style={{ pointerEvents: "none" }}
                      >
                        {text}
                      </text>
                    );
                  })()}
                  {isSelected &&
                    HANDLES.map((handle) => {
                      const p = handlePoint(zone, handle);
                      const cursorMap: Record<Handle, string> = {
                        nw: "nwse-resize",
                        se: "nwse-resize",
                        ne: "nesw-resize",
                        sw: "nesw-resize",
                        n: "ns-resize",
                        s: "ns-resize",
                        e: "ew-resize",
                        w: "ew-resize",
                      };
                      return (
                        <rect
                          key={handle}
                          x={p.x - 5}
                          y={p.y - 5}
                          width={10}
                          height={10}
                          fill="var(--color-paper)"
                          stroke="var(--color-ink)"
                          strokeWidth={1}
                          style={{ cursor: cursorMap[handle] }}
                          onPointerDown={(e) => handleHandlePointerDown(e, zone, handle)}
                        />
                      );
                    })}
                </g>
              );
            })}
            {draft && (
              <rect
                x={draft.x}
                y={draft.y}
                width={draft.width}
                height={draft.height}
                fill="rgba(255,255,255,0.08)"
                stroke="var(--color-paper)"
                strokeDasharray="6 4"
                strokeWidth={1.5}
              />
            )}
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-[#121022] p-4">
            {selected ? (
              <ZoneForm
                key={selected.id}
                zone={selected}
                onChange={(patch) => updateZone(selected.id, patch)}
                onDelete={() => {
                  setZones((prev) => prev.filter((z) => z.id !== selected.id));
                  setSelectedId(null);
                }}
              />
            ) : (
              <p className="text-sm text-paper-dim">
                Arrastrá sobre el lienzo para crear una zona, o click en una zona existente para
                editarla. Usá los botones de arriba para agregar zonas de una categoría exacta.
              </p>
            )}
          </div>

          {zones.length > 0 && (
            <div className="max-h-80 overflow-y-auto rounded-2xl border border-line bg-[#121022] p-4">
              <span className="font-mono text-xs tracking-[0.2em] text-paper-dim uppercase">
                Todas las zonas
              </span>
              <ul className="mt-3 flex flex-col gap-1">
                {zones.map((zone) => {
                  const meta = categoryMeta(zone.category);
                  return (
                    <li key={zone.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(zone.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white/5"
                        style={{
                          backgroundColor: zone.id === selectedId ? "rgba(255,255,255,0.08)" : undefined,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span className="truncate text-paper">{zone.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ZoneForm({
  zone,
  onChange,
  onDelete,
}: {
  zone: VenueZone;
  onChange: (patch: Partial<VenueZone>) => void;
  onDelete: () => void;
}) {
  const inputClass =
    "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-paper-dim focus:outline-none";
  const labelClass = "font-mono text-[0.65rem] tracking-[0.15em] text-paper-dim uppercase";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className={labelClass} htmlFor="zone-label">
          Nombre
        </label>
        <input
          id="zone-label"
          type="text"
          value={zone.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className={`${inputClass} mt-1`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="zone-category">
          Categoría
        </label>
        <select
          id="zone-category"
          value={zone.category}
          onChange={(e) => onChange({ category: e.target.value as Category })}
          className={`${inputClass} mt-1`}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="zone-shape">
            Forma
          </label>
          <select
            id="zone-shape"
            value={zone.shape}
            onChange={(e) => onChange({ shape: e.target.value as ZoneShape })}
            className={`${inputClass} mt-1`}
          >
            <option value="rect">Rectángulo</option>
            <option value="circle">Círculo / óvalo</option>
            <option value="polygon">Polígono</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="zone-rotation">
            Rotación (°)
          </label>
          <input
            id="zone-rotation"
            type="number"
            disabled={zone.shape === "circle"}
            value={zone.rotation}
            onChange={(e) => onChange({ rotation: Number(e.target.value) })}
            className={`${inputClass} mt-1 disabled:opacity-40`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="zone-x">
            X
          </label>
          <input
            id="zone-x"
            type="number"
            value={Math.round(zone.x)}
            onChange={(e) => onChange({ x: Number(e.target.value) })}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="zone-y">
            Y
          </label>
          <input
            id="zone-y"
            type="number"
            value={Math.round(zone.y)}
            onChange={(e) => onChange({ y: Number(e.target.value) })}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="zone-width">
            Ancho
          </label>
          <input
            id="zone-width"
            type="number"
            value={Math.round(zone.width)}
            onChange={(e) => onChange({ width: Math.max(MIN_SIZE, Number(e.target.value)) })}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="zone-height">
            Alto
          </label>
          <input
            id="zone-height"
            type="number"
            value={Math.round(zone.height)}
            onChange={(e) => onChange({ height: Math.max(MIN_SIZE, Number(e.target.value)) })}
            className={`${inputClass} mt-1`}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="zone-area">
          Superficie (m²)
        </label>
        <input
          id="zone-area"
          type="number"
          value={zone.areaM2 ?? ""}
          onChange={(e) => onChange({ areaM2: e.target.value === "" ? null : Number(e.target.value) })}
          className={`${inputClass} mt-1`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="zone-notes">
          Notas
        </label>
        <textarea
          id="zone-notes"
          value={zone.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={2}
          className={`${inputClass} mt-1`}
        />
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="mt-1 rounded-full border border-line px-4 py-2 text-sm text-paper-dim transition hover:border-red-400/60 hover:text-red-300"
      >
        Eliminar zona
      </button>
    </div>
  );
}
