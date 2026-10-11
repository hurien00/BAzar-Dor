"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম ফাঁকা রাখা যাবে না");
      return;
    }

    try {
      setLoading(true);
      const { error } = await authClient.updateUser({
        name: name,
      });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করতে সমস্যা হয়েছে");
      } else {
        toast.success("সফলভাবে তথ্য আপডেট করা হয়েছে!");
        setIsEditing(false); // Close edit mode
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("কোথাও কোনো সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট করা হয়েছে!");
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f1]">
        <div className="w-8 h-8 border-4 border-[#009247] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#f0f4f1] py-8 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">আমার প্রোফাইল</h1>
            <p className="text-sm font-medium text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও পরিবর্তন করুন।</p>
          </div>
          <Link href="/" className="text-sm font-bold text-[#009247] hover:underline">
            ← হোম পেজ
          </Link>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-xs"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{session?.user?.name || "User"}</h2>
              <p className="text-xs sm:text-sm font-medium text-gray-500">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>↪</span> সাইন আউট
            </button>
          </div>
        </div>

        {/* Info & Update Form Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-gray-900">তথ্য</h3>

          {!isEditing ? (
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 block">নাম</span>
                <span className="text-sm font-bold text-gray-800">{session?.user?.name}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#009247] hover:underline cursor-pointer"
              >
                পরিবর্তন করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">নাম</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  required
                  className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#009247]/20 focus:border-[#009247] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#009247] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#007a3b] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}