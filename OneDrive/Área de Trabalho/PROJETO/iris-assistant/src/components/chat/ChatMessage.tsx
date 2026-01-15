import React from 'react';

const ChatMessage = ({ content, role }: { content: string, role: 'user' | 'assistant' }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 px-2`}>
      <div className={`max-w-[88%] px-5 py-3 shadow-2xl relative overflow-hidden ${
        isUser 
          ? 'bg-blue-600/20 border border-blue-500/40 text-blue-50 rounded-2xl rounded-tr-none' 
          : 'bg-slate-900/60 backdrop-blur-xl border border-white/10 text-slate-100 rounded-2xl rounded-tl-none'
      }`}>
        {/* Pequeno detalhe de design nos cantos */}
        <div className={`absolute top-0 ${isUser ? 'right-0' : 'left-0'} w-1 h-3 bg-cyan-400/50`}></div>
        
        <p className="text-sm md:text-base leading-relaxed tracking-wide font-medium">
          {content}
        </p>
        
        <div className={`text-[9px] mt-2 opacity-30 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;