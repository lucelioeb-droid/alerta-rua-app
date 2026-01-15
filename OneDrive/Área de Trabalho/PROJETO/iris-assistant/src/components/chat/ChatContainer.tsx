import { useState, useRef, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SettingsDialog from "./SettingsDialog";
import LoginButton from "./LoginButton";
import ConversationSidebar from "./ConversationSidebar";
import { StatusDashboard } from "./StatusDashboard"; 
import { grokService } from "@/services/grok";
import { irisBrain } from "@/services/brain/irisBrain";
import { webSearch } from "@/services/search";
import { useConversations } from "@/hooks/useConversations";
import { useAlwaysOnVoice } from "@/hooks/useAlwaysOnVoice";
import { Menu } from "lucide-react";

const ChatContainer = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const convHook = useConversations(user);

  // SUA IDENTIDADE: Natural, humana e sem alucinações
  const IRIS_PROMPT = `Você é a ÍRIS. Fale como uma pessoa real, educada e prestativa.
  Diretrizes:
  - Linguagem simples, direta e frases curtas.
  - Se o usuário apenas saudar (Oi, Boa noite), responda naturalmente sem pesquisar nada.
  - Nunca invente informações. Se não souber, use a busca.
  - Você é uma assistente de IA, mas sua personalidade é calorosa.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (convHook.currentConversation?.messages) {
      setMessages(convHook.currentConversation.messages);
    } else {
      setMessages([]);
    }
  }, [convHook.currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage = { id: Date.now().toString(), content, role: "user" as const };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // 1. Decisão da ÍRIS: Precisa de busca?
      const searchAnalysis = await irisBrain.analyzeNeedForSearch(content, messages);
      
      let context = "";
      if (searchAnalysis.shouldSearch) {
        const searchResults = await webSearch.search(searchAnalysis.query);
        context = `\n\nResultados da busca em tempo real:\n${searchResults}`;
      }

      // 2. Resposta via Grok
      const response = await grokService.chat([
        { role: "system", content: IRIS_PROMPT + context },
        ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
      ]);

      const assistantMessage = { 
        id: (Date.now() + 1).toString(), 
        content: response, 
        role: "assistant" as const 
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // 3. Salva no Firebase (Agora com o ID correto)
      if (convHook.currentConversation?.id) {
        await convHook.updateMessages(convHook.currentConversation.id, finalMessages);
      }
    } catch (error) {
      console.error("Erro na ÍRIS:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const { isActive } = useAlwaysOnVoice(handleSendMessage);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <ConversationSidebar 
        isOpen={convHook.isSidebarOpen} 
        onClose={() => convHook.setIsSidebarOpen(false)}
        conversations={convHook.conversations}
        currentId={convHook.currentConversation?.id}
        onSelect={convHook.selectConversation}
        onDelete={convHook.deleteConversation}
        onNew={convHook.createNewConversation}
      />

      <div className="flex-1 flex flex-col relative w-full">
        <header className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={convHook.toggleSidebar} className="p-2 hover:bg-cyan-500/10 rounded-lg text-cyan-400">
              <Menu size={24} />
            </button>
            <ChatHeader />
          </div>
          <div className="flex items-center gap-4">
            <SettingsDialog apiKey={grokService.getApiKey()} onSave={(k) => grokService.setApiKey(k)} />
            <LoginButton onUserChange={setUser} />
          </div>
        </header>

        <StatusDashboard />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 custom-scrollbar">
          {messages.map((m) => <ChatMessage key={m.id} content={m.content} role={m.role} />)}
          {isTyping && (
            <div className="flex gap-2 p-4 bg-white/5 rounded-2xl w-fit animate-pulse">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto">
            <ChatInput 
              onSend={handleSendMessage} 
              disabled={isTyping} 
              placeholder="ÍRIS ONLINE: Como posso ajudar agora?"
            />
            <p className="text-center text-[10px] text-white/30 mt-4 tracking-widest uppercase">
              Powered by Grok & Google Search • 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatContainer;