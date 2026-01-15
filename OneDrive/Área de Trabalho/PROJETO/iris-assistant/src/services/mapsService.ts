// src/services/mapsService.ts
// Serviço para busca de locais usando Nominatim (OpenStreetMap - gratuita)

const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org";

export interface LocationData {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export class MapsService {
  async searchLocation(query: string): Promise<LocationData[]> {
    try {
      const url = `${NOMINATIM_API_URL}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=pt-BR`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "IrisAssistant/1.0", // Nominatim requer User-Agent
        },
      });
      
      if (!response.ok) {
        throw new Error("Erro ao buscar localização");
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error("Local não encontrado");
      }

      return data.map((item: any) => ({
        name: item.name || item.display_name.split(",")[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: this.translateType(item.type),
        address: {
          road: item.address?.road,
          suburb: item.address?.suburb,
          city: item.address?.city || item.address?.town || item.address?.village,
          state: item.address?.state,
          country: item.address?.country,
          postcode: item.address?.postcode,
        },
      }));
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao consultar localização");
    }
  }

  // Busca reversa (coordenadas -> endereço)
  async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    try {
      const url = `${NOMINATIM_API_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=pt-BR`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "IrisAssistant/1.0",
        },
      });
      
      if (!response.ok) {
        throw new Error("Erro ao buscar endereço");
      }

      const data = await response.json();

      return {
        name: data.name || data.display_name.split(",")[0],
        displayName: data.display_name,
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
        type: this.translateType(data.type),
        address: {
          road: data.address?.road,
          suburb: data.address?.suburb,
          city: data.address?.city || data.address?.town,
          state: data.address?.state,
          country: data.address?.country,
          postcode: data.address?.postcode,
        },
      };
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      throw new Error("Erro ao consultar endereço");
    }
  }

  // Calcula distância entre dois pontos (fórmula de Haversine)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Traduz tipo de local para português
  private translateType(type: string): string {
    const types: { [key: string]: string } = {
      "city": "Cidade",
      "town": "Cidade",
      "village": "Vila",
      "restaurant": "Restaurante",
      "cafe": "Café",
      "hospital": "Hospital",
      "school": "Escola",
      "university": "Universidade",
      "park": "Parque",
      "museum": "Museu",
      "theatre": "Teatro",
      "cinema": "Cinema",
      "bank": "Banco",
      "pharmacy": "Farmácia",
      "supermarket": "Supermercado",
      "hotel": "Hotel",
      "gas_station": "Posto de Gasolina",
      "stadium": "Estádio",
      "airport": "Aeroporto",
      "train_station": "Estação de Trem",
      "bus_station": "Estação de Ônibus",
    };
    return types[type] || type;
  }

  formatLocationResponse(location: LocationData): string {
    let response = `📍 ${location.name}\n`;
    response += `🗺️ ${location.displayName}\n`;
    response += `📊 Tipo: ${location.type}\n`;
    response += `🌐 Coordenadas: ${location.lat.toFixed(6)}, ${location.lon.toFixed(6)}\n`;
    
    if (location.address.postcode) {
      response += `📮 CEP: ${location.address.postcode}`;
    }

    return response;
  }

  formatMultipleLocations(locations: LocationData[]): string {
    if (locations.length === 0) {
      return "📍 Nenhum local encontrado.";
    }

    let response = `📍 Encontrei ${locations.length} resultado${locations.length > 1 ? "s" : ""}:\n\n`;
    
    locations.slice(0, 3).forEach((loc, index) => {
      response += `${index + 1}. ${loc.name}\n`;
      response += `   ${loc.displayName}\n`;
      response += `   🗺️ ${loc.type}\n\n`;
    });

    if (locations.length > 3) {
      response += `... e mais ${locations.length - 3} resultado${locations.length - 3 > 1 ? "s" : ""}.`;
    }

    return response.trim();
  }
}

// Verifica se o texto parece ser uma consulta de localização/mapa
export function isMapsQuery(text: string): { isMaps: boolean; query?: string } {
  const lower = text.toLowerCase();
  
  const mapsKeywords = [
    "onde fica", "onde é", "localização", "localizacao",
    "endereço", "endereco", "mapa", "como chegar",
    "encontrar", "buscar local", "procurar lugar"
  ];

  const isMaps = mapsKeywords.some((kw) => lower.includes(kw));
  
  if (!isMaps) return { isMaps: false };

  // Extrai o que está sendo buscado
  const patterns = [
    /onde (?:fica|é) (?:o|a|os|as)? ?(.+)/i,
    /(?:localização|localizacao) (?:de|do|da) (.+)/i,
    /(?:endereço|endereco) (?:de|do|da) (.+)/i,
    /(?:encontrar|buscar|procurar) (.+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return { isMaps: true, query: match[1].trim() };
    }
  }

  // Se detectou palavra-chave mas não achou padrão, usa texto inteiro
  return { isMaps: true, query: text };
}

// Processa uma consulta de localização e retorna a resposta formatada
export async function processMapsQuery(text: string): Promise<string> {
  try {
    const detection = isMapsQuery(text);
    
    if (!detection.query) {
      return "Por favor, especifique o que você está procurando. Exemplo: 'onde fica a Torre Eiffel'";
    }

    const locations = await mapsService.searchLocation(detection.query);
    
    if (locations.length === 1) {
      return mapsService.formatLocationResponse(locations[0]);
    } else {
      return mapsService.formatMultipleLocations(locations);
    }
  } catch (error) {
    console.error("Erro ao processar consulta de localização:", error);
    if (error instanceof Error) {
      return `❌ ${error.message}`;
    }
    return "❌ Erro ao buscar localização. Tente ser mais específico.";
  }
}

export const mapsService = new MapsService();