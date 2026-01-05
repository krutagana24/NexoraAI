import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // No maxAge = session cookie (expires when browser closes)
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user in database
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving user to database:", error);
          return true; // Still allow sign in even if DB fails
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
});

export { handler as GET, handler as POST };
