// Serviço de música - integração com YouTube, Spotify e Deezer (links externos)

export type MusicPlatform = 'youtube' | 'spotify' | 'deezer';

export interface MusicQuery {
  isMusic: boolean;
  query?: string;
  platform?: MusicPlatform;
  action?: 'play' | 'search';
}

/**
 * Abre música no YouTube
 */
export function openYouTube(query: string): void {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  console.log(`🎵 Abrindo YouTube: ${query}`);
  window.open(searchUrl, '_blank');
}

/**
 * Abre música no Spotify
 */
export function openSpotify(query: string): void {
  const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
  console.log(`🎵 Abrindo Spotify: ${query}`);
  window.open(searchUrl, '_blank');
}

/**
 * Abre música no Deezer
 */
export function openDeezer(query: string): void {
  const searchUrl = `https://www.deezer.com/search/${encodeURIComponent(query)}`;
  console.log(`🎵 Abrindo Deezer: ${query}`);
  window.open(searchUrl, '_blank');
}

/**
 * Detecta se a mensagem é uma solicitação de música
 */
export function isMusicQuery(message: string): MusicQuery {
  const lowerMessage = message.toLowerCase().trim();
  
  // Palavras-chave de música
  const musicKeywords = [
    'toque', 'tocar', 'toca', 'música', 'musica', 'play', 'som',
    'coloca', 'coloque', 'bota', 'ponha', 'põe', 'reproduza'
  ];
  
  const hasMusicKeyword = musicKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (!hasMusicKeyword) {
    return { isMusic: false };
  }
  
  // Detecta plataforma específica
  let platform: MusicPlatform = 'youtube'; // padrão
  
  if (lowerMessage.includes('spotify')) {
    platform = 'spotify';
  } else if (lowerMessage.includes('deezer')) {
    platform = 'deezer';
  } else if (lowerMessage.includes('youtube') || lowerMessage.includes('yt')) {
    platform = 'youtube';
  }
  
  // Extrai o que tocar (remove palavras de comando)
  let query = message;
  
  // Remove palavras de comando
  const commandWords = [
    'íris', 'iris', 'toque', 'tocar', 'toca', 'música', 'musica', 
    'play', 'som', 'coloca', 'coloque', 'bota', 'ponha', 'põe', 
    'reproduza', 'no', 'na', 'do', 'da', 'pelo', 'pela',
    'youtube', 'spotify', 'deezer', 'yt'
  ];
  
  commandWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    query = query.replace(regex, '');
  });
  
  query = query.trim();
  
  // Se não sobrou nada, toca música aleatória
  if (!query || query.length < 2) {
    query = getRandomMusicSuggestion();
  }
  
  console.log(`🎵 Música detectada. Query: "${query}", Plataforma: ${platform}`);
  
  return {
    isMusic: true,
    query,
    platform,
    action: 'play',
  };
}

/**
 * Sugestões aleatórias quando não especifica o que tocar
 */
function getRandomMusicSuggestion(): string {
  const suggestions = [
    'rock brasileiro',
    'mpb',
    'sertanejo',
    'jazz',
    'bossa nova',
    'indie brasileiro',
    'pop brasileiro',
    'lofi hip hop',
    'música eletrônica',
    'reggae'
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

/**
 * Processa uma consulta de música e retorna a resposta
 */
export function processMusicQuery(message: string): string {
  const query = isMusicQuery(message);
  
  if (!query.isMusic || !query.query || !query.platform) {
    throw new Error("Não é uma consulta de música");
  }
  
  try {
    // Abre na plataforma apropriada
    switch (query.platform) {
      case 'youtube':
        openYouTube(query.query);
        return `🎵 Abrindo "${query.query}" no YouTube!`;
      
      case 'spotify':
        openSpotify(query.query);
        return `🎵 Abrindo "${query.query}" no Spotify!`;
      
      case 'deezer':
        openDeezer(query.query);
        return `🎵 Abrindo "${query.query}" no Deezer!`;
      
      default:
        openYouTube(query.query);
        return `🎵 Abrindo "${query.query}" no YouTube!`;
    }
  } catch (error) {
    console.error("❌ Erro ao processar música:", error);
    return "❌ Desculpe, não consegui abrir a música. Tente novamente.";
  }
}

/**
 * Retorna mensagem com as plataformas disponíveis
 */
export function getMusicPlatformsHelp(): string {
  return `🎵 **Plataformas de Música Disponíveis:**

**YouTube** (padrão)
- "ÍRIS, toque rock"
- "ÍRIS, toca Legião Urbana"

**Spotify**
- "ÍRIS, toque jazz no Spotify"
- "ÍRIS, toca MPB no Spotify"

**Deezer**
- "ÍRIS, toque bossa nova no Deezer"
- "ÍRIS, toca eletrônica no Deezer"

💡 **Dica:** Se não especificar a plataforma, abro no YouTube!`;
}

/**
 * Sugestões de música por gênero
 */
export function getMusicSuggestionsByGenre(genre: string): string[] {
  const suggestions: Record<string, string[]> = {
    'rock': ['Legião Urbana', 'Titãs', 'Os Paralamas do Sucesso', 'Engenheiros do Hawaii'],
    'mpb': ['Chico Buarque', 'Caetano Veloso', 'Elis Regina', 'Djavan'],
    'sertanejo': ['Chitãozinho & Xororó', 'Zezé Di Camargo & Luciano', 'Marília Mendonça'],
    'funk': ['Anitta', 'MC Kevinho', 'Ludmilla', 'Dennis DJ'],
    'eletronica': ['Alok', 'Vintage Culture', 'KVSH', 'Liu'],
    'jazz': ['Miles Davis', 'John Coltrane', 'Ella Fitzgerald', 'Louis Armstrong'],
    'bossa': ['Tom Jobim', 'João Gilberto', 'Vinicius de Moraes', 'Stan Getz'],
  };
  
  const lowerGenre = genre.toLowerCase();
  
  for (const [key, artists] of Object.entries(suggestions)) {
    if (lowerGenre.includes(key)) {
      return artists;
    }
  }
  
  return [];
}