import { useState, useCallback, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/services/firebase"; 
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, limit } from "firebase/firestore";
import { conversationService } from "@/services/conversationService";
import { toast } from "sonner";

export const useConversations = (user: User | null) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadConversationsList = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "conversations"),
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(fetched);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  }, [user]);

  useEffect(() => {
    loadConversationsList();
  }, [loadConversationsList, currentConversationId]);

  const saveMessagesToConversation = useCallback(
    async (messages: any[]) => {
      if (!user || messages.length <= 1) return;
      try {
        const convMsgs = messages
          .filter(m => m.id !== "init")
          .map(m => ({ id: m.id, content: m.content, role: m.role, timestamp: Date.now() }));

        if (!currentConversationId) {
          const firstUserMsg = convMsgs.find(m => m.role === "user");
          if (firstUserMsg) {
            const newId = await conversationService.createConversation(user.uid, firstUserMsg);
            setCurrentConversationId(newId);
          }
        } else {
          const lastMsg = convMsgs[convMsgs.length - 1];
          if (lastMsg) await conversationService.addMessage(currentConversationId, lastMsg);
        }
      } catch (e) { console.error("Erro ao salvar:", e); }
    }, [user, currentConversationId]);

  const loadConversation = useCallback(async (id: string) => {
    const conv = conversations.find(c => c.id === id);
    // PROTEÇÃO CRÍTICA: Se a conversa não tiver mensagens, retorna lista vazia em vez de dar erro
    if (!conv || !conv.messages) return []; 
    
    setCurrentConversationId(id);
    return conv.messages.map((m: any) => ({
      id: m.id,
      content: m.content,
      role: m.role,
      isNew: false
    }));
  }, [conversations]);

  const createNewConversation = useCallback(() => {
    setCurrentConversationId(null);
    setIsSidebarOpen(false);
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "conversations", id));
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConversationId === id) setCurrentConversationId(null);
      toast.success("Conversa excluída");
    } catch (e) { toast.error("Erro ao excluir"); }
  }, [currentConversationId]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  return {
    conversations,
    currentConversationId,
    isSidebarOpen,
    saveMessagesToConversation,
    loadConversation,
    createNewConversation,
    deleteConversation,
    toggleSidebar,
  };
};