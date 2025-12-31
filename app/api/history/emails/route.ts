import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Email from "@/lib/models/Email";

// Save email
export async function POST(req: Request) {
  try {
    const { userId, subject, body } = await req.json();

    if (!userId || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const email = await Email.create({ userId, subject, body });

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("Error saving email:", error);
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }
}

// Get emails for user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const emails = await Email.find({ userId }).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
