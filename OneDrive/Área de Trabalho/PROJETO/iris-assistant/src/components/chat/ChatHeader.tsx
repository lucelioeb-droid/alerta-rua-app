import { Cpu } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="flex items-center gap-3 pointer-events-none select-none">
      <div className="relative">
        <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur-sm"></div>
        <Cpu className="w-6 h-6 text-cyan-400 relative" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-sm font-bold tracking-widest text-white uppercase italic leading-none">
          ÍRIS <span className="text-cyan-500 text-[10px] ml-1">v2.7</span>
        </h1>
      </div>
    </div>
  );
};

export default ChatHeader;