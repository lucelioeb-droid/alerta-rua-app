// src/components/chat/AlwaysOnVoiceButton.tsx

import { Mic, MicOff } from "lucide-react";

interface AlwaysOnVoiceButtonProps {
  isActive: boolean;
  status: "inactive" | "listening" | "detected" | "processing";
  onToggle: () => void;
  disabled?: boolean;
}

const AlwaysOnVoiceButton = ({ isActive, status, onToggle, disabled }: AlwaysOnVoiceButtonProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* 🌊 ONDAS SONORAS (Aparecem apenas quando está ouvindo ou detectou voz) */}
      {isActive && (status === "listening" || status === "detected") && (
        <>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
          <span className="absolute inline-flex h-12 w-12 animate-pulse rounded-full bg-blue-500 opacity-50"></span>
          
          {/* Onda extra se detectar voz (fica mais "agitada") */}
          {status === "detected" && (
            <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-yellow-400 opacity-40"></span>
          )}
        </>
      )}

      {/* BOTÃO PRINCIPAL */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative z-10 p-3 rounded-full transition-all duration-300 ${
          !isActive 
            ? "bg-gray-200 text-gray-500 hover:bg-gray-300" 
            : status === "processing"
            ? "bg-purple-600 text-white animate-spin"
            : status === "detected"
            ? "bg-yellow-500 text-white"
            : "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
        } disabled:opacity-50`}
        title={isActive ? "Desativar Always-On" : "Ativar Always-On (Modo Alexa)"}
      >
        {isActive ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* ETIQUETA DE STATUS (OPCIONAL) */}
      {isActive && (
        <span className="absolute -bottom-8 text-[10px] font-bold uppercase tracking-widest text-blue-500 animate-pulse">
          {status}
        </span>
      )}
    </div>
  );
};

export default AlwaysOnVoiceButton;