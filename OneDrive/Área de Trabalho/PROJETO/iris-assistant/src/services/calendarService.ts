// src/services/calendarService.ts

const GOOGLE_API_KEY = "SUA_CHAVE_API_AQUI"; // Coloque a chave que você gerou no console
const CALENDAR_ID = "primary"; // 'primary' pega o calendário principal do usuário logado

export async function getNextEvents(): Promise<string> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${GOOGLE_API_KEY}&timeMin=${new Date().toISOString()}&maxResults=3&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      if (data.error.status === "PERMISSION_DENIED") {
        return "Desculpe, a chave da agenda não tem permissão de acesso. Verifique as restrições no Google Cloud.";
      }
      return "Houve um erro ao acessar sua agenda.";
    }

    const events = data.items || [];
    if (events.length === 0) {
      return "Você não tem compromissos agendados para os próximos dias.";
    }

    let resposta = "Aqui estão seus próximos compromissos: ";
    events.forEach((event: any) => {
      const start = new Date(event.start.dateTime || event.start.date);
      const dataFormatada = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const horaFormatada = start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      resposta += `${event.summary} no dia ${dataFormatada} às ${horaFormatada}. `;
    });

    return resposta;
  } catch (error) {
    console.error("Erro ao buscar agenda:", error);
    return "Não consegui acessar sua agenda agora.";
  }
}