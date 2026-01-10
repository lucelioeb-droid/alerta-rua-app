import { useLocalizacao } from '../ganchos/useLocalizacao';

export default function HUD() {
  const coords = useLocalizacao();

  return (
    <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none font-mono">
      <div className="bg-black/70 backdrop-blur-md border border-white/10 p-4 text-[10px] text-green-500 uppercase tracking-widest">
        <p>📡 Status: Online</p>
        <p>📍 LAT: {coords ? coords[0].toFixed(4) : 'Buscando...'}</p>
        <p>📍 LNG: {coords ? coords[1].toFixed(4) : 'Buscando...'}</p>
        <div className="mt-2 flex gap-1">
          <div className="w-1 h-1 bg-green-500 animate-ping" />
          <p className="text-white/50">Sincronizado com a rede</p>
        </div>
      </div>
    </div>
  );
}