import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { PDFDocument } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    const question = formData.get("question") as string;

    if (!file) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    
    let pageCount = 0;
    let title = "";
    let author = "";
    let subject = "";
    let creator = "";

    try {
      const pdfDoc = await PDFDocument.load(bytes);
      pageCount = pdfDoc.getPageCount();
      title = pdfDoc.getTitle() || "";
      author = pdfDoc.getAuthor() || "";
      subject = pdfDoc.getSubject() || "";
      creator = pdfDoc.getCreator() || "";
    } catch (e) {
      // PDF parsing failed
    }

    const pdfInfo = `
**PDF Document Details:**
- Filename: ${file.name}
- Size: ${(file.size / 1024).toFixed(2)} KB
- Pages: ${pageCount || "Unknown"}
${title ? `- Title: ${title}` : ""}
${author ? `- Author: ${author}` : ""}
${subject ? `- Subject: ${subject}` : ""}
${creator ? `- Created with: ${creator}` : ""}
`;

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Extract meaningful info from filename
    const cleanFilename = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");

    let prompt = "";
    
    if (question) {
      prompt = `I have a PDF document with these details:
${pdfInfo}

The user is asking: "${question}"

Based on the document name "${cleanFilename}" and metadata, provide a helpful and informative response. If you can infer what the document is about from its name, use that context to answer. Be helpful and professional.`;
    } else {
      prompt = `Analyze this PDF document:
${pdfInfo}

Based on the filename "${cleanFilename}" and available metadata, provide:

1. **Document Overview**: What this document likely contains based on its name
2. **Document Type**: What category of document this appears to be (report, manual, form, etc.)
3. **Key Information**: Any insights from the metadata (author, creation tool, etc.)
4. **Suggested Questions**: What questions might be relevant to ask about this document

Be professional and provide useful analysis based on the available information.`;
    }

    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional document analyst. Analyze PDF documents based on their metadata and filenames. Provide insightful, structured analysis. Be helpful and informative.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 1500,
    });

    return NextResponse.json({ result: chat.choices[0].message.content });
  } catch (error: any) {
    console.error("PDF Analyzer Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
