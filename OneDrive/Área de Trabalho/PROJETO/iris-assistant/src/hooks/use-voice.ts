import { startSpeechToText } from "@/services/voice/speechToText";

export function useVoice(onText: (text: string) => void) {
  function startListening() {
    startSpeechToText(onText);
  }

  return { startListening };
}