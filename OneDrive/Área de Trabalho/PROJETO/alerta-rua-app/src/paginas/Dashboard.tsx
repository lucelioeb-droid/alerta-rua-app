import { useState } from 'react';
import MapView from '../componentes/MapView';
import BotaoReportar from '../componentes/BotaoReportar';
import { mockAlerts } from '../dados/mockAlerts';
import { Alert, AlertType } from '../tipos/alert';

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const criarAlerta = (type: AlertType, lat: number, lng: number) => {
    const novoAlerta: Alert = {
      id: Math.random().toString(),
      type,
      title: 'Novo Alerta',
      description: 'Reportado agora pelo usuário',
      location: { lat, lng, address: 'Localização Atual' },
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      reportedBy: 'Você'
    };
    setAlerts([novoAlerta, ...alerts]);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-sans">
      {/* Header Estilo Monitoramento */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="bg-black/90 border-l-4 border-yellow-500 p-4">
          <h1 className="text-white font-black tracking-tighter text-xl italic leading-none">ALERTA RUA</h1>
          <p className="text-yellow-500 text-[9px] font-mono font-bold uppercase tracking-widest mt-1">Status: Grid Ativo</p>
        </div>
      </div>

      <MapView alerts={alerts} />
      <BotaoReportar onReport={criarAlerta} />
    </div>
  );
}