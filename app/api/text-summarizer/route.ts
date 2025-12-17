import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { text, length } = await req.json();

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompts = {
      short: "Provide a brief 2-3 sentence summary.",
      medium: "Provide a medium-length summary (1 paragraph, 5-7 sentences).",
      long: "Provide a detailed summary with key points and main ideas (2-3 paragraphs).",
    };

    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a text summarization expert. Create clear, accurate summaries that capture the main points.",
        },
        {
          role: "user",
          content: `Summarize the following text. ${prompts[length as keyof typeof prompts]}\n\nText:\n${text}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    return NextResponse.json({ result: chat.choices[0].message.content });
  } catch (error: any) {
    console.error("Text Summarizer Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
