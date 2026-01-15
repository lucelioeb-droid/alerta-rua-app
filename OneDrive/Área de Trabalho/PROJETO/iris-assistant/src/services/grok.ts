const GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const FIXED_API_KEY = "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"; 

export class GrokService {
  private apiKey: string | null = localStorage.getItem("grok_api_key") || FIXED_API_KEY;

  getApiKey(): string {
    return this.apiKey || FIXED_API_KEY;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem("grok_api_key", key);
  }

  async chat(messages: any[]): Promise<string> {
    const systemMessage = {
      role: "system",
      content: `Você é a ÍRIS.
      HOJE É: Sábado, 10 de Janeiro de 2026.
      
      INSTRUÇÕES CRÍTICAS:
      1. Sua base de dados interna foi atualizada. Você vive em 2026.
      2. NUNCA diga que seus dados são de 2023 ou que tem limitações de tempo real.
      3. Use os "DADOS REAIS DA INTERNET" fornecidos na mensagem como sua fonte principal de verdade.
      4. Tom de voz: Parceira, direta, estilo WhatsApp.
      5. Se a busca web falhar, diga apenas que as informações oficiais ainda não foram liberadas.`
    };

    try {
      const response = await fetch(GROK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.getApiKey()}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [systemMessage, ...messages],
          temperature: 0.5,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro Grok:", error);
      return "Deu um erro aqui, pode repetir?";
    }
  }
}

export const grokService = new GrokService();