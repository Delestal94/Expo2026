/**
 * Al hacer F5, el navegador restaura la posición de scroll previa por
 * defecto (`history.scrollRestoration = "auto"`) — si el visitante estaba
 * a mitad del recorrido scrollytelling de HeroAboutStage, recarga y cae
 * ahí de nuevo en vez de volver al hero. `hero-about-stage.tsx` ya resuelve
 * el estado "a medias" con `settle()`, pero eso solo evita quedar
 * congelado entre hero y "sobre": el resultado sigue siendo la sección
 * donde estabas, no el hero.
 *
 * Se corre en <head>, antes del primer paint, para no arrancar en un
 * scroll que se corrige un instante después (flash visible). Deja pasar
 * los reingresos con hash (`#agenda`, etc.): esos sí deben aterrizar en su
 * ancla.
 */
export const SCROLL_RESTORATION_INIT_SCRIPT = `
try {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
} catch (e) {}
`;
