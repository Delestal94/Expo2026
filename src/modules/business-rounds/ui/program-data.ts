import { EVENT_DAYS } from "./agenda-data";

export interface ProgramActivity {
  time: string;
  title: string;
  tag: string;
}

export interface ProgramDay {
  date: string;
  dayKey: (typeof EVENT_DAYS)[number]["dayKey"];
  dayNumber: number;
  highlight?: "apertura" | "cierre";
  morningTitle: string;
  morningDescription: string;
  afternoonTitle: string;
  afternoonDescription: string;
  activities: ProgramActivity[];
}

export const PROGRAM_DAYS: ProgramDay[] = [
  {
    date: EVENT_DAYS[0]!.date,
    dayKey: EVENT_DAYS[0]!.dayKey,
    dayNumber: EVENT_DAYS[0]!.dayNumber,
    highlight: "apertura",
    morningTitle: "Rondas de negocios internacionales — Corredor Bioceánico",
    morningDescription:
      "Apertura institucional y mesas B2B focalizadas en la cadena de valor minera, proveedores de litio y acuerdos de integración logística internacional.",
    afternoonTitle:
      "Expo abierta en Ciudad Cultural — stands, minería, comercio exterior y economía del conocimiento",
    afternoonDescription:
      "Acto inaugural oficial con autoridades provinciales y de la región. Apertura de los pabellones feriales, stands institucionales y primera ronda de exposiciones técnicas.",
    activities: [
      { time: "09:00", title: "Acreditaciones y desayuno de trabajo empresarial", tag: "Networking" },
      { time: "10:30", title: "Mesas de negocio: Minería, litio y proveedores locales", tag: "B2B" },
      { time: "12:30", title: "Firma del primer memorando de entendimiento bilateral", tag: "Convenios" },
      { time: "15:00", title: "Corte de cinta y apertura de pabellones al público", tag: "Feria" },
      { time: "16:30", title: "Recorrida institucional por los stands provinciales", tag: "Institucional" },
      { time: "18:00", title: "Panel: Jujuy en el mercado global del litio", tag: "Conferencia" },
      { time: "20:00", title: "Brindis de bienvenida con delegaciones internacionales", tag: "Networking" },
    ],
  },
  {
    date: EVENT_DAYS[1]!.date,
    dayKey: EVENT_DAYS[1]!.dayKey,
    dayNumber: EVENT_DAYS[1]!.dayNumber,
    morningTitle: "Integración Logística del Corredor Bioceánico de Capricornio",
    morningDescription:
      "Encuentro de operadores de transporte, despachantes de aduana y cámaras binacionales (Chile, Argentina, Paraguay y Brasil). Ventajas competitivas del Paso de Jama.",
    afternoonTitle: "Muestra general y demostraciones técnicas en pista descubierta",
    afternoonDescription:
      "Exhibición de maquinaria pesada, vehículos industriales y equipos para minería en vivo. Patio gastronómico jujeño y actividades de vinculación comercial.",
    activities: [
      { time: "09:30", title: "Foro logístico: Conectividad portuaria Antofagasta-Santos", tag: "Comercio" },
      { time: "11:30", title: "Rondas comerciales para empresas de transporte y servicios", tag: "B2B" },
      { time: "16:00", title: "Demostración de maquinaria minera pesada en explanada", tag: "Demostración" },
      { time: "19:00", title: "Degustación de cocina andina y patio gastronómico", tag: "Cultura" },
    ],
  },
  {
    date: EVENT_DAYS[2]!.date,
    dayKey: EVENT_DAYS[2]!.dayKey,
    dayNumber: EVENT_DAYS[2]!.dayNumber,
    morningTitle: "Economía del Conocimiento y Tecnologías Aplicadas a la Producción",
    morningDescription:
      "Conferencias y vinculación con startups, biotecnología, agtech y soluciones de software para la industria minera y agroexportadora.",
    afternoonTitle: "Jornada cultural, diseño andino y paseo ferial para toda la comunidad",
    afternoonDescription:
      "Pabellón de artesanos y productores de la Puna, Quebrada, Valles y Yungas. Presentaciones artísticas en el escenario principal y actividades participativas.",
    activities: [
      { time: "10:00", title: "Pitching de startups jujeñas y proyectos de software", tag: "Tech" },
      { time: "11:45", title: "Mesa de financiamiento e inversión para innovación", tag: "Finanzas" },
      { time: "15:30", title: "Recorridos guiados por stands de artesanos y diseño", tag: "Artesanías" },
      { time: "19:30", title: "Presentaciones musicales en vivo en el escenario central", tag: "Espectáculo" },
    ],
  },
  {
    date: EVENT_DAYS[3]!.date,
    dayKey: EVENT_DAYS[3]!.dayKey,
    dayNumber: EVENT_DAYS[3]!.dayNumber,
    highlight: "cierre",
    morningTitle: "Conclusiones de rondas y firma de convenios comerciales",
    morningDescription:
      "Balance de acuerdos comerciales concretados, firma de cartas de intención entre delegaciones empresariales y balance de la Cámara de Comercio Exterior.",
    afternoonTitle: "Gran festival de clausura y premiación a los mejores stands",
    afternoonDescription:
      "Entrega de distinciones al diseño y sustentabilidad de stands. Festival musical de cierre con artistas invitados y despedida oficial de la 17ª edición.",
    activities: [
      { time: "10:00", title: "Firma de cartas de intención y balances bilaterales", tag: "Convenios" },
      { time: "11:30", title: "Conferencia de prensa de la Cámara de Comercio Exterior", tag: "Prensa" },
      { time: "17:00", title: "Entrega de distinciones y premios a expositores destacados", tag: "Premiación" },
      { time: "19:00", title: "Festival musical de cierre de ExpoJuy 2026", tag: "Cierre" },
    ],
  },
];
