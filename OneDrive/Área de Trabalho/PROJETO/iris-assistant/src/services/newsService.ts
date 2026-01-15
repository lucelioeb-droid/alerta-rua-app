// src/services/newsService.ts

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

class NewsService {
  // URLs de RSS do G1
  private feeds = {
    geral: 'https://g1.globo.com/rss/g1/',
    politica: 'https://g1.globo.com/rss/g1/politica/',
    tecnologia: 'https://g1.globo.com/rss/g1/tecnologia/'
  };

  async getTopNews(category: keyof typeof this.feeds = 'geral'): Promise<NewsItem[]> {
    const rssUrl = encodeURIComponent(this.feeds[category]);
    
    // O segredo para evitar notícias de 2023: Cache Buster (timestamp atual)
    const cacheBuster = new Date().getTime();
    
    // Usando a API rss2json para converter o XML do G1 em JSON amigável
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&t=${cacheBuster}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error("O serviço de notícias está temporariamente indisponível (Erro 422).");
        }
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'ok') {
        return data.items.slice(0, 5).map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: 'G1'
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Erro ao buscar notícias na Íris:", error);
      throw error;
    }
  }

  // Função auxiliar para formatar a resposta para a voz da Íris
  formatNewsForAssistant(news: NewsItem[]): string {
    if (news.length === 0) return "Desculpe, não consegui encontrar notícias recentes no momento.";
    
    const intro = "Aqui estão as últimas notícias do G1: ";
    const titles = news.map((item, index) => `${index + 1}: ${item.title}`).join(". ");
    
    return intro + titles;
  }
}

export const newsService = new NewsService();