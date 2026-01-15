// src/types/conversation.ts
// Tipos para o sistema de conversas

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  category?: ConversationCategory;
  messageCount: number;
}

export type ConversationCategory = 
  | "general"
  | "weather"
  | "news"
  | "maps"
  | "music"
  | "cep"
  | "economy"
  | "other";

export interface ConversationGroup {
  label: string;
  conversations: Conversation[];
}

// Helper para detectar categoria baseado no conteúdo
export function detectCategory(content: string): ConversationCategory {
  const lower = content.toLowerCase();
  
  if (lower.includes("clima") || lower.includes("tempo") || lower.includes("temperatura")) {
    return "weather";
  }
  if (lower.includes("notícia") || lower.includes("noticia") || lower.includes("manchete")) {
    return "news";
  }
  if (lower.includes("onde") || lower.includes("localização") || lower.includes("mapa")) {
    return "maps";
  }
  if (lower.includes("música") || lower.includes("musica") || lower.includes("toca") || lower.includes("spotify")) {
    return "music";
  }
  if (/\d{5}-?\d{3}/.test(content)) {
    return "cep";
  }
  if (lower.includes("dólar") || lower.includes("dolar") || lower.includes("cotação") || lower.includes("bitcoin")) {
    return "economy";
  }
  
  return "general";
}

// Helper para gerar título automaticamente
export function generateTitle(firstMessage: string): string {
  const clean = firstMessage.replace(/^(íris,?\s*|hey íris,?\s*)/i, "").trim();
  
  // Limita a 50 caracteres
  if (clean.length > 50) {
    return clean.substring(0, 50) + "...";
  }
  
  return clean || "Nova conversa";
}

// Helper para agrupar conversas por data
export function groupConversationsByDate(conversations: Conversation[]): ConversationGroup[] {
  const now = Date.now();
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000; // 24h atrás
  const lastWeek = today - 604800000; // 7 dias atrás
  const lastMonth = today - 2592000000; // 30 dias atrás

  const groups: ConversationGroup[] = [
    { label: "Hoje", conversations: [] },
    { label: "Ontem", conversations: [] },
    { label: "Últimos 7 dias", conversations: [] },
    { label: "Últimos 30 dias", conversations: [] },
    { label: "Mais antigas", conversations: [] },
  ];

  conversations.forEach((conv) => {
    const convTime = new Date(conv.updatedAt).setHours(0, 0, 0, 0);

    if (convTime === today) {
      groups[0].conversations.push(conv);
    } else if (convTime === yesterday) {
      groups[1].conversations.push(conv);
    } else if (conv.updatedAt >= lastWeek) {
      groups[2].conversations.push(conv);
    } else if (conv.updatedAt >= lastMonth) {
      groups[3].conversations.push(conv);
    } else {
      groups[4].conversations.push(conv);
    }
  });

  // Remove grupos vazios
  return groups.filter((g) => g.conversations.length > 0);
}