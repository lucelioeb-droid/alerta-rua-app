// src/components/ConversationItem.tsx
// Item individual de conversa na sidebar

import { useState } from "react";
import { Conversation, ConversationCategory } from "@/types/conversation";
import {
  MessageSquare,
  Cloud,
  Newspaper,
  MapPin,
  Music,
  Mail,
  DollarSign,
  MoreVertical,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

const categoryIcons: Record<ConversationCategory, any> = {
  general: MessageSquare,
  weather: Cloud,
  news: Newspaper,
  maps: MapPin,
  music: Music,
  cep: Mail,
  economy: DollarSign,
  other: MessageSquare,
};

const ConversationItem = ({
  conversation,
  isActive,
  onClick,
  onRename,
  onDelete,
}: ConversationItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const [showMenu, setShowMenu] = useState(false);

  const Icon = categoryIcons[conversation.category || "general"];

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== conversation.title) {
      onRename(conversation.id, editTitle.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm(`Deletar conversa "${conversation.title}"?`)) {
      onDelete(conversation.id);
      setShowMenu(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return "agora";
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "ontem";
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <div
      className={`group relative p-3 rounded-lg cursor-pointer iris-transition ${
        isActive
          ? "bg-iris-accent text-iris-accent-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <Icon size={16} className="mt-1 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setEditTitle(conversation.title);
                  }
                }}
                className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded"
                autoFocus
              />
              <button
                onClick={handleRename}
                className="p-1 hover:bg-background rounded"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(conversation.title);
                }}
                className="p-1 hover:bg-background rounded"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">
                  {conversation.title}
                </h3>
                <p className="text-xs opacity-60 mt-0.5">
                  {conversation.messageCount} {conversation.messageCount === 1 ? "mensagem" : "mensagens"} · {formatDate(conversation.updatedAt)}
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-background/50 rounded iris-transition"
                >
                  <MoreVertical size={14} />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-6 z-20 bg-popover border border-border rounded-lg shadow-lg min-w-[140px] overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted iris-transition"
                      >
                        <Edit2 size={14} />
                        Renomear
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 iris-transition"
                      >
                        <Trash2 size={14} />
                        Deletar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;