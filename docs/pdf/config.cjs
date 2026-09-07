/**
 * Configuración de md-to-pdf para la memoria descriptiva.
 *
 * Va en un archivo y no como flags del script de npm porque las opciones
 * llevan JSON con HTML adentro (el pie de página): entre las comillas de la
 * shell, las de JSON y las del atributo `style`, la versión en una línea se
 * rompía en cuanto alguien la tocaba.
 */
module.exports = {
  stylesheet: ["docs/pdf/memoria.css"],
  pdf_options: {
    format: "A4",
    margin: { top: "18mm", bottom: "20mm", left: "18mm", right: "18mm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `
      <div style="width:100%;font-size:8pt;color:#55516b;padding:0 18mm;display:flex;justify-content:space-between;">
        <span>Memoria descriptiva &middot; Desaf&iacute;o Digital ExpoJuy 2026</span>
        <span class="pageNumber"></span>
      </div>`,
  },
  // El markdown tiene tablas y saltos dentro de celdas; sin esto el
  // renderizador los ignora y las tablas salen como texto corrido.
  marked_options: {
    gfm: true,
    breaks: false,
  },
};
