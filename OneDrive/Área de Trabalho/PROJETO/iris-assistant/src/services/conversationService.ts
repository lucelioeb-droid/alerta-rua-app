// src/services/conversationService.ts
// Serviço para gerenciar conversas no Firestore

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy,
  where 
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Conversation, Message, detectCategory, generateTitle } from "@/types/conversation";

const CONVERSATIONS_COLLECTION = "conversations";

class ConversationService {
  /**
   * Salva uma conversa no Firestore
   */
  async saveConversation(
    userId: string, 
    conversationId: string, 
    messages: Message[]
  ): Promise<void> {
    if (!userId || messages.length === 0) return;

    try {
      const conversationRef = doc(
        db, 
        CONVERSATIONS_COLLECTION, 
        `${userId}_${conversationId}`
      );

      // Gera título da primeira mensagem do usuário
      const firstUserMessage = messages.find(m => m.role === "user");
      const title = firstUserMessage 
        ? generateTitle(firstUserMessage.content) 
        : "Nova conversa";

      // Detecta categoria baseada no conteúdo
      const category = firstUserMessage 
        ? detectCategory(firstUserMessage.content) 
        : "general";

      const conversation: Conversation = {
        id: conversationId,
        title,
        messages,
        createdAt: messages[0]?.timestamp || Date.now(),
        updatedAt: Date.now(),
        category,
        messageCount: messages.length,
      };

      await setDoc(conversationRef, {
        ...conversation,
        userId, // Adiciona userId para queries
      });
    } catch (error) {
      console.error("Erro ao salvar conversa:", error);
      throw new Error("Falha ao salvar conversa no Firestore");
    }
  }

  /**
   * Carrega todas as conversas de um usuário
   */
  async loadConversations(userId: string): Promise<Conversation[]> {
    if (!userId) return [];

    try {
      const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
      const q = query(
        conversationsRef,
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const conversations: Conversation[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          id: data.id,
          title: data.title,
          messages: data.messages || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          category: data.category || "general",
          messageCount: data.messageCount || 0,
        });
      });

      return conversations;
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
      throw new Error("Falha ao carregar conversas do Firestore");
    }
  }

  /**
   * Carrega uma conversa específica
   */
  async loadConversation(
    userId: string, 
    conversationId: string
  ): Promise<Conversation | null> {
    if (!userId || !conversationId) return null;

    try {
      const conversationRef = doc(
        db, 
        CONVERSATIONS_COLLECTION, 
        `${userId}_${conversationId}`
      );
      const snapshot = await getDoc(conversationRef);

      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        id: data.id,
        title: data.title,
        messages: data.messages || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        category: data.category || "general",
        messageCount: data.messageCount || 0,
      };
    } catch (error) {
      console.error("Erro ao carregar conversa:", error);
      throw new Error("Falha ao carregar conversa do Firestore");
    }
  }

  /**
   * Renomeia uma conversa
   */
  async renameConversation(conversationId: string, newTitle: string): Promise<void> {
    try {
      // Busca o documento para pegar o userId
      const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
      const q = query(conversationsRef, where("id", "==", conversationId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Conversa não encontrada");
      }

      const docId = snapshot.docs[0].id;
      const conversationRef = doc(db, CONVERSATIONS_COLLECTION, docId);

      await updateDoc(conversationRef, {
        title: newTitle,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Erro ao renomear conversa:", error);
      throw new Error("Falha ao renomear conversa");
    }
  }

  /**
   * Deleta uma conversa
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      // Busca o documento para pegar o userId
      const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
      const q = query(conversationsRef, where("id", "==", conversationId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Conversa não encontrada");
      }

      const docId = snapshot.docs[0].id;
      const conversationRef = doc(db, CONVERSATIONS_COLLECTION, docId);

      await deleteDoc(conversationRef);
    } catch (error) {
      console.error("Erro ao deletar conversa:", error);
      throw new Error("Falha ao deletar conversa");
    }
  }

  /**
   * Atualiza o timestamp de uma conversa (marca como recém-acessada)
   */
  async touchConversation(conversationId: string): Promise<void> {
    try {
      const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
      const q = query(conversationsRef, where("id", "==", conversationId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, docId);
        await updateDoc(conversationRef, { updatedAt: Date.now() });
      }
    } catch (error) {
      console.error("Erro ao atualizar timestamp da conversa:", error);
    }
  }

  /**
   * Cria uma nova conversa com a primeira mensagem
   */
  async createConversation(userId: string, firstMessage: Message): Promise<string> {
    const conversationId = `conv_${Date.now()}`;
    
    try {
      await this.saveConversation(userId, conversationId, [firstMessage]);
      return conversationId;
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
      throw new Error("Falha ao criar conversa");
    }
  }

  /**
   * Adiciona uma mensagem a uma conversa existente
   */
  async addMessage(conversationId: string, message: Message): Promise<void> {
    try {
      const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
      const q = query(conversationsRef, where("id", "==", conversationId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Conversa não encontrada");
      }

      const docId = snapshot.docs[0].id;
      const conversationRef = doc(db, CONVERSATIONS_COLLECTION, docId);
      const currentData = snapshot.docs[0].data();

      const updatedMessages = [...(currentData.messages || []), message];

      await updateDoc(conversationRef, {
        messages: updatedMessages,
        messageCount: updatedMessages.length,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Erro ao adicionar mensagem:", error);
      throw new Error("Falha ao adicionar mensagem");
    }
  }
}

export const conversationService = new ConversationService();