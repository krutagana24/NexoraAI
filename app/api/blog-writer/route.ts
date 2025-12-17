import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "You are a professional blog writer. Write complete, well-structured blog posts. Always finish your thoughts and end with a proper conclusion. Never leave sentences incomplete." 
        },
        { role: "user", content: `Write a complete blog post about: ${topic}. Make sure to include an introduction, main points, and a conclusion. Do not cut off mid-sentence.` }
      ],
      max_tokens: 2000,
    });

    return Response.json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("Blog Error:", error);
    return Response.json({ result: "Error creating blog" }, { status: 500 });
  }
}
