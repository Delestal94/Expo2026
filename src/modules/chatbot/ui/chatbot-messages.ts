/**
 * Chat bot UI strings — one object per locale.
 * Kept separate from the main i18n messages so chat-specific
 * strings (which never appear in the page content) stay isolated.
 *
 * Each key mirrors the locale from `src/lib/i18n/routing.ts`.
 */
export const chatbotMessages = {
  "es-AR": {
    openLabel: "Abrir chat de ayuda",
    closeLabel: "Cerrar chat",
    sendButton: "Enviar",
    placeholder: "Escribe tu consulta…",
    typing: "Escribiendo…",
    assistantTitle: "Asistente ExpoJuy 2026",
    statusOnline: "En línea",
    faqTitle: "Preguntas frecuentes",
    initialMessage:
      "¡Hola! 👋 Soy el asistente oficial de ExpoJuy 2026. ¿En qué puedo ayudarte? Puedo contarte sobre el evento, la sede en Ciudad Cultural, rondas de negocios, expositores o cómo adquirir tu entrada.",
    fallbackMessage:
      "Lo siento, no pude conectarme al asistente en este momento. Por favor intentá de nuevo más tarde.",
    apiKeyMissing:
      "El asistente no está configurado. Contactá al organizador.",
    rateLimit: "Demasiadas solicitudes. Intentá en unos momentos.",
    errorMessage: "Ocurrió un error. Intentá de nuevo.",
    voiceLabel: "Escuchar respuesta",
    stopListeningLabel: "Detener escucha",
    startListeningLabel: "Iniciar escucha de voz",
    voiceNotSupported: "Tu navegador no soporta reconocimiento de voz.",
  },
  en: {
    openLabel: "Open help chat",
    closeLabel: "Close chat",
    sendButton: "Send",
    placeholder: "Type your question…",
    typing: "Typing…",
    assistantTitle: "ExpoJuy 2026 Assistant",
    statusOnline: "Online",
    faqTitle: "Frequently asked questions",
    initialMessage:
      "Hi! 👋 I'm the official ExpoJuy 2026 assistant. How can I help you? I can tell you about the event, Ciudad Cultural venue, business rounds, exhibitors, or ticketing info.",
    fallbackMessage:
      "Sorry, I couldn't connect to the assistant right now. Please try again later.",
    apiKeyMissing:
      "The assistant is not configured. Contact the organizer.",
    rateLimit: "Too many requests. Please try again in a moment.",
    errorMessage: "An error occurred. Please try again.",
    voiceLabel: "Listen to response",
    stopListeningLabel: "Stop listening",
    startListeningLabel: "Start voice listening",
    voiceNotSupported: "Your browser does not support voice recognition.",
  },
  pt: {
    openLabel: "Abrir chat de ajuda",
    closeLabel: "Fechar chat",
    sendButton: "Enviar",
    placeholder: "Digite sua mensagem…",
    typing: "Digitando…",
    assistantTitle: "Assistente ExpoJuy 2026",
    statusOnline: "Online",
    faqTitle: "Perguntas frequentes",
    initialMessage:
      "Olá! 👋 Sou o assistente oficial da ExpoJuy 2026. Em que posso ajudar? Posso contar sobre o evento, a sede em Ciudad Cultural, rodadas de negócios, expositores ou ingressos.",
    fallbackMessage:
      "Desculpe, não consegui conectar ao assistente neste momento. Tente novamente mais tarde.",
    apiKeyMissing:
      "O assistente não está configurado. Entre em contato com o organizador.",
    rateLimit: "Muitas solicitações. Tente novamente em alguns instantes.",
    errorMessage: "Ocorreu um erro. Tente novamente.",
    voiceLabel: "Ouvir resposta",
    stopListeningLabel: "Parar escuta",
    startListeningLabel: "Iniciar escuta de voz",
    voiceNotSupported: "Seu navegador não suporta reconhecimento de voz.",
  },
  zh: {
    openLabel: "打开帮助聊天",
    closeLabel: "关闭聊天",
    sendButton: "发送",
    placeholder: "输入您的咨询…",
    typing: "正在输入…",
    assistantTitle: "ExpoJuy 2026 智能助手",
    statusOnline: "在线",
    faqTitle: "常见问题",
    initialMessage:
      "您好！👋 我是 ExpoJuy 2026 官方助手。有什么可以帮您的？我可以为您解答活动日程、文化城会场信息、商务洽谈、参展企业及入场门票等问题。",
    fallbackMessage:
      "抱歉，目前暂时无法连接助手，请稍后再试。",
    apiKeyMissing:
      "助手未配置。请联系主办方。",
    rateLimit: "请求过于频繁，请稍候再试。",
    errorMessage: "发生错误，请重试。",
    voiceLabel: "收听回复",
    stopListeningLabel: "停止收听",
    startListeningLabel: "开始语音收听",
    voiceNotSupported: "您的浏览器不支持语音识别。",
  },
} as const;

export type ChatbotLocale = keyof typeof chatbotMessages;
export type ChatbotMessages = (typeof chatbotMessages)[ChatbotLocale];
