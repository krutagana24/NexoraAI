import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Document from "@/lib/models/Document";

// Save document summary
export async function POST(req: Request) {
  try {
    const { userId, type, originalText, summary } = await req.json();

    if (!userId || !originalText || !summary) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const document = await Document.create({ 
      userId, 
      type: type || "text", 
      originalText, 
      summary 
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
  }
}

// Get documents for user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const documents = await Document.find({ userId }).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
