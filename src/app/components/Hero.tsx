"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setFormattedDate(today.toLocaleDateString("bn-BD", options));
  }, []);

  const scrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("সব-পণ্য");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // Outer section color matches the 2nd picture background
    <section className="w-full bg-[#f0f4f1] py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Inner Card Container with exact background & compact height */}
        <div className="relative overflow-hidden rounded-3xl bg-[#f4f7f4] border border-gray-200/60 p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          
          {/* Left Text Content Area */}
          <div className="flex-1 space-y-3.5 text-left max-w-2xl">
            
            {/* Dynamic Date Badge */}
            <div className="inline-block bg-[#e1eee4] text-[#008a3d] text-xs md:text-sm font-semibold px-3.5 py-1 rounded-full shadow-2xs">
              {formattedDate }
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-snug">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-xl">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত,
              গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* CTA Button */}
            <div className="pt-1.5">
              <a
                href="#সব-পণ্য"
                onClick={scrollToProducts}
                className="inline-flex items-center justify-center bg-[#009247] hover:bg-[#007a3c] text-white font-semibold text-sm md:text-base px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                সব পণ্য দেখুন
              </a>
            </div>
          </div>

          {/* Right Banner Image (Compact & Scaled down) */}
          <div className="w-full md:w-auto flex justify-center md:justify-end flex-shrink-0">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর হিরো ব্যানার"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}