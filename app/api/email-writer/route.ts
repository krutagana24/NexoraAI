import Groq from "groq-sdk";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a professional email writer. Write complete, well-formatted emails. Always include a proper greeting, body, and sign-off. Never leave sentences incomplete.",
      },
      {
        role: "user",
        content: `Write a complete professional email for the following request:\n${prompt}`,
      },
    ],
    max_tokens: 1500,
  });

  return Response.json({
    result: completion.choices[0].message.content,
  });
}
