// Serviço de cotações e economia usando AwesomeAPI (100% gratuito, brasileiro)
const AWESOMEAPI_URL = "https://economia.awesomeapi.com.br/json";

export interface CurrencyData {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export interface CryptoData {
  code: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

/**
 * Busca cotação de uma ou múltiplas moedas
 * Exemplos: USD-BRL, EUR-BRL, BTC-BRL
 */
export async function getCurrencyQuote(currencies: string): Promise<Record<string, CurrencyData>> {
  console.log(`💰 Buscando cotação: ${currencies}`);
  
  try {
    const response = await fetch(`${AWESOMEAPI_URL}/last/${currencies}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar cotação: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Cotação recebida:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar cotação:", error);
    throw error;
  }
}

/**
 * Busca todas as moedas disponíveis
 */
export async function getAvailableCurrencies(): Promise<any> {
  try {
    const response = await fetch(`${AWESOMEAPI_URL}/available`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar moedas disponíveis: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao buscar moedas:", error);
    throw error;
  }
}

/**
 * Formata cotação em texto legível
 */
export function formatCurrencyResponse(data: Record<string, CurrencyData>): string {
  let response = "💰 **Cotações:**\n\n";
  
  Object.values(data).forEach((currency) => {
    const value = parseFloat(currency.bid);
    const variation = parseFloat(currency.pctChange);
    const arrow = variation >= 0 ? "📈" : "📉";
    const variationText = variation >= 0 ? `+${variation.toFixed(2)}%` : `${variation.toFixed(2)}%`;
    
    response += `${getEmojiForCurrency(currency.code)} **${currency.name}**\n`;
    response += `💵 Compra: R$ ${value.toFixed(2)}\n`;
    response += `${arrow} Variação: ${variationText}\n`;
    response += `📊 Máxima: R$ ${parseFloat(currency.high).toFixed(2)} | Mínima: R$ ${parseFloat(currency.low).toFixed(2)}\n\n`;
  });
  
  const updateTime = new Date(parseInt(Object.values(data)[0].timestamp) * 1000);
  response += `🕐 Atualizado: ${updateTime.toLocaleString('pt-BR')}`;
  
  return response;
}

/**
 * Retorna emoji apropriado para cada moeda
 */
function getEmojiForCurrency(code: string): string {
  const emojiMap: Record<string, string> = {
    'USD': '🇺🇸',
    'EUR': '🇪🇺',
    'GBP': '🇬🇧',
    'ARS': '🇦🇷',
    'BTC': '₿',
    'ETH': 'Ξ',
    'JPY': '🇯🇵',
    'CAD': '🇨🇦',
    'AUD': '🇦🇺',
    'CNY': '🇨🇳',
  };
  
  return emojiMap[code] || '💱';
}

/**
 * Detecta se a mensagem é uma consulta econômica
 */
export function isEconomyQuery(message: string): { 
  isEconomy: boolean; 
  currencies?: string[];
  type?: 'currency' | 'crypto' | 'general';
} {
  const lowerMessage = message.toLowerCase().trim();
  
  // Palavras-chave econômicas
  const economyKeywords = [
    'dólar', 'dolar', 'euro', 'libra', 'peso', 'bitcoin', 'btc', 'ethereum', 'eth',
    'cotação', 'cotacao', 'moeda', 'cambio', 'câmbio', 'crypto', 'criptomoeda'
  ];
  
  const hasEconomyKeyword = economyKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (!hasEconomyKeyword) {
    return { isEconomy: false };
  }
  
  // Detecta moedas específicas
  const currencies: string[] = [];
  const currencyMap: Record<string, string> = {
    'dólar': 'USD-BRL',
    'dolar': 'USD-BRL',
    'euro': 'EUR-BRL',
    'libra': 'GBP-BRL',
    'peso argentino': 'ARS-BRL',
    'peso': 'ARS-BRL',
    'bitcoin': 'BTC-BRL',
    'btc': 'BTC-BRL',
    'ethereum': 'ETH-BRL',
    'eth': 'ETH-BRL',
    'iene': 'JPY-BRL',
    'yuan': 'CNY-BRL',
  };
  
  // Verifica quais moedas foram mencionadas
  Object.entries(currencyMap).forEach(([keyword, code]) => {
    if (lowerMessage.includes(keyword)) {
      currencies.push(code);
    }
  });
  
  // Se não detectou moeda específica mas tem keyword, busca principais
  if (currencies.length === 0) {
    currencies.push('USD-BRL', 'EUR-BRL', 'BTC-BRL');
  }
  
  // Remove duplicatas
  const uniqueCurrencies = [...new Set(currencies)];
  
  console.log(`💰 Consulta econômica detectada. Moedas: ${uniqueCurrencies.join(', ')}`);
  
  return {
    isEconomy: true,
    currencies: uniqueCurrencies,
    type: uniqueCurrencies.some(c => c.includes('BTC') || c.includes('ETH')) ? 'crypto' : 'currency',
  };
}

/**
 * Processa uma consulta econômica e retorna a resposta formatada
 */
export async function processEconomyQuery(message: string): Promise<string> {
  const query = isEconomyQuery(message);
  
  if (!query.isEconomy || !query.currencies) {
    throw new Error("Não é uma consulta econômica");
  }
  
  try {
    // Junta todas as moedas em uma única requisição
    const currenciesParam = query.currencies.join(',');
    const data = await getCurrencyQuote(currenciesParam);
    
    return formatCurrencyResponse(data);
  } catch (error) {
    console.error("❌ Erro ao processar cotação:", error);
    return "❌ Desculpe, não consegui obter as cotações no momento. Tente novamente.";
  }
}

/**
 * Função auxiliar para consultas rápidas de moedas específicas
 */
export async function getQuickQuote(currency: 'USD' | 'EUR' | 'BTC'): Promise<string> {
  try {
    const data = await getCurrencyQuote(`${currency}-BRL`);
    return formatCurrencyResponse(data);
  } catch (error) {
    return `❌ Erro ao buscar cotação do ${currency}`;
  }
}