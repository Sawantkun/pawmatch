import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Dr. PawMatch, a knowledgeable and caring AI veterinary assistant.
You help pet owners with questions about their pets' health, nutrition, behavior, and general care.
Keep responses concise (2-4 sentences), warm, and practical.
Always recommend consulting a licensed veterinarian for emergencies, diagnoses, or prescriptions.
Do not diagnose specific conditions — instead guide users on what to watch for and when to seek professional help.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pawmatch.app",
        "X-Title": "PawMatch AI Vet",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI vet error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
