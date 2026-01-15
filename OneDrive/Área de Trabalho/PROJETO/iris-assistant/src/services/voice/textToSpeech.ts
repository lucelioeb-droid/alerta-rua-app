// src/services/voice/textToSpeech.ts

export async function speak(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 1. Cancela qualquer fala anterior para não encavalar
    window.speechSynthesis.cancel();

    if (!text) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1.0; // Velocidade (0.1 a 10)
    utterance.pitch = 1.1; // Tom de voz (mais agudo ou grave)

    // Seleciona uma voz feminina se disponível no sistema
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes("Maria") || v.name.includes("Google português do Brasil"));
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => {
      console.log("🔊 ÍRIS está falando...");
    };

    utterance.onend = () => {
      console.log("🔈 ÍRIS terminou de falar.");
      resolve();
    };

    utterance.onerror = (err) => {
      console.error("❌ Erro no TTS:", err);
      reject(err);
    };

    window.speechSynthesis.speak(utterance);
  });
}