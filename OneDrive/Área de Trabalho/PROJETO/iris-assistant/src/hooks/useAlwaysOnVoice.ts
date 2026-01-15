import { useState, useCallback, useEffect, useRef } from "react";

export const useAlwaysOnVoice = (onSpeechCaptured: (text: string) => void) => {
  const [isActive, setIsActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef(onSpeechCaptured);

  // Mantém a referência da função de captura sempre atualizada
  useEffect(() => {
    callbackRef.current = onSpeechCaptured;
  }, [onSpeechCaptured]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'pt-BR';

    recognition.onstart = () => setIsActive(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      if (text) callbackRef.current(text);
    };
    recognition.onerror = () => setIsActive(false);
    recognition.onend = () => setIsActive(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const toggleAlwaysOn = useCallback(() => {
    if (isActive) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        recognitionRef.current?.stop();
        setTimeout(() => recognitionRef.current?.start(), 100);
      }
    }
  }, [isActive]);

  return { isActive, toggleAlwaysOn };
};