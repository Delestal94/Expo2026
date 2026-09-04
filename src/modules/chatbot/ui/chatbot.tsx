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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialMessageShown = useRef(false);

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

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
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
      {!isOpen && (
        <aside
          aria-label={t.openLabel}
          className="fixed bottom-6 right-6 z-50 transition-transform duration-200 hover:scale-105"
        >
          <button
            type="button"
            onClick={handleOpen}
            aria-label={t.openLabel}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line)] bg-[#0d0b2e]/90 text-[var(--color-paper)] shadow-[0_8px_32px_rgba(45,227,214,0.25)] backdrop-blur-md transition hover:border-[var(--color-cyan)] hover:shadow-[0_12px_40px_rgba(45,227,214,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cyan)] sm:h-16 sm:w-16"
          >
            <span
              className="absolute -top-1 -right-1 flex h-3.5 w-3.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-cyan)] opacity-75" />
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
          role="dialog"
          aria-label={t.assistantTitle}
          className="fixed bottom-4 right-4 z-50 flex h-[min(600px,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[#0d0b2e]/95 text-[var(--color-paper)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:w-[400px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-line)] bg-[#121022]/90 px-4 py-3 sm:px-5">
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
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
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
                className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed sm:text-sm ${
                    msg.role === "assistant"
                      ? "border border-[var(--color-line)] bg-[#15123a] text-[var(--color-paper)] shadow-sm"
                      : "border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/15 text-[var(--color-paper)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Estado de carga / escribiendo */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-line)] bg-[#15123a] px-4 py-2.5 text-xs font-mono text-[var(--color-paper-dim)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-cyan)] animate-ping" />
                  <span>{t.typing}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <section className="border-t border-[var(--color-line)] bg-[#121022]/80 px-3 py-2 sm:px-4">
            <button
              type="button"
              onClick={() => setIsFaqOpen((open) => !open)}
              aria-expanded={isFaqOpen}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left font-mono text-xs tracking-wide text-[var(--color-cyan)] uppercase transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cyan)]"
            >
              {t.faqTitle}
              <span aria-hidden="true">{isFaqOpen ? "−" : "+"}</span>
            </button>

            {isFaqOpen && (
              <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
                {FAQ_KEYS.map((key) => (
                  <details key={key} className="rounded-lg border border-[var(--color-line)] bg-[#0d0b2e] px-3 py-2">
                    <summary className="cursor-pointer list-none text-xs font-medium text-[var(--color-paper)] marker:content-none">
                      {faq(`items.${key}.question`)}
                    </summary>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-paper-dim)]">
                      {faq(`items.${key}.answer`)}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </section>

          {/* Input & Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-[var(--color-line)] bg-[#121022]/80 p-3 sm:p-4"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 rounded-full border border-[var(--color-line)] bg-[#0d0b2e] px-4 py-2 text-xs text-[var(--color-paper)] placeholder:text-[var(--color-paper-dim)] focus:border-[var(--color-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--color-cyan)] disabled:opacity-50 sm:text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--color-cyan)] px-4 font-mono text-xs font-semibold tracking-wider text-[var(--color-ink)] uppercase transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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
