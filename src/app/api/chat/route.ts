import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_KEY = process.env.GROQ_API_KEY!;          // убедись, что переменная есть!

const systemPromptMap: Record<string, string> = {
  bro:      "Ты отвечаешь как старший брат: неформально, тепло и честно.",
  motivate: "Ты коуч, воодушевляешь и задаёшь цели.",
  therapy:  "Ты эмпатичный слушатель, как терапевт без диагнозов.",
};

export async function POST(req: Request) {
  const { messages, style = "bro" } = await req.json();

  const resp = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      stream: true,
      messages: [
        { role: "system", content: systemPromptMap[style] ?? systemPromptMap.bro },
        ...messages,
      ],
    }),
  });

  if (!resp.ok) {
    // прокинем текст ошибки, чтобы было видно в терминале
    const errorText = await resp.text();
    throw new Error(`Groq API error: ${resp.status} – ${errorText}`);
  }

  
  const stream = OpenAIStream(resp);               // теперь это Response
  return new StreamingTextResponse(stream);
}