"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("দয়া করে ইমেল এবং পাসওয়ার্ড দিন");
      return;
    }

    try {
      setLoading(true);
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("সফলভাবে লগইন হয়েছে!");
            
            const savedProduct = localStorage.getItem("bazar_redirect_product");
            if (savedProduct) {
              localStorage.removeItem("bazar_redirect_product");
              router.push(`/product/${savedProduct}`);
            } else {
              router.push("/");
            }
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
          },
        }
      );

      if (error) {
        toast.error(error.message || "ইমেল বা পাসওয়ার্ড সঠিক নয়");
      }
    } catch (err) {
      console.error("Sign In Error:", err);
      toast.error("কোথাও কোনো সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      console.error(err);
      toast.error(`${provider} দিয়ে লগইন করতে ব্যর্থ হয়েছে`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f0f4f1] flex flex-col items-center justify-center px-4 py-8 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm">
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            সাইন ইন
          </h1>
          <p className="text-sm font-medium text-gray-500">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#009247]/20 focus:border-[#009247] transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
              className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#009247]/20 focus:border-[#009247] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#009247] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#007a3b] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>অপেক্ষা করুন...</span>
              </>
            ) : (
              "সাইন ইন"
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400 font-semibold">
            অথবা
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={socialLoading !== null}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 hover:border-gray-300 rounded-xl bg-white text-gray-900 transition cursor-pointer disabled:opacity-60 whitespace-nowrap shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="whitespace-nowrap text-xs font-extrabold text-gray-900">
              {socialLoading === "google" ? "লোডিং..." : "Google দিয়ে চালিয়ে যান"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={socialLoading !== null}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 hover:border-gray-300 rounded-xl bg-white text-gray-900 transition cursor-pointer disabled:opacity-60 whitespace-nowrap shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0 fill-gray-900" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="whitespace-nowrap text-xs font-extrabold text-gray-900">
              {socialLoading === "github" ? "লোডিং..." : "GitHub দিয়ে চালিয়ে যান"}
            </span>
          </button>
        </div>

        <div className="text-center pt-6">
          <p className="text-xs font-medium text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="font-bold text-[#009247] hover:underline">
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}