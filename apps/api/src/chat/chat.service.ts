import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';

const SYSTEM_PROMPTS: Record<string, string> = {
  fr: "Tu es « Le Cercle », l'assistant immobilier du portail lecercle (marché marocain, ouvert à l'international). Aide l'utilisateur à trouver un bien (acheter, louer, investir), réponds à ses questions, suggère des critères de recherche (ville, budget, type, chambres). Réponds de façon concise, utile et chaleureuse, en français.",
  en: "You are « Le Cercle », the real-estate assistant of the lecercle portal (Moroccan market, international-ready). Help the user find a property (buy, rent, invest), answer questions, and suggest search criteria (city, budget, type, bedrooms). Reply concisely, helpfully and warmly, in English.",
  es: "Eres « Le Cercle », el asistente inmobiliario del portal lecercle (mercado marroquí, abierto a lo internacional). Ayuda al usuario a encontrar un inmueble (comprar, alquilar, invertir), responde preguntas y sugiere criterios de búsqueda (ciudad, presupuesto, tipo, habitaciones). Responde de forma concisa, útil y cercana, en español.",
  ar: "أنت « Le Cercle »، المساعد العقاري لبوابة lecercle (السوق المغربي، مفتوح على العالم). ساعد المستخدم في العثور على عقار (شراء، إيجار، استثمار)، وأجب عن الأسئلة، واقترح معايير البحث (المدينة، الميزانية، النوع، عدد الغرف). أجب بإيجاز وبشكل مفيد وودود، بالعربية.",
};

@Injectable()
export class ChatService {
  async chat(dto: ChatDto) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException('deepseek_api_key_missing');
    }
    const sys = SYSTEM_PROMPTS[dto.locale ?? 'fr'] ?? SYSTEM_PROMPTS.fr;

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: sys }, ...dto.messages],
        temperature: 0.7,
        max_tokens: 700,
      }),
    });

    if (!res.ok) {
      throw new ServiceUnavailableException('deepseek_error');
    }
    const data = await res.json();
    return { reply: data?.choices?.[0]?.message?.content ?? '' };
  }
}
