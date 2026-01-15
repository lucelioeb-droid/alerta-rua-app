// src/services/firestoreService.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface FirestoreMessage {
  id?: string;
  userId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Timestamp;
}

export class FirestoreService {
  private messagesCollection = collection(db, "messages");

  // Salvar mensagem
  async saveMessage(
    userId: string,
    content: string,
    role: "user" | "assistant"
  ): Promise<void> {
    try {
      await addDoc(this.messagesCollection, {
        userId,
        content,
        role,
        timestamp: Timestamp.now(),
      });
      console.log("💾 Mensagem salva na nuvem");
    } catch (error) {
      console.error("❌ Erro ao salvar mensagem:", error);
      throw error;
    }
  }

  // Carregar mensagens do usuário
  async loadMessages(userId: string): Promise<FirestoreMessage[]> {
    try {
      const q = query(
        this.messagesCollection,
        where("userId", "==", userId),
        orderBy("timestamp", "asc")
      );

      const snapshot = await getDocs(q);
      const messages: FirestoreMessage[] = [];

      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as FirestoreMessage);
      });

      console.log(`📥 ${messages.length} mensagens carregadas`);
      return messages;
    } catch (error) {
      console.error("❌ Erro ao carregar mensagens:", error);
      return [];
    }
  }

  // Limpar todas as mensagens do usuário
  async clearMessages(userId: string): Promise<void> {
    try {
      const q = query(
        this.messagesCollection,
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((document) =>
        deleteDoc(doc(db, "messages", document.id))
      );

      await Promise.all(deletePromises);
      console.log("🗑️ Mensagens limpas da nuvem");
    } catch (error) {
      console.error("❌ Erro ao limpar mensagens:", error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();