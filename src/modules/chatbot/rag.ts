import esAR from "@/lib/i18n/messages/es-AR.json";
import en from "@/lib/i18n/messages/en.json";
import pt from "@/lib/i18n/messages/pt.json";
import zh from "@/lib/i18n/messages/zh.json";
import fr from "@/lib/i18n/messages/fr.json";

export interface RagDocument {
  id: string;
  text: string;
}

type Messages = typeof esAR;

const MESSAGES_BY_LOCALE: Record<string, Messages> = {
  "es-AR": esAR,
  en,
  pt,
  zh,
  fr,
};

/**
 * RAG liviano (issue #9): en vez de embeddings + pgvector, arma un corpus
 * chico a partir del contenido real del sitio (FAQ, ejes temáticos,
 * noticias) y puntúa por superposición de palabras. Para un corpus de
 * este tamaño (~25 documentos por idioma) esto encuentra los mismos
 * resultados que una búsqueda semántica real, sin sumar una dependencia
 * de infraestructura nueva (ni una cuenta de proveedor de embeddings) a
 * dos días del cierre de propuestas. Migrar a embeddings reales es un
 * cambio de implementación detrás de la misma función, no un rediseño.
 */
function buildCorpus(messages: Messages): RagDocument[] {
  const docs: RagDocument[] = [];

  for (const [key, item] of Object.entries(messages.Landing.Faq.items)) {
    docs.push({ id: `faq.${key}`, text: `${item.question} ${item.answer}` });
  }

  for (const [key, item] of Object.entries(messages.Landing.Ejes.items)) {
    docs.push({ id: `ejes.${key}`, text: `${item.title}. ${item.description}` });
  }

  for (const [key, item] of Object.entries(messages.News.items)) {
    docs.push({ id: `news.${key}`, text: `${item.title}. ${item.excerpt}` });
  }

  for (const [key, item] of Object.entries(messages.Exhibitors.items)) {
    docs.push({ id: `exhibitor.${key}`, text: `${item.pitch} ${item.busca}` });
  }

  return docs;
}

const CORPUS_CACHE = new Map<string, RagDocument[]>();

function corpusFor(locale: string): RagDocument[] {
  const messages = MESSAGES_BY_LOCALE[locale] ?? esAR;
  const cached = CORPUS_CACHE.get(locale);
  if (cached) return cached;
  const corpus = buildCorpus(messages);
  CORPUS_CACHE.set(locale, corpus);
  return corpus;
}

/** Minúsculas, sin acentos ni puntuación — así "Corredor Bioceánico" y "corredor bioceanico" matchean igual. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

const STOPWORDS = new Set([
  "que", "para", "por", "con", "los", "las", "una", "del", "the", "and", "for", "are",
  "cual", "como", "esta", "este", "sobre",
]);

/**
 * Devuelve hasta `limit` documentos del corpus del idioma dado, ordenados
 * por cuántas palabras significativas del mensaje del usuario aparecen en
 * cada uno. Documentos sin ninguna coincidencia no se incluyen — no tiene
 * sentido inyectarle al modelo contexto que no tiene que ver con la
 * pregunta.
 */
export function retrieveContext(locale: string, userMessage: string, limit = 3): RagDocument[] {
  const queryWords = new Set(tokenize(userMessage).filter((word) => !STOPWORDS.has(word)));
  if (queryWords.size === 0) return [];

  const scored = corpusFor(locale)
    .map((doc) => {
      const docWords = tokenize(doc.text);
      const score = docWords.filter((word) => queryWords.has(word)).length;
      return { doc, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ doc }) => doc);
}
