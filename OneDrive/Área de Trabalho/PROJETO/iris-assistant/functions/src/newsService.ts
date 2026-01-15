import Parser from "rss-parser";

export interface NewsArticle {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
}

const parser = new Parser();

const RSS_URLS: Record<string, string> = {
  general: "https://g1.globo.com/rss/g1/",
  sports: "https://g1.globo.com/rss/g1/esportes/",
  technology: "https://g1.globo.com/rss/g1/tecnologia/",
  business: "https://g1.globo.com/rss/g1/economia/",
  health: "https://g1.globo.com/rss/g1/ciencia-e-saude/",
  entertainment: "https://g1.globo.com/rss/g1/pop-arte/",
  nation: "https://g1.globo.com/rss/g1/politica/",
};

export async function getTopNews(category = "general"): Promise<NewsArticle[]> {
  const url = RSS_URLS[category] || RSS_URLS.general;

  const feed = await parser.parseURL(url);

  return (feed.items || []).slice(0, 5).map(item => ({
    title: item.title || "Sem título",
    description: cleanText(item.contentSnippet || ""),
    source: "G1",
    publishedAt: formatDate(item.pubDate),
    url: item.link || "",
  }));
}

function cleanText(text: string): string {
  return text.length > 200 ? text.slice(0, 200) + "..." : text;
}

function formatDate(date?: string): string {
  if (!date) return "Recente";

  const diffMs = Date.now() - new Date(date).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Agora";
  if (diffHours < 24) return `Há ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;

  return new Date(date).toLocaleDateString("pt-BR");
}
