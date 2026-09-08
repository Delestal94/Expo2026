# Documentación — ExpoJuy 2026

Índice de todo lo que hay acá. Si sos jurado, empezá por la **[Guía del jurado](GUIA-DEL-JURADO.md)**.

---

## 🎓 Para evaluar la propuesta

| Documento | Qué es |
|---|---|
| **[GUIA-DEL-JURADO.md](GUIA-DEL-JURADO.md)** | Recorrido guiado: qué mirar, en qué orden, y cómo verificar cada criterio de evaluación |
| **[entregables-etapa-1.md](entregables-etapa-1.md)** | Los 7 ítems del Anexo III, cada uno con su link directo |
| **[memoria-descriptiva.pdf](memoria-descriptiva.pdf)** | **Entregable formal del concurso** (Consignas §4.2) · [versión Markdown](memoria-descriptiva.md) |
| **[matriz-consignas-desafio.md](matriz-consignas-desafio.md)** | Auditoría de cumplimiento consigna por consigna, incluido lo que **no** está al 100% |
| **[declaracion-uso-ia.md](declaracion-uso-ia.md)** | Declaración formal de uso de IA (Anexo III ítem 6 · Bases Art. 11) |
| **[tecnologias-propuestas.md](tecnologias-propuestas.md)** | Stack propuesto y justificación de cada elección (Anexo III ítem 5) |

## 🛠️ Para entender cómo se construyó

| Documento | Qué es |
|---|---|
| **[proceso-de-trabajo.md](proceso-de-trabajo.md)** | El método: flujo de trabajo, barreras de calidad, auditorías críticas |
| **[architecture.md](architecture.md)** | Arquitectura técnica: módulos, integraciones, entornos, seguridad |
| **[adr/](adr/)** | Las 6 decisiones de arquitectura, con fecha, contexto y consecuencias |
| **[memoria-ejecutiva.md](memoria-ejecutiva.md)** | Bitácora de avance día por día, escrita mientras se trabajaba |
| **[../CONTRIBUTING.md](../CONTRIBUTING.md)** | Reglas de branching, commits y Pull Requests |

## 📁 Material de referencia

| Carpeta | Qué contiene |
|---|---|
| **[concurso/](concurso/)** | Bases y Condiciones, Consignas Técnicas y las fuentes de investigación sobre el evento |
| **[pdf/](pdf/)** | Configuración y hoja de estilos con la que se genera la memoria descriptiva en PDF |
| **[../ux-ui/](../ux-ui/)** | Sistema de diseño, mockups y kit de identidad oficial |

---

## Decisiones de arquitectura (ADR)

| # | Decisión | Fecha |
|---|---|---|
| [0001](adr/0001-stack-base.md) | Next.js + TypeScript + Supabase + Vercel como stack base | 2026-08-31 |
| [0002](adr/0002-configurabilidad-adaptadores.md) | Feature flags editoriales + puertos y adaptadores | 2026-08-31 |
| [0003](adr/0003-modo-de-acceso.md) | Modo de acceso (gratuito o pago) configurable | 2026-09-01 · rev. 09-06 |
| [0004](adr/0004-visibilidad-repositorio.md) | Repositorio público, sin licencia declarada | 2026-09-01 |
| [0005](adr/0005-acceso-libre-sin-registro.md) | Expositores se postulan por canales externos al sitio | 2026-09-01 |
| [0006](adr/0006-scaffolding-i18n.md) | Scaffolding de i18n con next-intl | 2026-09-02 |

---

## Regenerar la memoria descriptiva en PDF

```bash
npm run memoria:pdf
```

Toma [`memoria-descriptiva.md`](memoria-descriptiva.md) y produce [`memoria-descriptiva.pdf`](memoria-descriptiva.pdf) con la carátula institucional, usando la configuración de [`pdf/`](pdf/).

---

<div align="center">

[← Volver al README](../README.md) · [Sitio en vivo](https://expojuy2026.vercel.app)

</div>
