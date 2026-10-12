"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[85vh] bg-[#f0f4f1] flex flex-col items-center justify-center px-4 py-12 font-sans text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs flex flex-col items-center space-y-5">
        
        {/* 404 Visual Icon Badge */}
        <div className="w-20 h-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-4xl shadow-2xs">
          🔍
        </div>

        <div className="space-y-1">
          <span className="text-5xl font-black text-[#009247] tracking-tight block">
            ৪০৪
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            পেজটি পাওয়া যায়নি!
          </h1>
        </div>

        {/* Descriptive Text */}
        <p className="text-xs sm:text-sm font-medium text-gray-500 leading-relaxed max-w-xs">
          আপনি যে পেজ বা প্রোডাক্টটি খুঁজছেন তা বর্তমানে মুছে ফেলা হয়েছে অথবা ঠিকানাটি ভুল লেখা হয়েছে।
        </p>

        <Link
          href="/"
          className="w-full py-3.5 bg-[#009247] hover:bg-[#007a3b] text-white text-sm font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span>←</span>
          <span>হোম পেজে ফিরে যান</span>
        </Link>

      </div>
    </div>
  );
}