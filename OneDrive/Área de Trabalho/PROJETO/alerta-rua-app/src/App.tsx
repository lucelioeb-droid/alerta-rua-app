import Dashboard from './paginas/Dashboard';
import HUD from './componentes/HUD';

function App() {
  return (
    <div className="w-full h-screen bg-black text-white selection:bg-yellow-500 selection:text-black">
      {/* Componente principal de tela cheia */}
      <Dashboard />
      
      {/* HUD fixo sobre o mapa */}
      <HUD />
    </div>
  );
}

export default App;