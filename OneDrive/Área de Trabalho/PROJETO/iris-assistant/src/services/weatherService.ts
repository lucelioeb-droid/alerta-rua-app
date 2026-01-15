// src/services/weatherService.ts
// Serviço para consulta de clima usando OpenWeatherMap API (gratuita)

const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_API_KEY = "e231f212a906ff1e88763f1b0e35122f"; // 🔑 Obter em: https://openweathermap.org/api

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export class WeatherService {
  async getWeather(city: string): Promise<WeatherData> {
    try {
      const url = `${OPENWEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Cidade não encontrada");
        }
        throw new Error("Erro ao buscar dados do clima");
      }

      const data = await response.json();

      return {
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
      };
    } catch (error) {
      console.error("Erro ao buscar clima:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao consultar dados meteorológicos");
    }
  }

  // Busca clima pela localização atual (lat/lon)
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const url = `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do clima");
      }

      const data = await response.json();

      return {
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
      };
    } catch (error) {
      console.error("Erro ao buscar clima por coordenadas:", error);
      throw new Error("Erro ao consultar dados meteorológicos");
    }
  }

  // Converte ícone para emoji
  private getWeatherEmoji(icon: string): string {
    const emojiMap: { [key: string]: string } = {
      "01d": "☀️", "01n": "🌙",
      "02d": "⛅", "02n": "☁️",
      "03d": "☁️", "03n": "☁️",
      "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️",
      "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️",
      "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️",
    };
    return emojiMap[icon] || "🌡️";
  }

  formatWeatherResponse(data: WeatherData): string {
    const emoji = this.getWeatherEmoji(data.icon);
    return `${emoji} Clima em ${data.city}, ${data.country}:
🌡️ Temperatura: ${data.temp}°C (sensação de ${data.feelsLike}°C)
📊 Mín: ${data.tempMin}°C | Máx: ${data.tempMax}°C
💧 Umidade: ${data.humidity}%
🌬️ Vento: ${data.windSpeed} m/s
☁️ ${data.description.charAt(0).toUpperCase() + data.description.slice(1)}`;
  }
}

// Verifica se o texto parece ser uma consulta de clima
export function isWeatherQuery(text: string): boolean {
  const lower = text.toLowerCase();
  const keywords = [
    "clima", "tempo", "previsão", "previsao",
    "temperatura", "chuva", "sol", "frio", "calor",
    "vai chover", "tá chovendo", "ta chovendo"
  ];
  return keywords.some((kw) => lower.includes(kw));
}

// Extrai o nome da cidade do texto
export function extractCity(text: string): string | null {
  const lower = text.toLowerCase();
  
  // Padrões: "clima em São Paulo", "tempo de Salvador", etc.
  const patterns = [
    /clima (?:em|de|do|da|no|na) (.+)/i,
    /tempo (?:em|de|do|da|no|na) (.+)/i,
    /temperatura (?:em|de|do|da|no|na) (.+)/i,
    /previsão (?:em|de|do|da|no|na|para) (.+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Se não encontrou padrão específico, tenta pegar última palavra (cidade)
  const words = text.split(" ");
  if (words.length >= 2) {
    return words[words.length - 1];
  }

  return null;
}

// Processa uma consulta de clima e retorna a resposta formatada
export async function processWeatherQuery(text: string): Promise<string> {
  try {
    let city = extractCity(text);
    
    // Se não encontrou cidade, usa Feira de Santana como padrão
    if (!city) {
      city = "Feira de Santana";
    }

    const data = await weatherService.getWeather(city);
    return weatherService.formatWeatherResponse(data);
  } catch (error) {
    console.error("Erro ao processar consulta de clima:", error);
    if (error instanceof Error) {
      return `❌ ${error.message}`;
    }
    return "❌ Erro ao consultar clima. Tente novamente ou especifique outra cidade.";
  }
}

export const weatherService = new WeatherService();