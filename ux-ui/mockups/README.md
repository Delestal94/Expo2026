# Suite de mockups — ExpoJuy 2026

Maquetas estáticas navegables de seis pantallas del sitio. Son el **paso previo** a la construcción: acá se resolvió el lenguaje visual y la interacción antes de escribir el código de producción.

## ▶ Verlas sin instalar nada

**[expojuy2026.vercel.app/mockups/](https://expojuy2026.vercel.app/mockups/)**

Están servidas desde el sitio en vivo. También se pueden abrir localmente: cualquier archivo `.html` de esta carpeta funciona con doble clic, sin servidor ni build.

---

## Las pantallas

| # | Pantalla | Qué explora | Ver |
|---|---|---|---|
| — | **Portal de presentación** | Índice de la suite | [index.html](https://expojuy2026.vercel.app/mockups/index.html) |
| 01 | **Roadmap 2026** | Línea de tiempo del proyecto con cuenta regresiva en vivo y las 4 fases del desafío | [01-roadmap.html](https://expojuy2026.vercel.app/mockups/01-roadmap.html) |
| 02 | **Acceso y pase digital QR** | Formulario de acreditación, credencial QR y simulador del escáner de molinete | [02-acceso.html](https://expojuy2026.vercel.app/mockups/02-acceso.html) |
| 03 | **Rondas de negocios B2B** | Matching por país y rubro con score de compatibilidad, y calendario de slots bilaterales | [03-rondas-b2b.html](https://expojuy2026.vercel.app/mockups/03-rondas-b2b.html) |
| 04 | **Asistente IA concierge** | Conversación multilingüe acotada al contenido real del sitio | [04-asistente.html](https://expojuy2026.vercel.app/mockups/04-asistente.html) |
| 05 | **Memoria visual** | Galería de la edición 2024 con lightbox | [05-galeria.html](https://expojuy2026.vercel.app/mockups/05-galeria.html) |
| 06 | **Plano interactivo** | Zonificación de Ciudad Cultural, filtros y detalle por stand | [06-mapa.html](https://expojuy2026.vercel.app/mockups/06-mapa.html) |

---

## Cómo leer estos mockups

**Son exploración de diseño, no la propuesta final.** El sitio construido evolucionó a partir de acá y en varios puntos se apartó a propósito:

- La **paleta cambió** después de estos mockups. Acá se ve la paleta mineral inicial (ocre, terracota, violeta, verde-azulado); el sitio final usa los cuatro colores del isotipo oficial de ExpoJuy, para que la web y las redes del evento se lean como una sola marca. La decisión está registrada en la [memoria ejecutiva](../../docs/memoria-ejecutiva.md).
- El **plano del predio** acá es esquemático. En el sitio final es el calco del plano real de 2024 hecho a partir del CAD, con más de 200 zonas.
- La **navegación** acá está partida en pantallas separadas. El sitio final es una sola página con anclas, decisión justificada en la [memoria descriptiva §4](../../docs/memoria-descriptiva.md#4-organización-del-contenido).

Que los mockups y el sitio no coincidan al 100% es el resultado esperado de haberlos usado para lo que sirven: probar ideas barato antes de construirlas caro.

---

## Contenido de la carpeta

```
index.html        Portal de presentación
01..06-*.html     Las seis pantallas
styles.css        Sistema de diseño compartido (tokens, tipografía, componentes)
shader.js         Animación de bandas minerales del fondo
images/           Assets locales (logos oficiales y fotos de la edición 2024)
```

La especificación de diseño completa —tokens de color, reglas tipográficas, componentes y motion— está en [`ux-ui/DESIGN.md`](../DESIGN.md).

> La copia servida en vivo vive en [`public/mockups/`](../../public/mockups) y es idéntica a esta, salvo que apunta a las imágenes de `public/images/` para no duplicar 6 MB de fotos en el repositorio.

---

<div align="center">

[← Volver al README](../../README.md) · [Guía del jurado](../../docs/GUIA-DEL-JURADO.md) · [Sitio en vivo](https://expojuy2026.vercel.app)

</div>
