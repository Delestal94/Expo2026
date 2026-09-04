import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message?: string;
  locale?: string;
  conversation?: Array<{ role: "user" | "assistant"; content: string }>;
}

const SYSTEM_PROMPTS: Record<string, ChatMessage> = {
  "es-AR": {
    role: "system",
    content: `Eres un asistente útil y amable para ExpoJuy 2026. Estás enfocado en las personas, eres preciso y ayudas a entender la información del evento. Usa un lenguaje simple y directo. Preséntate como el asistente oficial de ExpoJuy 2026. Nunca inventes fechas o cifras que no conozcas. Responde siempre en español.

Características clave de ExpoJuy 2026:
- Del 9 al 12 de octubre, en Ciudad Cultural, San Salvador de Jujuy
- Nuevo formato de 4 días: rondas de negocios por la mañana, expo por la tarde
- Ejes: Minería y litio, Comercio exterior, Corredor Bioceánico, Economía del conocimiento
- 17ª edición, organizada por la Cámara de Comercio Exterior de Jujuy

Si no sabes algo, di claramente: "No tengo esa información en este momento."

Consejo útil: Para acceder al predio es necesario un ticket de entrada. Los precios se confirman con la Cámara más cerca de la fecha.

Usa emojis con moderación para hacer el mensaje más amigable (👋 🏢 🚀).

No respondas temas delicados como políticas partidarias o especulaciones financieras.

Usa viñetas para listas cortas (2 a 5 elementos).

Mantén la coherencia y concisión en la conversación.`,
  },
  en: {
    role: "system",
    content: `You are a helpful and friendly assistant for ExpoJuy 2026. You are focused on people, precise, and help visitors understand event information. Use simple, direct language. Introduce yourself as the official ExpoJuy 2026 assistant. Never make up dates or figures you don't know. Always respond in English.

Key features of ExpoJuy 2026:
- October 9 to 12, at Ciudad Cultural, San Salvador de Jujuy
- New 4-day format: business rounds in the morning, general expo in the afternoon
- Themes: Mining and lithium, Foreign trade, Bioceanic Corridor, Knowledge economy
- 17th edition, organized by the Jujuy Foreign Trade Chamber

If you don't know something, say clearly: "I don't have that information at the moment."

Helpful tip: Access to the venue requires an entrance ticket. Prices will be confirmed with the Chamber closer to the event date.

Use emojis moderately (👋 🏢 🚀).

Keep short lists as bullet points (2 to 5 items).

Maintain consistency and conciseness throughout the conversation.`,
  },
  pt: {
    role: "system",
    content: `Você é um assistente útil e amigável para a ExpoJuy 2026. Focado nas pessoas, preciso, ajuda a entender informações do evento. Use linguagem simples e direta. Apresente-se como o assistente oficial da ExpoJuy 2026. Nunca invente datas ou números que não conhece. Responda sempre em português.

Características principais da ExpoJuy 2026:
- De 9 a 12 de outubro, na Ciudad Cultural, San Salvador de Jujuy
- Novo formato de 4 dias: rodadas de negócios pela manhã, exposição à tarde
- Eixos: Mineração e lítio, Comércio exterior, Corredor Bioceânico, Economia do conhecimento
- 17ª edição, organizada pela Câmara de Comércio Exterior de Jujuy

Se não souber de algo, diga claramente: "Não tenho essa informação neste momento."

Dica útil: Para acessar o local é necessário um ingresso. Os preços são confirmados com a Câmara mais perto da data.

Use emojis moderadamente (👋 🏢 🚀).

Use marcadores para listas curtas (2 a 5 itens).

Mantenha a coerência e clareza na conversa.`,
  },
  zh: {
    role: "system",
    content: `您是 ExpoJuy 2026 的官方助手，专注于帮助人们了解展会与活动信息。使用清晰、亲切且准确的语言回答问题。如果不确定某项信息，请明确说明，切勿编造日期或数据。请始终使用中文回复。

ExpoJuy 2026 核心信息：
- 2026年10月9日至12日，在阿根廷胡胡伊省圣萨尔瓦多-德胡胡伊的文化城（Ciudad Cultural）举行
- 创新的4天紧凑模式：上午进行国际商务对接洽谈，下午面向公众与专业观众开放展览
- 四大支柱领域：锂矿开采与技术、对外贸易、南回归线生物海洋走廊物流、知识经济与软件
- 第17届盛会，由胡胡伊对外贸易商会（Cámara de Comercio Exterior de Jujuy）组织

温馨提示：进入展区需要门票，票务政策由商会后续正式公布。

适度使用表情符号增强亲和力（👋 🏢 🚀）。保持回答精炼有条理。`,
  },
};

const MOCK_RESPONSES: Record<string, string> = {
  "es-AR": `¡Hola! 👋 Soy el asistente oficial de ExpoJuy 2026. ¿En qué puedo ayudarte?

Puedo brindarte información sobre:
• Fechas del evento (9 al 12 de octubre de 2026)
• Sede: Ciudad Cultural en San Salvador de Jujuy
• Ejes temáticos (Minería y Litio, Comercio Exterior, Corredor Bioceánico, Economía del Conocimiento)
• Rondas de negocios internacionales por la mañana y exposición abierta por la tarde
• Directorio y perfiles de expositores
• Acceso, entradas y cómo llegar

¿Qué te gustaría consultar?`,
  en: `Hello! 👋 I'm the official assistant for ExpoJuy 2026. How can I help you?

I can provide information on:
• Event dates (October 9–12, 2026)
• Venue: Ciudad Cultural in San Salvador de Jujuy
• Key themes (Mining & Lithium, Foreign Trade, Bioceanic Corridor, Knowledge Economy)
• International business rounds in the morning and public exhibition in the afternoon
• Exhibitor directory and company profiles
• Visitor access, tickets, and directions

What would you like to know?`,
  pt: `Olá! 👋 Sou o assistente oficial da ExpoJuy 2026. Como posso ajudar?

Posso fornecer informações sobre:
• Datas do evento (9 a 12 de outubro de 2026)
• Local: Ciudad Cultural em San Salvador de Jujuy
• Eixos temáticos (Mineração e Lítio, Comércio Exterior, Corredor Bioceânico, Economia do Conhecimento)
• Rodadas de negócios internacionais pela manhã e exposição aberta à tarde
• Diretório e perfis de expositores
• Acesso, ingressos e como chegar

O que você gostaria de saber?`,
  zh: `您好！👋 我是 ExpoJuy 2026 官方助手。有什么可以帮您的？

我可以为您解答以下内容：
• 活动时间（2026年10月9日至12日）
• 展会地点：San Salvador de Jujuy 的 Ciudad Cultural（文化城）
• 四大主题（锂矿与矿业、对外贸易、生物海洋走廊物流、知识与数字经济）
• 上午国际商务洽谈会与下午展览安排
• 参展企业目录与对接
• 场馆交通、入场门票与参观指南

您想了解哪方面的信息？`,
};

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, locale = "es-AR", conversation = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    const systemPrompt = SYSTEM_PROMPTS[locale] || SYSTEM_PROMPTS["es-AR"];

    if (OPENROUTER_API_KEY) {
      try {
        const messages: ChatMessage[] = [
          systemPrompt,
          ...conversation.slice(-8).map((c) => ({
            role: c.role,
            content: c.content,
          })),
          { role: "user", content: trimmedMessage },
        ];

        const openrouterResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://expojuy2026.vercel.app",
              "X-Title": "ExpoJuy 2026 Chat Assistant",
            },
            body: JSON.stringify({
              model: DEFAULT_MODEL,
              messages,
              max_tokens: 500,
              temperature: 0.7,
            }),
          }
        );

        if (openrouterResponse.ok) {
          const data = await openrouterResponse.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply && typeof reply === "string") {
            return NextResponse.json({
              response: reply,
              conversation: [
                ...conversation,
                { role: "user", content: trimmedMessage },
                { role: "assistant", content: reply },
              ],
            });
          }
        }
      } catch (apiError) {
        console.error("OpenRouter request failed, falling back to mock response:", apiError);
      }
    }

    // Fallback/Mock response when no API key is set or when upstream fails
    const mockReply = MOCK_RESPONSES[locale] || MOCK_RESPONSES["es-AR"];

    return NextResponse.json({
      response: mockReply,
      conversation: [
        ...conversation,
        { role: "user", content: trimmedMessage },
        { role: "assistant", content: mockReply },
      ],
    });
  } catch (error) {
    console.error("Chat API handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
