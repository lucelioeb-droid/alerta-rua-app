// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 🚀 REGISTRO DO APP (PWA)
// O 'virtual:pwa-register' é criado automaticamente pelo plugin que instalamos no vite.config
import { registerSW } from 'virtual:pwa-register';

// Registra o Service Worker para permitir funcionamento Offline e instalação
registerSW({ 
  immediate: true,
  onNeedRefresh() {
    console.log("Nova versão da ÍRIS disponível. Atualizando...");
  },
  onOfflineReady() {
    console.log("ÍRIS pronta para trabalhar offline!");
  },
});

createRoot(document.getElementById("root")!).render(<App />);