import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

// NOTA: eslint-plugin-boundaries v7 marca esta sintaxis (rules/element-types)
// como deprecada en favor de "policies" — se verificó que sigue funcionando
// (bloquea imports a archivos internos de otro módulo, ver tests manuales
// en el PR de scaffold). Migrar a la API nueva cuando haya documentación
// estable; no es bloqueante hoy.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { boundaries },
    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "module", pattern: "src/modules/*", mode: "folder" },
        { type: "lib", pattern: "src/lib/*", mode: "folder" },
        { type: "app", pattern: "src/app/**", mode: "file" },
      ],
    },
    rules: {
      "boundaries/no-unknown": "error",
      // Un módulo solo puede depender de lib/ (config, ports) o de la
      // puerta pública de otro módulo — nunca de un archivo interno
      // suyo. app/ puede usar cualquier módulo o lib.
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "module", allow: ["lib", "module"] },
            { from: "app", allow: ["module", "lib"] },
            { from: "lib", allow: ["lib"] },
          ],
        },
      ],
      // Solo module/ exige un único punto de entrada (index.ts). lib/
      // (config, ports, adapters) es utilitario, no un módulo de negocio
      // aislado, así que sus archivos internos se pueden importar libre
      // entre sí — target: "module" ya cubre la restricción que importa.
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [
            { target: "module", allow: "index.ts" },
            { target: "lib", allow: "**/*" },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
