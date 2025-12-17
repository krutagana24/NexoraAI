import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { input, language, task } = await req.json();

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompts = {
      generate: `Generate ${language} code for: ${input}`,
      debug: `Debug and fix this ${language} code:\n\n${input}`,
      explain: `Explain this ${language} code briefly:\n\n${input}`,
      optimize: `Optimize this ${language} code:\n\n${input}`,
    };

    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a concise code assistant. IMPORTANT: Give ONLY the code directly, followed by 2-3 lines of brief explanation. No headers, no markdown titles, no lengthy explanations, no example usage sections. Just clean code and a short explanation.",
        },
        {
          role: "user",
          content: prompts[task as keyof typeof prompts],
        },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    return NextResponse.json({ result: chat.choices[0].message.content });
  } catch (error: any) {
    console.error("Code Assistant Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
