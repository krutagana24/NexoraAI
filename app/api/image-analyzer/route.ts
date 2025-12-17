import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const userPrompt = formData.get("prompt") as string;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Get image info
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const sizeKB = (bytes.byteLength / 1024).toFixed(2);
    const sizeMB = (bytes.byteLength / (1024 * 1024)).toFixed(2);
    const filename = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    // Try Hugging Face vision model
    let imageDescription = "";
    
    try {
      const hfResponse = await fetch(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: base64,
          }),
        }
      );

      if (hfResponse.ok) {
        const result = await hfResponse.json();
        if (result && result[0] && result[0].generated_text) {
          imageDescription = result[0].generated_text;
        }
      }
    } catch (e) {
      // HF failed, continue with filename-based analysis
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let prompt = "";
    
    if (imageDescription) {
      // We have actual image description from HF
      prompt = userPrompt 
        ? `I have an image with this AI-generated description: "${imageDescription}"
        
Image details:
- Filename: ${file.name}
- Size: ${sizeMB} MB

User's question: ${userPrompt}

Provide a helpful, detailed response based on the image description.`
        : `Analyze this image based on the AI-generated description: "${imageDescription}"

Image details:
- Filename: ${file.name}
- Size: ${sizeMB} MB

Provide a detailed analysis:

**Summary of What Is Seen**
• Describe the main subject and elements
• Colors, style, and visual characteristics
• Setting or context

**Details**
• Specific features visible
• Composition and quality
• Any notable elements

Be descriptive and engaging.`;
    } else {
      // Fallback to filename-based analysis
      prompt = userPrompt
        ? `I have an image file: "${file.name}" (${sizeMB} MB). The user asks: "${userPrompt}". Provide a helpful response based on what the filename suggests about the image.`
        : `Analyze this image based on available information:
        
- Filename: ${file.name}
- Interpreted name: "${filename}"
- Size: ${sizeMB} MB (${sizeKB} KB)
- Format: ${file.type}

Based on the filename "${filename}", provide:

**What This Image Likely Shows**
• Make an educated guess about the content
• Describe what you'd expect to see

**Suggested Caption**
• A creative caption for this image

**Image Details**
• Technical information about the file

Be helpful and creative based on the filename context.`;
    }

    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful image analyst. Provide detailed, engaging descriptions and analysis. Be descriptive and informative.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({ result: chat.choices[0].message.content });
  } catch (err: any) {
    console.error("Image Analyzer Error:", err);
    return NextResponse.json({ error: err.message || "Failed to analyze image" }, { status: 500 });
  }
}
