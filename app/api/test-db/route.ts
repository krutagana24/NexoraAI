import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Chat from "@/lib/models/Chat";
import Blog from "@/lib/models/Blog";
import Email from "@/lib/models/Email";
import Document from "@/lib/models/Document";
import Code from "@/lib/models/Code";

export async function GET() {
  try {
    await connectDB();
    
    // Get all data from database
    const users = await User.find({}).select("-password");
    const chats = await Chat.find({}).sort({ createdAt: -1 }).limit(20);
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(20);
    const emails = await Email.find({}).sort({ createdAt: -1 }).limit(20);
    const documents = await Document.find({}).sort({ createdAt: -1 }).limit(20);
    const codes = await Code.find({}).sort({ createdAt: -1 }).limit(20);
    
    return NextResponse.json({
      success: true,
      message: "Database connected!",
      data: {
        users: { count: users.length, items: users },
        chats: { count: chats.length, items: chats },
        blogs: { count: blogs.length, items: blogs },
        emails: { count: emails.length, items: emails },
        documents: { count: documents.length, items: documents },
        codes: { count: codes.length, items: codes },
      }
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// POST to test inserting data
export async function POST() {
  try {
    await connectDB();
    
    // Insert a test blog
    const testBlog = await Blog.create({
      userId: "test-user-123",
      title: "Test Blog Title",
      content: "This is a test blog content to verify database is working.",
    });
    
    return NextResponse.json({
      success: true,
      message: "Test blog created!",
      blog: testBlog,
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
