import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/services/firebase";

export interface FirestoreMessage {
  id?: string;
  userId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Timestamp | any;
}

export class FirestoreService {
  private conversationsCollection = "conversations";

  // Salvar mensagem
  async saveMessage(userId: string, content: string, role: "user" | "assistant"): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.conversationsCollection), {
        userId,
        content,
        role,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
      throw new Error("Falha ao salvar mensagem");
    }
  }

  // Carregar mensagens do usuário
  async loadMessages(userId: string): Promise<FirestoreMessage[]> {
    try {
      const q = query(
        collection(db, this.conversationsCollection),
        where("userId", "==", userId),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      const messages: FirestoreMessage[] = [];

      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as FirestoreMessage);
      });

      return messages;
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      throw new Error("Falha ao carregar mensagens");
    }
  }

  // Observar mensagens em tempo real
  onMessagesChange(userId: string, callback: (messages: FirestoreMessage[]) => void) {
    const q = query(
      collection(db, this.conversationsCollection),
      where("userId", "==", userId),
      orderBy("timestamp", "asc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages: FirestoreMessage[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as FirestoreMessage);
      });
      callback(messages);
    });
  }

  // Deletar todas as mensagens do usuário
  async deleteAllMessages(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.conversationsCollection),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, this.conversationsCollection, docSnapshot.id))
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Erro ao deletar mensagens:", error);
      throw new Error("Falha ao deletar mensagens");
    }
  }

  // Deletar mensagem específica
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.conversationsCollection, messageId));
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      throw new Error("Falha ao deletar mensagem");
    }
  }
}

export const firestoreService = new FirestoreService();