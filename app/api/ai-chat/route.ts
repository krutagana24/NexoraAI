import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { input, messages } = await req.json();

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Build conversation history
    const conversationMessages = messages || [];
    
    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful, accurate, and knowledgeable AI assistant. Provide clear, complete, and accurate responses. Always finish your thoughts and never leave sentences incomplete. If you don't know something or don't have access to real-time information, be honest about it and suggest using the Web Search feature for current information."
        },
        ...conversationMessages,
        { role: "user", content: input }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return NextResponse.json({ result: chat.choices[0].message.content });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
