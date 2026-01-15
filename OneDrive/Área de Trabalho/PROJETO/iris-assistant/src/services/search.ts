const TAVILY_API_KEY = "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";

export async function webSearch(query: string): Promise<string> {
  try {
    // Busca aberta: O Tavily decide os melhores resultados de 2026
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5
      })
    });

    const data = await response.json();
    // Retorna a resposta direta ou o conteúdo dos sites encontrados
    return data.answer || (data.results?.map((r: any) => r.content).join("\n").substring(0, 1500) || "");
  } catch (error) {
    console.error("Erro na busca:", error);
    return "";
  }
}