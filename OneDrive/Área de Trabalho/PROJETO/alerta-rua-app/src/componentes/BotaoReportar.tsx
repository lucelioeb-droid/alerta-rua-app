import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alertTypeConfig, AlertType } from '../tipos/alert';
import { useLocalizacao } from '../ganchos/useLocalizacao';

export default function BotaoReportar({ onReport }: { onReport: (type: AlertType, lat: number, lng: number) => void }) {
  const [aberto, setAberto] = useState(false);
  const coords = useLocalizacao();

  const handleAction = (type: AlertType) => {
    if (coords) {
      onReport(type, coords[0], coords[1]);
      setAberto(false);
    } else {
      alert("Aguardando sinal do GPS...");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[2000]">
      <AnimatePresence>
        {aberto && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 bg-black/95 border border-white/10 p-4 rounded-sm shadow-2xl w-64"
          >
            <p className="text-[10px] text-yellow-500 font-mono mb-4 uppercase tracking-widest text-center italic font-bold">Transmitir Alerta</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(alertTypeConfig) as AlertType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleAction(type)}
                  className="flex flex-col items-center p-3 bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                >
                  <span className="text-xl">{alertTypeConfig[type].icon}</span>
                  <span className="text-[9px] text-white mt-1 uppercase">{alertTypeConfig[type].label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setAberto(!aberto)}
        className="w-16 h-16 bg-yellow-500 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-95 transition-transform"
      >
        {aberto ? '✕' : '🚨'}
      </button>
    </div>
  );
}