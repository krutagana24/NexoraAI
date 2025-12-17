"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("nexora_current_user");
    if (currentUser) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("nexora_users") || "[]");
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("nexora_current_user", JSON.stringify(user));
        setSuccess(`Welcome back, ${user.name}!`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setError("Invalid email or password");
      }
    } else {
      if (!name || !email || !password) {
        setError("Please fill all fields");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      const users = JSON.parse(localStorage.getItem("nexora_users") || "[]");
      const exists = users.find((u: any) => u.email === email);

      if (exists) {
        setError("Email already registered. Please sign in.");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem("nexora_users", JSON.stringify(users));
      localStorage.setItem("nexora_current_user", JSON.stringify(newUser));

      setSuccess(`Account created! Welcome, ${name}!`);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  const handleGoogleSignIn = () => {
    // Simulated Google Sign In - in production, use real OAuth
    const googleUser = {
      name: "Krutagana Patel",
      email: "krutagna2495@gmail.com",
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    const users = JSON.parse(localStorage.getItem("nexora_users") || "[]");
    const existingUser = users.find((u: any) => u.email === googleUser.email);

    if (!existingUser) {
      users.push(googleUser);
      localStorage.setItem("nexora_users", JSON.stringify(users));
    }

    localStorage.setItem(
      "nexora_current_user",
      JSON.stringify(existingUser || googleUser)
    );
    setSuccess("Signed in with Google!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleAppleSignIn = () => {
    // Simulated Apple Sign In - in production, use real OAuth
    const appleUser = {
      name: "Apple User",
      email: "user@icloud.com",
      provider: "apple",
      createdAt: new Date().toISOString(),
    };

    const users = JSON.parse(localStorage.getItem("nexora_users") || "[]");
    const existingUser = users.find((u: any) => u.email === appleUser.email);

    if (!existingUser) {
      users.push(appleUser);
      localStorage.setItem("nexora_users", JSON.stringify(users));
    }

    localStorage.setItem(
      "nexora_current_user",
      JSON.stringify(existingUser || appleUser)
    );
    setSuccess("Signed in with Apple!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#0f1629] border border-[#1e293b] rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-400">
                {isLogin
                  ? "Sign in to continue to NexoraAI"
                  : "Sign up to get started"}
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-xl">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-[#4dd9d9] hover:bg-[#3cc9c9] text-gray-900 font-semibold py-3.5 rounded-xl transition-all mb-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Apple */}
            <button
              onClick={handleAppleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-[#1a2332] hover:bg-[#242f42] text-white font-semibold py-3.5 rounded-xl transition-all border border-[#2a3548] mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continue with Apple
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-[#2a3548]"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-[#2a3548]"></div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0a0e1a] border border-[#2a3548] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Full Name"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-[#2a3548] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Email"
                  autoComplete="new-email"
                  name="nexora-email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-[#2a3548] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Password"
                  autoComplete="new-password"
                  name="nexora-password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold py-3 rounded-xl transition-all"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-gray-400">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
