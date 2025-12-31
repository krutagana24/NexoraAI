"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Mail, Lock, User, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTheme } from "@/components/theme-context";

export default function AuthPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const authUser = {
        name: session.user.name || "User",
        email: session.user.email || "",
        image: session.user.image || "",
        provider: "oauth",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("nexora_current_user", JSON.stringify(authUser));
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    const currentUser = localStorage.getItem("nexora_current_user");
    if (currentUser && !session) {
      router.push("/");
    }
  }, [router, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        localStorage.setItem("nexora_current_user", JSON.stringify(data.user));
        setSuccess(`Welcome back, ${data.user.name}!`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        localStorage.setItem("nexora_current_user", JSON.stringify(data.user));
        setSuccess(`Account created! Welcome, ${data.user.name}!`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
      }`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isLight ? "text-orange-500" : "text-blue-500"}`} />
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="flex-1 pt-20 sm:pt-24 pb-6 sm:pb-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="text-center mb-5 sm:mb-6">
              <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>
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
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 font-semibold py-3.5 rounded-xl transition-all mb-4 ${
                isLight 
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200" 
                  : "bg-white hover:bg-gray-100 text-gray-900"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
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
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`flex-1 h-px ${isLight ? "bg-gray-200" : "bg-[#2a3548]"}`}></div>
              <span className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>or</span>
              <div className={`flex-1 h-px ${isLight ? "bg-gray-200" : "bg-[#2a3548]"}`}></div>
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
                    className={`w-full rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-colors ${
                      isLight 
                        ? "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500" 
                        : "bg-[#0a0e1a] border border-[#2a3548] text-white placeholder-gray-500 focus:border-blue-500"
                    }`}
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
                  className={`w-full rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-colors ${
                    isLight 
                      ? "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500" 
                      : "bg-[#0a0e1a] border border-[#2a3548] text-white placeholder-gray-500 focus:border-blue-500"
                  }`}
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
                  className={`w-full rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-colors ${
                    isLight 
                      ? "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500" 
                      : "bg-[#0a0e1a] border border-[#2a3548] text-white placeholder-gray-500 focus:border-blue-500"
                  }`}
                  placeholder="Password"
                  autoComplete="new-password"
                  name="nexora-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isLight 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "bg-[#5865F2] hover:bg-[#4752c4] text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setSuccess("");
                  }}
                  className={`font-medium ${isLight ? "text-orange-500 hover:text-orange-600" : "text-blue-400 hover:text-blue-300"}`}
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
