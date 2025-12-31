import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";

// Save blog
export async function POST(req: Request) {
  try {
    const { userId, title, content } = await req.json();

    if (!userId || !title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const blog = await Blog.create({ userId, title, content });

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("Error saving blog:", error);
    return NextResponse.json({ error: "Failed to save blog" }, { status: 500 });
  }
}

// Get blogs for user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const blogs = await Blog.find({ userId }).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
