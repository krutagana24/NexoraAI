import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/lib/models/Chat";

// Save chat message
export async function POST(req: Request) {
  try {
    const { userId, message, role } = await req.json();

    if (!userId || !message || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const chat = await Chat.create({ userId, message, role });

    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
  }
}

// Get chat history for user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const chats = await Chat.find({ userId }).sort({ createdAt: 1 }).limit(100);

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
