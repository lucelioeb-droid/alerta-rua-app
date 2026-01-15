import { User } from "firebase/auth";
import { Plus, MessageSquare, Trash2 } from "lucide-react";

interface ConversationSidebarProps {
  user: User;
  currentConversationId: string | null;
  conversations: any[]; 
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationSidebar = ({ 
  user, 
  currentConversationId, 
  conversations = [], 
  onSelectConversation, 
  onNewConversation,
  onDeleteConversation
}: ConversationSidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl w-80 border-r border-white/5">
      <div className="p-4 border-b border-white/10">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(8,145,178,0.3)]"
        >
          <Plus size={18} />
          Nova Conversa
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        <p className="px-3 py-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">Histórico de Memória</p>
        
        {(!conversations || conversations.length === 0) ? (
          <div className="px-4 py-8 text-center text-gray-600 italic text-xs">Aguardando registros...</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                currentConversationId === conv.id ? 'bg-cyan-500/20 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={14} className={currentConversationId === conv.id ? 'text-cyan-400' : 'text-gray-500'} />
                <span className="text-xs text-gray-300 truncate">{conv.title || "Conversa Sem Título"}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-xs font-bold uppercase">
            {user.displayName?.[0] || user.email?.[0] || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-white truncate">{user.displayName || user.email?.split('@')[0] || "Usuário"}</p>
            <p className="text-[7px] text-cyan-500/60 uppercase tracking-widest">Sessão Ativa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;