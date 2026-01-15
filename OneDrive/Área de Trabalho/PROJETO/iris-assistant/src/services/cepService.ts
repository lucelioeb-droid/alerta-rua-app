// src/services/cepService.ts
// Serviço para consulta de CEP usando ViaCEP (API gratuita)

const VIACEP_API_URL = "https://viacep.com.br/ws";

export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
}

export class CepService {
  async getCep(cep: string): Promise<CepData> {
    try {
      // Remove caracteres não numéricos
      const cleanCep = cep.replace(/\D/g, "");

      // Valida CEP
      if (cleanCep.length !== 8) {
        throw new Error("CEP inválido. Use o formato: 12345-678 ou 12345678");
      }

      const response = await fetch(`${VIACEP_API_URL}/${cleanCep}/json/`);

      if (!response.ok) {
        throw new Error("Erro ao buscar CEP");
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      return {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
        estado: this.getEstadoNome(data.uf),
      };
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao consultar CEP");
    }
  }

  // Converte UF para nome completo do estado
  private getEstadoNome(uf: string): string {
    const estados: { [key: string]: string } = {
      AC: "Acre",
      AL: "Alagoas",
      AP: "Amapá",
      AM: "Amazonas",
      BA: "Bahia",
      CE: "Ceará",
      DF: "Distrito Federal",
      ES: "Espírito Santo",
      GO: "Goiás",
      MA: "Maranhão",
      MT: "Mato Grosso",
      MS: "Mato Grosso do Sul",
      MG: "Minas Gerais",
      PA: "Pará",
      PB: "Paraíba",
      PR: "Paraná",
      PE: "Pernambuco",
      PI: "Piauí",
      RJ: "Rio de Janeiro",
      RN: "Rio Grande do Norte",
      RS: "Rio Grande do Sul",
      RO: "Rondônia",
      RR: "Roraima",
      SC: "Santa Catarina",
      SP: "São Paulo",
      SE: "Sergipe",
      TO: "Tocantins",
    };

    return estados[uf] || uf;
  }
}

// Verifica se o texto parece ser uma consulta de CEP
export function isCepQuery(text: string): boolean {
  const lower = text.toLowerCase();

  // Padrões de CEP: 12345-678 ou 12345678
  const cepPattern = /\b\d{5}-?\d{3}\b/;

  // Palavras-chave
  const keywords = ["cep", "código postal", "codigo postal", "endereço", "endereco"];

  return cepPattern.test(text) || keywords.some((kw) => lower.includes(kw));
}

// Extrai o CEP do texto
export function extractCep(text: string): string | null {
  const cepPattern = /\b(\d{5}-?\d{3})\b/;
  const match = text.match(cepPattern);
  return match ? match[1] : null;
}

// Processa uma consulta de CEP e retorna a resposta formatada
export async function processCepQuery(text: string): Promise<string> {
  try {
    const cep = extractCep(text);

    if (!cep) {
      return "Por favor, informe um CEP válido. Exemplo: 40301-110";
    }

    const data = await cepService.getCep(cep);

    return `📍 CEP ${data.cep}:
${data.logradouro}${data.complemento ? `, ${data.complemento}` : ""}
${data.bairro} - ${data.localidade}/${data.uf}
${data.estado}`;
  } catch (error) {
    console.error("Erro ao processar CEP:", error);
    if (error instanceof Error) {
      return `❌ ${error.message}`;
    }
    return "❌ Erro ao consultar CEP. Verifique o número e tente novamente.";
  }
}

export const cepService = new CepService();