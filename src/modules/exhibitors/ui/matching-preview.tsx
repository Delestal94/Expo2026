"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const MATCH_SCORE = 92;
const MATCH_A_NAME = "Andes Trade Corredor";
const MATCH_B_NAME = "Corredor Capricornio Logística";
const SHARED_TAG_KEYS = ["corredor", "logistica", "pasoDeJama"] as const;

export function MatchingPreview() {
  const t = useTranslations("Exhibitors.Matching");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <div>
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-line bg-ink p-5">
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-violet uppercase">
            {t("expositorLabel")}
          </span>
          <h4 className="mt-2 font-display text-lg text-paper">{MATCH_A_NAME}</h4>
          <p className="mt-1 text-sm text-paper-dim">{t("a.detail")}</p>
        </div>

        <div className="flex flex-col items-center gap-2 py-4 md:py-0">
          <svg width="64" height="24" viewBox="0 0 64 24" aria-hidden="true">
            <line x1="0" y1="12" x2="64" y2="12" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 5">
              {!prefersReducedMotion && (
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.8s" repeatCount="indefinite" />
              )}
            </line>
          </svg>
          <span className="rounded-full border border-accent px-3 py-1 font-mono text-sm font-semibold text-accent">
            {MATCH_SCORE}%
          </span>
        </div>

        <div className="rounded-xl border border-line bg-ink p-5">
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-violet uppercase">
            {t("expositorLabel")}
          </span>
          <h4 className="mt-2 font-display text-lg text-paper">{MATCH_B_NAME}</h4>
          <p className="mt-1 text-sm text-paper-dim">{t("b.detail")}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {SHARED_TAG_KEYS.map((key) => (
          <span
            key={key}
            className="rounded-full bg-violet/15 px-3 py-1 font-mono text-[0.68rem] text-violet"
          >
            {t(`shared.${key}`)}
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm text-paper-dim">
        {t.rich("disclaimer", {
          code: (chunks) => <span className="font-mono">{chunks}</span>,
        })}
      </p>
    </div>
  );
}
