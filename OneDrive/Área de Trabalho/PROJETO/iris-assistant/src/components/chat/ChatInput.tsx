import { useState } from "react";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onMicClick: () => void;
  isMicActive: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSend, onMicClick, isMicActive, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Manda a boa..."
        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 text-sm py-3 ml-2"
        disabled={disabled}
      />

      <button
        type="button"
        onClick={onMicClick}
        className={`p-3 rounded-xl transition-all ${isMicActive ? 'text-red-500 bg-red-500/10 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-cyan-400 hover:bg-cyan-500/10'}`}
      >
        <Mic size={20} />
      </button>

      <button type="submit" disabled={!message.trim() || disabled} className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;