import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    // Use Tavily API for web search (free tier available)
    const tavilyKey = process.env.TAVILY_API_KEY;
    
    if (!tavilyKey) {
      return NextResponse.json({ 
        error: "Web search requires TAVILY_API_KEY. Get a free key at https://tavily.com" 
      }, { status: 500 });
    }

    // Step 1: Search the web using Tavily
    const searchResponse = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: input,
        search_depth: "basic",
        include_answer: true,
        max_results: 5,
      }),
    });

    const searchData = await searchResponse.json();

    if (searchData.error) {
      return NextResponse.json({ 
        error: searchData.error 
      }, { status: 500 });
    }

    // Extract search results
    const searchContext = searchData.answer || 
      searchData.results?.map((r: any) => r.content).join("\n\n") || 
      "No results found";
    
    const sources = searchData.results?.map((r: any) => ({
      title: r.title,
      url: r.url,
    })) || [];

    // Step 2: Use Groq to synthesize the answer
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!groqKey) {
      // Return raw search results if no Groq key
      return NextResponse.json({ 
        result: searchContext,
        sources: sources
      });
    }

    const client = new Groq({ apiKey: groqKey });
    
    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful AI assistant with access to real-time web search results. Today's date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Use the provided search results to give accurate, up-to-date answers.`
        },
        { 
          role: "user", 
          content: `Question: ${input}\n\nWeb Search Results:\n${searchContext}\n\nPlease provide a clear, accurate answer based on these search results.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({ 
      result: chat.choices[0].message.content,
      sources: sources
    });
  } catch (error: any) {
    console.error("Web Search Error:", error);
    return NextResponse.json({ 
      error: error?.message || "Server error"
    }, { status: 500 });
  }
}
