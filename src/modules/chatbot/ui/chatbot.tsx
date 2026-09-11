"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { chatbotMessages, type ChatbotLocale } from "./chatbot-messages";

const FAQ_KEYS = [
  "dates",
  "tickets",
  "exhibitors",
  "businessRounds",
  "accessibility",
  "parking",
  "languages",
  "updates",
] as const;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialMessageShown = useRef(false);
  const panelRef = useRef<HTMLElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const rawLocale = useLocale();
  const locale: ChatbotLocale =
    rawLocale in chatbotMessages ? (rawLocale as ChatbotLocale) : "es-AR";
  const t = chatbotMessages[locale] ?? chatbotMessages["es-AR"];
  const faq = useTranslations("Landing.Faq");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Show initial message once when opening
  useEffect(() => {
    if (isOpen && !initialMessageShown.current) {
      initialMessageShown.current = true;
      setMessages([{ role: "assistant", content: t.initialMessage }]);
    }
  }, [isOpen, t.initialMessage]);

  // El bot aparece junto al índice de secciones, después del Hero.
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsPastHero(!entry.isIntersecting);
      if (entry.isIntersecting) setIsOpen(false);
    }, { rootMargin: "-15% 0px 0px 0px" });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Scroll down when messages update
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key, atrapa el Tab dentro del panel mientras está
  // abierto y devuelve el foco al botón que lo abrió al cerrar — el mismo
  // contrato que ya cumple el modal de la galería (gallery-grid.tsx).
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])",
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      openButtonRef.current?.focus();
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFaqSelect = (key: (typeof FAQ_KEYS)[number]) => {
    const question = faq(`items.${key}.question`);
    const answer = faq(`items.${key}.answer`);

    setMessages((previous) => [
      ...previous,
      { role: "user", content: question },
      { role: "assistant", content: answer },
    ]);
    setIsFaqOpen(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const userText = inputValue.trim();
    if (!userText || isLoading) return;

    const userMessage: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessages = [...messages, userMessage];
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          locale,
          conversation: currentMessages.slice(-6),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Server response error");
      }

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t.fallbackMessage },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t.fallbackMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {isPastHero && !isOpen && (
        <aside
          aria-label={t.openLabel}
          // El dock inferior de SectionNav (fixed bottom-0, visible hasta lg)
          // se pisaba con este botón cuando ambos usaban el mismo bottom-6 —
          // acá sube por encima del dock en mobile/tablet y vuelve a bottom-6
          // en desktop, donde el dock no existe (reemplazado por el riel
          // vertical).
          // El botón se monta al dejar el hero: entra con su propia
          // animación en vez de aparecer de golpe (antes el montaje era un
          // corte seco y el `transition-transform` de acá solo servía para
          // el hover).
          className="fixed right-6 bottom-24 z-50 transition-transform duration-200 ease-out hover:scale-105 lg:bottom-6 motion-safe:animate-[bot-dock-in_0.45s_cubic-bezier(0.16,1,0.3,1)_backwards]"
        >
          <button
            ref={openButtonRef}
            type="button"
            onClick={handleOpen}
            aria-label={t.openLabel}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line)] bg-ink/90 text-[var(--color-paper)] shadow-[0_8px_32px_rgba(45,227,214,0.25)] backdrop-blur-md transition hover:border-[var(--color-cyan)] hover:shadow-[0_12px_40px_rgba(45,227,214,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cyan)] sm:h-16 sm:w-16"
          >
            <span
              className="absolute -top-1 -right-1 flex h-3.5 w-3.5"
              aria-hidden="true"
            >
              {/* Tres pings y se calla. `animate-ping` infinito llamaba la
                  atención para siempre desde una esquina fija de TODA la
                  página: un punto de notificación que late sin parar sobre
                  contenido que nunca cambia deja de significar algo y pasa
                  a ser ruido permanente en el campo visual. Llamar al
                  llegar y después quedarse quieto sí comunica. */}
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-cyan)] opacity-75 motion-safe:animate-[bot-badge-ping_1.4s_cubic-bezier(0,0,0.2,1)_3_both]" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[var(--color-cyan)]" />
            </span>
            <svg
              className="h-7 w-7 text-[var(--color-cyan)] transition-transform duration-200 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.84-.962 4.47 4.47 0 00.485-1.928C3.805 16.52 3 14.39 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </button>
        </aside>
      )}

      {/* Ventana del Chat */}
      {isOpen && (
        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.assistantTitle}
          // El panel se monta al abrir: una `transition` sobre un elemento
          // recién montado nunca dispara (no hay estado anterior desde el
          // cual transicionar), así que el `transition-all duration-300` que
          // había acá no animaba nada y la ventana aparecía de golpe. Una
          // keyframe sí corre al montar, y crece desde la esquina inferior
          // derecha — de donde salió el botón que la abrió.
          className="fixed right-4 bottom-20 z-50 flex h-[min(600px,calc(100vh-6rem))] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-ink/95 text-[var(--color-paper)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:right-6 sm:w-[400px] lg:bottom-6 lg:h-[min(600px,calc(100vh-2rem))] motion-safe:animate-[bot-panel-in_0.28s_cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-line)] bg-surface/90 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-cyan)]/40 bg-[var(--color-cyan)]/10 text-base font-medium text-[var(--color-cyan)]"
                aria-hidden="true"
              >
                ✨
              </div>
              <div>
                <h2 className="font-display text-xs font-semibold tracking-wide text-[var(--color-paper)] uppercase sm:text-sm">
                  {t.assistantTitle}
                </h2>
                <div className="flex items-center gap-1.5 text-[0.65rem] font-mono text-[var(--color-cyan)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] motion-safe:animate-pulse" />
                  <span>{t.statusOnline}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-paper-dim)] transition hover:border hover:border-[var(--color-line)] hover:bg-white/5 hover:text-[var(--color-paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cyan)]"
              aria-label={t.closeLabel}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth sm:p-5">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                // La lista solo crece: los índices ya montados conservan su
                // identidad y no vuelven a animar, así que la keyframe corre
                // una sola vez, sobre el mensaje nuevo.
                className={`flex motion-safe:animate-[bot-msg-in_0.24s_cubic-bezier(0.16,1,0.3,1)] ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed sm:text-sm ${
                    msg.role === "assistant"
                      ? "border border-[var(--color-line)] bg-surface text-[var(--color-paper)] shadow-sm"
                      : "border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/15 text-[var(--color-paper)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Estado de carga / escribiendo */}
            {isLoading && (
              <div className="flex justify-start motion-safe:animate-[bot-panel-in_0.24s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-line)] bg-surface px-4 py-2.5 text-xs font-mono text-[var(--color-paper-dim)]">
                  {/* Tres puntos con rebote desfasado, no un `animate-ping`.
                      El ping es una onda expansiva —el gesto de "algo pasó
                      acá"— y se estaba usando para decir "estoy escribiendo",
                      que es una cadencia, no un evento. Además era un solo
                      punto que se desvanecía: se leía como un parpadeo roto. */}
                  <span aria-hidden="true" className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] motion-safe:animate-[typing-dot_1.05s_ease-in-out_infinite]"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                  <span>{t.typing}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <section className="border-t border-[var(--color-line)] bg-surface/80 px-3 py-2 sm:px-4">
            <button
              type="button"
              onClick={() => setIsFaqOpen((open) => !open)}
              aria-expanded={isFaqOpen}
              className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-[var(--color-cyan)]/25 bg-[linear-gradient(120deg,rgba(45,227,214,0.12),rgba(122,75,218,0.12))] px-3 py-2.5 text-left transition hover:border-[var(--color-cyan)]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cyan)]"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/10 font-display text-lg text-[var(--color-cyan)]"
              >
                ?
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs tracking-wide text-[var(--color-cyan)] uppercase">
                  {t.faqTitle}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--color-paper-dim)]">
                  {t.faqDescription}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`text-lg text-[var(--color-cyan)] transition-transform duration-200 ${
                  isFaqOpen ? "rotate-45" : "group-hover:scale-110"
                }`}
              >
                +
              </span>
            </button>

            {isFaqOpen && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {FAQ_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleFaqSelect(key)}
                    className="group flex min-h-16 items-start gap-2 rounded-xl border border-[var(--color-line)] bg-ink p-2.5 text-left transition hover:border-[var(--color-lavender)] hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cyan)]"
                  >
                    <span className="font-mono text-[0.625rem] text-[var(--color-cyan)]">→</span>
                    <span className="line-clamp-3 text-xs leading-snug text-[var(--color-paper)]">
                      {faq(`items.${key}.question`)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Input & Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-[var(--color-line)] bg-surface/80 p-3 sm:p-4"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 rounded-full border border-[var(--color-line)] bg-ink px-4 py-2 text-xs text-[var(--color-paper)] placeholder:text-[var(--color-paper-dim)] focus:border-[var(--color-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--color-cyan)] disabled:opacity-50 sm:text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--color-cyan)] px-4 font-mono text-xs font-semibold tracking-wider text-[var(--color-ink-fixed)] uppercase transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t.sendButton}
              >
                {t.sendButton}
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
