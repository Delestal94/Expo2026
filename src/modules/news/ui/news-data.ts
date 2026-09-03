export interface NewsItem {
  id: string;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  href: string;
  source: string;
}

/**
 * Reseña de coberturas de prensa reales sobre el anuncio de esta edición
 * (con enlace a la nota original) más las novedades propias del desarrollo
 * de este sitio — no son gacetillas inventadas para el prototipo.
 */
export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "sede-confirmada",
    date: "Mayo 2026",
    tag: "Organización",
    title: "Ciudad Cultural, confirmada como sede de la edición 2026",
    excerpt:
      "La 17ª edición de ExpoJuy se realizará del 9 al 12 de octubre, consolidando el nuevo formato de cuatro días con rondas de negocios por la mañana y expo por la tarde.",
    href: "https://www.pregon.com.ar/nota/29966/2026/05/ciudad-cultural-albergara-la-nueva-edicion-de-la-expojuy",
    source: "Diario Pregón",
  },
  {
    id: "lanzamiento-oficial",
    date: "Agosto 2026",
    tag: "Corredor Bioceánico",
    title: "Lanzamiento oficial: el foco pasa al comercio internacional",
    excerpt:
      "La organización presentó la edición 2026 con eje en el Corredor Bioceánico de Capricornio, con delegaciones esperadas de Chile, Paraguay y Brasil.",
    href: "https://www.jujuyalmomento.com/expojuy/lanzaron-la-expojuy-2026-enfoque-el-comercio-internacional-y-el-corredor-bioceanico-n202133",
    source: "Jujuy al Momento",
  },
  {
    id: "sadir-convocatoria",
    date: "Agosto 2026",
    tag: "Convocatoria",
    title: "El Gobernador convocó a las empresas jujeñas a sumarse",
    excerpt:
      "Carlos Sadir destacó el perfil comercial de esta edición y llamó a las empresas de la provincia a participar de las rondas de negocios internacionales.",
    href: "https://www.periodicolea.com.ar/2026/08/14/carlos-sadir-destaco-el-perfil-comercial-de-la-expojuy-2026-y-convoco-a-empresas-jujenas/",
    source: "Periódico LEA",
  },
  {
    id: "sitio-mapa",
    date: "Septiembre 2026",
    tag: "Sitio oficial",
    title: "El sitio suma un plano interactivo de todo el predio",
    excerpt:
      "Ya podés recorrer Ciudad Cultural stand por stand desde la sección Mapa, con más de 200 espacios ubicados y filtrables por rubro.",
    href: "#mapa",
    source: "ExpoJuy 2026",
  },
];
