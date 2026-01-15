// src/conversation.ts
// Lógica de gerenciamento de histórico e categorias

import { Message, Conversation, ConversationCategory, ConversationGroup } from "./types/conversation"; // Mantive o import caso os tipos ainda estejam lá

/**
 * Detecta a categoria da conversa de forma inteligente para evitar bloqueios
 */
export function detectCategory(content: string): ConversationCategory {
  const lower = content.toLowerCase();
  
  // Prioriza Mapas apenas se houver intenção clara de navegação
  if ((lower.includes("onde") || lower.includes("mapa") || lower.includes("rota") || lower.includes("caminho")) && 
      (lower.includes("ir") || lower.includes("chegar") || lower.includes("como") || lower.includes("trânsito"))) {
    return "maps";
  }
  
  if (lower.includes("clima") || lower.includes("tempo") || lower.includes("temperatura")) {
    return "weather";
  }
  
  if (lower.includes("notícia") || lower.includes("noticia") || lower.includes("aconteceu")) {
    return "news";
  }
  
  if (lower.includes("música") || lower.includes("musica") || lower.includes("spotify") || lower.includes("toca")) {
    return "music";
  }
  
  if (/\d{5}-?\d{3}/.test(content)) {
    return "cep";
  }
  
  if (lower.includes("dólar") || lower.includes("cotação") || lower.includes("bitcoin") || lower.includes("moeda")) {
    return "economy";
  }
  
  return "general";
}

/**
 * Gera um título limpo para a conversa, removendo o nome da ÍRIS do início
 */
export function generateTitle(firstMessage: string): string {
  const clean = firstMessage
    .replace(/^(íris,?\s*|hey íris,?\s*|iris,?\s*)/i, "")
    .trim();
  
  return clean.length > 40 ? clean.substring(0, 40) + "..." : clean || "Nova conversa";
}

/**
 * FORMATAÇÃO ANTI-REDUNDÂNCIA:
 * Prepara o histórico para a IA sem repetir mensagens desnecessárias
 */
export function formatChatHistory(messages: Message[]) {
  return messages.map(m => ({
    role: m.role,
    content: m.content.trim()
  }));
}

/**
 * Agrupa as conversas por data para o Sidebar
 */
export function groupConversationsByDate(conversations: Conversation[]): ConversationGroup[] {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000;

  const groups: ConversationGroup[] = [
    { label: "Hoje", conversations: [] },
    { label: "Ontem", conversations: [] },
    { label: "Mais antigas", conversations: [] },
  ];

  conversations.forEach((conv) => {
    const convTime = new Date(conv.updatedAt).setHours(0, 0, 0, 0);

    if (convTime === today) {
      groups[0].conversations.push(conv);
    } else if (convTime === yesterday) {
      groups[1].conversations.push(conv);
    } else {
      groups[2].conversations.push(conv);
    }
  });

  return groups.filter((g) => g.conversations.length > 0);
}