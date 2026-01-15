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
  - Nunca confunda seu nome com criptomoedas ou leitura de íris.
  - Use a pesquisa web apenas para fatos, clima ou notícias. Se a busca disser algo, confie nela.
  - Aceite correções do usuário na hora.`;

  // Carrega o histórico e evita que mensagens sumam
  useEffect(() => {
    if (convHook.currentConversationId) {
      convHook.loadConversation(convHook.currentConversationId).then(msgs => {
        if (msgs) setMessages(msgs);
      });
    }
  }, [convHook.currentConversationId]);

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMsg = { id: Date.now().toString(), content, role: "user" };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // 1. Tenta funções locais (Spotify, Mapas, Discador, Youtube)
      const brainResponse = await irisBrain(content, async (t) => t);
      
      if (brainResponse) {
        const assistantMsg = { id: "a" + Date.now(), content: brainResponse, role: "assistant" };
        setMessages([...updatedMessages, assistantMsg]);
        if (user) await convHook.saveMessagesToConversation([...updatedMessages, assistantMsg]);
      } else {
        // 2. Só pesquisa se houver necessidade real
        const needsSearch = /(clima|tempo|notícia|quem|onde|preço|cotação|política|como está)/i.test(content);
        let extraInfo = "";

        if (needsSearch && content.length > 5) {
            // Refina a busca para não pegar lixo sobre cripto
            const query = content.toLowerCase().includes("você") 
              ? "quem é a inteligência artificial ÍRIS do Lucélio" 
              : `${content} hoje 2026`;
            extraInfo = await webSearch(query);
        }
        
        const response = await grokService.chat([
          { role: "system", content: IRIS_PROMPT },
          ...updatedMessages, 
          { role: "user", content: extraInfo ? `DADOS REAIS (HOJE): ${extraInfo}\n\nPERGUNTA: ${content}` : content }
        ].map(m => ({ role: m.role, content: m.content })));

        const assistantMsg = { id: "a" + Date.now(), content: response, role: "assistant" };
        setMessages([...updatedMessages, assistantMsg]);
        
        if (user) await convHook.saveMessagesToConversation([...updatedMessages, assistantMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  }, [messages, user, convHook]);

  const { isActive, toggleAlwaysOn } = useAlwaysOnVoice(handleSend);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex h-screen w-full bg-[#0a0f1a] overflow-hidden">
      {/* SIDEBAR QUE EMPURRA O CHAT (80/20) */}
      {convHook.isSidebarOpen && (
        <aside className="w-80 h-full flex-shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl z-20">
          {user && (
            <ConversationSidebar 
              user={user} 
              conversations={convHook.conversations || []} 
              currentConversationId={convHook.currentConversationId} 
              onSelectConversation={(id) => convHook.loadConversation(id).then(setMessages)} 
              onNewConversation={() => {
                convHook.createNewConversation();
                setMessages([{ id: "init", content: "Manda a boa!", role: "assistant" }]);
              }} 
              onDeleteConversation={convHook.deleteConversation}
            />
          )}
        </aside>
      )}

      {/* ÁREA DE CHAT - FLEX-1 GARANTE QUE O CHAT USE O ESPAÇO RESTANTE */}
      <div className="flex flex-col flex-1 relative min-w-0 transition-all duration-300">
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
          {isActive && (
            <div className="flex justify-center p-2">
              <div className="bg-cyan-500/20 text-cyan-400 text-[10px] px-4 py-2 rounded-full animate-pulse border border-cyan-500/30">
                ÍRIS OUVINDO...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 md:p-6 bg-transparent">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={handleSend} onMicClick={toggleAlwaysOn} isMicActive={isActive} disabled={isTyping} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatContainer;