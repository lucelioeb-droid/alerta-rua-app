// Serviço de armazenamento local de conversas

export interface StoredMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

const STORAGE_KEY = "iris_conversations";

export class StorageService {
  saveMessages(messages: StoredMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Erro ao salvar mensagens:", error);
    }
  }

  loadMessages(): StoredMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      return [];
    }
  }

  clearMessages(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar mensagens:", error);
    }
  }

  exportMessages(messages: StoredMessage[]): void {
    const exportData = {
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp).toLocaleString("pt-BR"),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iris-conversa-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();