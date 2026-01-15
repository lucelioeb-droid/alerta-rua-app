// Apenas o conteúdo visual dos cards, sem botões de histórico ou janelas
import { Cloud, TrendingUp, Newspaper } from "lucide-react";

export const StatusDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-4 bg-black/20 border-b border-white/5">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        <Cloud className="text-blue-400 w-5 h-5" />
        <div>
          <p className="text-[10px] uppercase text-gray-500 font-bold">Clima</p>
          <p className="text-xs text-white">28°C - Feira de Santana</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        <TrendingUp className="text-green-400 w-5 h-5" />
        <div>
          <p className="text-[10px] uppercase text-gray-500 font-bold">Câmbio</p>
          <p className="text-xs text-white">USD: R$ 5,37 | BTC: R$ 489.030</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        <Newspaper className="text-purple-400 w-5 h-5" />
        <div>
          <p className="text-[10px] uppercase text-gray-500 font-bold">Última Hora</p>
          <p className="text-xs text-white truncate italic">"Notícias atualizadas via Stream"</p>
        </div>
      </div>
    </div>
  );
};