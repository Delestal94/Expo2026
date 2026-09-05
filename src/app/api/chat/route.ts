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

function matchFrequentQuestion(message: string, locale: string): string | null {
  const norm = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. Fechas y cuándo es
  if (
    norm.includes("fecha") ||
    norm.includes("cuando") ||
    norm.includes("dia") ||
    norm.includes("date") ||
    norm.includes("when") ||
    norm.includes("data") ||
    norm.includes("quando") ||
    norm.includes("日期") ||
    norm.includes("时间")
  ) {
    switch (locale) {
      case "en":
        return "📅 **ExpoJuy 2026 Dates:** The event takes place from **October 9 to 12, 2026** (4 days) at Ciudad Cultural in San Salvador de Jujuy, Argentina. Morning sessions focus on international business rounds, and afternoon sessions open the general exhibition.";
      case "pt":
        return "📅 **Datas da ExpoJuy 2026:** O evento acontecerá de **9 a 12 de outubro de 2026** na Ciudad Cultural, San Salvador de Jujuy, Argentina. O formato inclui rodadas de negócios internacionais pela manhã e exposição aberta ao público à tarde.";
      case "zh":
        return "📅 **展会时间：** ExpoJuy 2026 将于 **2026年10月9日至12日** 在阿根廷胡胡伊省的 Ciudad Cultural（文化城）举行，上午进行国际商务洽谈，下午面向公众开放展览。";
      default:
        return "📅 **Fechas de ExpoJuy 2026:** El evento se realizará del **9 al 12 de octubre de 2026** (4 días) en el predio ferial de Ciudad Cultural, San Salvador de Jujuy. El formato concentra rondas de negocios internacionales por la mañana y exposición abierta al público por la tarde.";
    }
  }

  // 2. Ubicación, sede y cómo llegar
  if (
    norm.includes("donde") ||
    norm.includes("lugar") ||
    norm.includes("sede") ||
    norm.includes("ubicacion") ||
    norm.includes("ciudad cultural") ||
    norm.includes("llegar") ||
    norm.includes("direccion") ||
    norm.includes("where") ||
    norm.includes("location") ||
    norm.includes("venue") ||
    norm.includes("onde") ||
    norm.includes("local") ||
    norm.includes("地点") ||
    norm.includes("地址")
  ) {
    switch (locale) {
      case "en":
        return "📍 **Venue & Location:** ExpoJuy 2026 takes place at **Ciudad Cultural** in the Alto Padilla neighborhood of San Salvador de Jujuy. It features direct highway access from Route 9, public bus stops, and dedicated parking for over 1,500 vehicles.";
      case "pt":
        return "📍 **Local e Acesso:** A sede oficial é a **Ciudad Cultural**, no bairro Alto Padilla em San Salvador de Jujuy. Conta com acesso direto pela Ruta 9 e estacionamento para mais de 1.500 veículos.";
      case "zh":
        return "📍 **举办地点：** 设在圣萨尔瓦多-德胡胡伊 Alto Padilla 区的 **Ciudad Cultural**（文化城），交通便捷，配套1500+车位停车场。";
      default:
        return "📍 **Sede y Cómo llegar:** La sede oficial es el predio ferial de **Ciudad Cultural**, en el barrio Alto Padilla de San Salvador de Jujuy. Cuenta con acceso directo desde Ruta 9, transporte público y estacionamiento vigilado para más de 1.500 vehículos.";
    }
  }

  // 3. Entradas, precios y costo
  if (
    norm.includes("entrada") ||
    norm.includes("precio") ||
    norm.includes("costo") ||
    norm.includes("ticket") ||
    norm.includes("gratis") ||
    norm.includes("sin cargo") ||
    norm.includes("pagar") ||
    norm.includes("comprar") ||
    norm.includes("boleteria") ||
    norm.includes("price") ||
    norm.includes("cost") ||
    norm.includes("free") ||
    norm.includes("ingresso") ||
    norm.includes("preco") ||
    norm.includes("门票") ||
    norm.includes("价格") ||
    norm.includes("免费")
  ) {
    switch (locale) {
      case "en":
        return "🎟️ **Tickets & Admission:** Reference pricing for 2026: Children under 5 enter **free of charge**; students/minors are $4,000 ARS, and general adults are $6,000 ARS. Tickets will be available online and at venue box offices.";
      case "pt":
        return "🎟️ **Ingressos e Valores:** Crianças menores de 5 anos têm **entrada gratuita**; estudantes e menores $4.000 ARS; adultos $6.000 ARS. A compra estará disponível no site e na bilheteria local.";
      case "zh":
        return "🎟️ **门票与入场：** 5岁以下儿童**免费入场**；学生及未成年人 4,000 比索；成人 6,000 比索。门票可通过官网及现场售票处购买。";
      default:
        return "🎟️ **Entradas y Precios:** Los valores de referencia para la edición 2026 son: Menores de 5 años ingresan **sin cargo**; estudiantes y menores $4.000; adultos $6.000. Los tickets podrán gestionarse tanto online en esta web como en las boleterías del predio.";
    }
  }

  // 4. Horarios y cronograma
  if (
    norm.includes("horario") ||
    norm.includes("hora") ||
    norm.includes("cronograma") ||
    norm.includes("programa") ||
    norm.includes("agenda") ||
    norm.includes("schedule") ||
    norm.includes("hours") ||
    norm.includes("programacao") ||
    norm.includes("时间表") ||
    norm.includes("日程")
  ) {
    switch (locale) {
      case "en":
        return "⏱️ **Daily Schedule:**\n• **Morning (09:00 to 13:00):** International B2B business rounds, Bioceanic logistics forums, and lithium roundtables.\n• **Afternoon (15:00 to 22:00):** Open exhibition, technical demonstrations, culinary fair, and live music.";
      case "pt":
        return "⏱️ **Horários e Cronograma:**\n• **Manhã (09:00 às 13:00):** Rodadas de negócios internacionais B2B e integração do Corredor Bioceânico.\n• **Tarde (15:00 às 22:00):** Exposição aberta, estandes industriais, praça gastronômica e shows.";
      case "zh":
        return "⏱️ **展会日常日程：**\n• **上午（09:00 - 13:00）：** 国际商务B2B对接洽谈及物流走廊论坛。\n• **下午（15:00 - 22:00）：** 展览向公众开放，设机械实操、技术论坛与文艺演出。";
      default:
        return "⏱️ **Horarios y Cronograma:**\n• **Mañana (09:00 a 13:00 hs):** Rondas de negocios B2B internacionales, foros del Corredor Bioceánico y mesas de trabajo mineras.\n• **Tarde (15:00 a 22:00 hs):** Exposición general abierta al público, demostraciones de maquinaria en pista, patio gastronómico y espectáculos en vivo.";
    }
  }

  // 5. Expositores, stands y puestos
  if (
    norm.includes("stand") ||
    norm.includes("puesto") ||
    norm.includes("expositor") ||
    norm.includes("empresa") ||
    norm.includes("plano") ||
    norm.includes("mapa") ||
    norm.includes("booth") ||
    norm.includes("exhibitor") ||
    norm.includes("展位") ||
    norm.includes("展商")
  ) {
    switch (locale) {
      case "en":
        return "🏢 **Exhibitors & Booths:** Over 200 exhibitors across lithium mining, regional foreign trade, Bioceanic logistics, and software solutions. Browse company profiles under **Exhibitors** and explore booth allocation in our **Interactive Map**.";
      case "pt":
        return "🏢 **Expositores e Estandes:** Mais de 200 expositores de mineração, logística internacional, agronegócio e tecnologia. Confira os perfis na aba **Expositores** e veja os estandes no **Mapa Interativo**.";
      case "zh":
        return "🏢 **参展企业与展位：** 汇聚了200多家锂电矿业、跨境物流及科技创新企业。欢迎浏览本站“**参展商**”与“**互动地图**”获取详细展位信息。";
      default:
        return "🏢 **Expositores y Stands:** Más de 200 empresas y emprendedores de minería de litio, comercio exterior, logística del Corredor Bioceánico y tecnología. Podés explorar los perfiles en la sección **Expositores** y recorrer el plano interactivo en la sección **Mapa**.";
    }
  }

  // 6. Estacionamiento
  if (
    norm.includes("estacionamiento") ||
    norm.includes("auto") ||
    norm.includes("parking") ||
    norm.includes("colectivo") ||
    norm.includes("estacionamento") ||
    norm.includes("停车")
  ) {
    switch (locale) {
      case "en":
        return "🚗 **Parking:** Ciudad Cultural has a guarded parking area for over 1,500 vehicles with direct access signs along Av. de los Estudiantes.";
      case "pt":
        return "🚗 **Estacionamento:** A Ciudad Cultural possui estacionamento monitorado para mais de 1.500 veículos com acesso pela Av. de los Estudiantes.";
      case "zh":
        return "🚗 **停车场设施：** 文化城配有超1500个车位的专属安保停车场，由 Av. de los Estudiantes 直接进出。";
      default:
        return "🚗 **Estacionamiento:** El predio de Ciudad Cultural cuenta con una amplia playa de estacionamiento vigilada con capacidad para más de 1.500 automóviles y colectivos, con acceso señalizado sobre Av. de los Estudiantes.";
    }
  }

  // 7. Accesibilidad
  if (
    norm.includes("accesibilidad") ||
    norm.includes("discapacidad") ||
    norm.includes("movilidad") ||
    norm.includes("silla de ruedas") ||
    norm.includes("accessibility") ||
    norm.includes("wheelchair") ||
    norm.includes("acessibilidade") ||
    norm.includes("无障碍")
  ) {
    switch (locale) {
      case "en":
        return "♿ **Accessibility:** The venue is equipped with step-free ramps at all main entries and pavilions, accessible restrooms, and paved circulation routes.";
      case "pt":
        return "♿ **Acessibilidade:** O evento conta com rampas de acesso em todos os pavilhões, banheiros adaptados e caminhos pavimentados.";
      case "zh":
        return "♿ **无障碍服务：** 展会所有主要展馆和通道均铺设了无障碍坡道，并设有无障碍洗手间。";
      default:
        return "♿ **Accesibilidad:** Todo el predio de Ciudad Cultural está adaptado con rampas de acceso en los ingresos y pabellones, sanitarios acondicionados y senderos pavimentados para personas con movilidad reducida.";
    }
  }

  // 8. Contacto y Organización
  if (
    norm.includes("contacto") ||
    norm.includes("telefono") ||
    norm.includes("email") ||
    norm.includes("mail") ||
    norm.includes("camara") ||
    norm.includes("organiza") ||
    norm.includes("contact") ||
    norm.includes("phone") ||
    norm.includes("联系")
  ) {
    switch (locale) {
      case "en":
        return "📞 **Contact & Organizer:** ExpoJuy is organized by the **Jujuy Foreign Trade Chamber** (Belgrano 860, 2nd floor, San Salvador de Jujuy). Tel: +54 388 423-3539, Email: camaradecomercioexterior@gmail.com, WhatsApp: +54 9 388 421-2955.";
      case "pt":
        return "📞 **Contato e Organização:** Organizado pela **Câmara de Comércio Exterior de Jujuy**. Tel: +54 388 423-3539, Email: camaradecomercioexterior@gmail.com, WhatsApp: +54 9 388 421-2955.";
      case "zh":
        return "📞 **联系方式：** 主办方为胡胡伊对外贸易商会（Belgrano 860, 2º piso）。电话：+54 388 423-3539，电子邮箱：camaradecomercioexterior@gmail.com，WhatsApp：+54 9 388 421-2955。";
      default:
        return "📞 **Contacto y Organización:** La organizadora es la **Cámara de Comercio Exterior de Jujuy** (Belgrano 860, 2º piso, San Salvador de Jujuy). Teléfono: +54 388 423-3539, Email: camaradecomercioexterior@gmail.com, WhatsApp: +54 9 388 421-2955.";
    }
  }

  return null;
}

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
    const presetAnswer = matchFrequentQuestion(trimmedMessage, locale);

    if (presetAnswer) {
      return NextResponse.json({
        response: presetAnswer,
        conversation: [
          ...conversation,
          { role: "user", content: trimmedMessage },
          { role: "assistant", content: presetAnswer },
        ],
      });
    }

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
