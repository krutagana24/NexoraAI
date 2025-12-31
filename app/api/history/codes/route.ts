import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Code from "@/lib/models/Code";

// Save code
export async function POST(req: Request) {
  try {
    const { userId, prompt, code, language } = await req.json();

    if (!userId || !prompt || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const codeDoc = await Code.create({ userId, prompt, code, language });

    return NextResponse.json({ success: true, code: codeDoc });
  } catch (error) {
    console.error("Error saving code:", error);
    return NextResponse.json({ error: "Failed to save code" }, { status: 500 });
  }
}

// Get codes for user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const codes = await Code.find({ userId }).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ codes });
  } catch (error) {
    console.error("Error fetching codes:", error);
    return NextResponse.json({ error: "Failed to fetch codes" }, { status: 500 });
  }
}
