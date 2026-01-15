import { useState } from "react";
import { Settings, X, ExternalLink } from "lucide-react";

interface SettingsDialogProps {
  apiKey: string;
  onSave: (apiKey: string) => void;
}

const SettingsDialog = ({ apiKey, onSave }: SettingsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(apiKey);

  const handleSave = () => {
    onSave(key);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-muted iris-transition"
        title="Configurações"
      >
        <Settings size={20} className="text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl max-w-md w-full p-6 iris-shadow-md border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Configurações da ÍRIS
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-muted iris-transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Groq API Key
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Cole sua API key aqui..."
                  className="w-full px-4 py-2 rounded-lg border border-border bg-iris-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Sua chave é armazenada apenas localmente no seu navegador.
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-3 text-xs text-foreground">
                <p className="font-medium mb-1">✨ Por que Groq?</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>⚡ Muito mais rápido que Gemini</li>
                  <li>🆓 100% gratuito</li>
                  <li>🎯 Super estável</li>
                  <li>🚀 30 req/min grátis</li>
                </ul>
              </div>

              <div className="bg-accent/50 rounded-lg p-3 text-xs text-accent-foreground">
                <p className="font-medium mb-1">Como obter uma API key:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Acesse console.groq.com</li>
                  <li>Faça login (GitHub ou Google)</li>
                  <li>Vá em "API Keys"</li>
                  <li>Clique "Create API Key"</li>
                  <li>Copie e cole aqui</li>
                </ol>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-primary hover:underline"
                >
                  Abrir Groq Console
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted iris-transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 iris-transition"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsDialog;