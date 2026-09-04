export type NewsId =
  | "sede-confirmada"
  | "lanzamiento-oficial"
  | "sadir-convocatoria"
  | "sitio-mapa";

export interface NewsItem {
  id: NewsId;
  date: string;
  href: string;
  source: string;
}

/**
 * Reseña de coberturas de prensa reales sobre el anuncio de esta edición
 * (con enlace a la nota original) más las novedades propias del
 * desarrollo de este sitio — no son gacetillas inventadas para el
 * prototipo. `tag`/`title`/`excerpt` viven en el diccionario
 * (`News.items.<id>`) para poder traducirse; `date`/`source`/`href` son
 * datos de la fuente real y no se traducen.
 */
export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "sede-confirmada",
    date: "Mayo 2026",
    href: "https://www.pregon.com.ar/nota/29966/2026/05/ciudad-cultural-albergara-la-nueva-edicion-de-la-expojuy",
    source: "Diario Pregón",
  },
  {
    id: "lanzamiento-oficial",
    date: "Agosto 2026",
    href: "https://www.jujuyalmomento.com/expojuy/lanzaron-la-expojuy-2026-enfoque-el-comercio-internacional-y-el-corredor-bioceanico-n202133",
    source: "Jujuy al Momento",
  },
  {
    id: "sadir-convocatoria",
    date: "Agosto 2026",
    href: "https://www.periodicolea.com.ar/2026/08/14/carlos-sadir-destaco-el-perfil-comercial-de-la-expojuy-2026-y-convoco-a-empresas-jujenas/",
    source: "Periódico LEA",
  },
  {
    id: "sitio-mapa",
    date: "Septiembre 2026",
    href: "#mapa",
    source: "ExpoJuy 2026",
  },
];
