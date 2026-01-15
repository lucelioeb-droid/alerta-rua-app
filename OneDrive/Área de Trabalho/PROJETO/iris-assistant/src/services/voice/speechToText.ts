// src/services/voice/speechToText.ts
// Reconhecimento de voz usando Web Speech API nativa do navegador

export function startSpeechToText(
  onResult: (text: string) => void,
  onError?: (error: string) => void
): () => void {
  // Verifica suporte do navegador
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    const errorMsg = "Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge.";
    if (onError) onError(errorMsg);
    throw new Error(errorMsg);
  }

  const recognition = new SpeechRecognition();
  
  // Configurações
  recognition.lang = "pt-BR";
  recognition.continuous = false; // Para após detectar fala
  recognition.interimResults = false; // Só resultados finais
  recognition.maxAlternatives = 1;

  // Quando detecta fala
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    console.log("🎤 Ouvido:", transcript);
    onResult(transcript);
  };

  // Erros
  recognition.onerror = (event: any) => {
    console.error("Erro no reconhecimento:", event.error);
    
    const errorMessages: { [key: string]: string } = {
      "no-speech": "Nenhuma fala detectada. Tente novamente.",
      "audio-capture": "Microfone não encontrado.",
      "not-allowed": "Permissão de microfone negada.",
      "network": "Erro de rede. Verifique sua conexão.",
    };

    const errorMsg = errorMessages[event.error] || `Erro: ${event.error}`;
    if (onError) onError(errorMsg);
  };

  // Quando termina
  recognition.onend = () => {
    console.log("🎤 Reconhecimento finalizado");
  };

  // Inicia o reconhecimento
  try {
    recognition.start();
    console.log("🎤 Reconhecimento iniciado...");
  } catch (error) {
    console.error("Erro ao iniciar reconhecimento:", error);
    if (onError) onError("Erro ao iniciar o microfone");
  }

  // Retorna função para parar
  return () => {
    recognition.stop();
  };
}