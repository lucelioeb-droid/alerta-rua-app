export async function irisBrain(userText: string, getAIResponse: (text: string) => Promise<string>): Promise<string | null> {
  const lower = userText.toLowerCase();

  if (lower.includes("[doc:") || lower.includes("analise este arquivo") || lower.includes("[arquivo")) {
    return null; 
  }

  // DISCAGEM
  if (lower.includes("ligue") || lower.includes("ligar") || lower.includes("disque")) {
    const phoneNumber = lower.replace(/\D/g, "");
    if (phoneNumber.length >= 8) {
      window.location.href = `tel:${phoneNumber}`;
      return `Abrindo o discador para ${phoneNumber}.`;
    }
  }

  // MAPAS (Links Corrigidos)
  if (lower.includes("trânsito") || lower.includes("mapa") || lower.includes("rota") || lower.includes("ir para")) {
    const destino = lower.replace(/íris|iris|ver|trânsito|mapa|rota|caminho|ir para/gi, "").trim();
    const mapUrl = destino 
      ? `https://www.google.com/maps/search/${encodeURIComponent(destino)}`
      : `https://www.google.com/maps`;
    window.open(mapUrl, '_blank');
    return destino ? `Calculando rota para ${destino}.` : "Mostrando o mapa.";
  }

  // YOUTUBE / SPOTIFY (Links Corrigidos)
  if (lower.includes("tocar") || lower.includes("ouvir") || lower.includes("youtube") || lower.includes("spotify")) {
    const busca = lower.replace(/íris|iris|tocar|ouvir|no spotify|no youtube|música|youtube|spotify/gi, "").trim() || "músicas recomendadas";
    if (lower.includes("youtube")) {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(busca)}`, '_blank');
      return `Buscando ${busca} no YouTube.`;
    }
    window.open(`https://open.spotify.com/search/${encodeURIComponent(busca)}`, '_blank');
    return `Buscando ${busca} no Spotify.`;
  }

  return null;
}