import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    // First, do a web search using DuckDuckGo (no API key needed)
    const searchQuery = encodeURIComponent(input);
    const searchResponse = await fetch(
      `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1&skip_disambig=1`
    );
    
    const searchData = await searchResponse.json();
    const searchContext = searchData.AbstractText || searchData.RelatedTopics?.[0]?.Text || "No recent information found.";

    // Now use Groq with the search context
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful AI assistant with access to web search results. Use the provided search context to answer questions accurately. Today's date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.`
        },
        { 
          role: "user", 
          content: `Question: ${input}\n\nWeb Search Context: ${searchContext}\n\nPlease answer the question using the search context when relevant. If the search context doesn't help, provide your best general knowledge answer.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({ 
      result: chat.choices[0].message.content,
      searchContext: searchContext 
    });
  } catch (error) {
    console.error("Web Search Chat Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
