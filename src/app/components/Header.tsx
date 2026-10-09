"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id?: string | number;
  slug?: string;
  nameBn?: string;
  icon?: string;
  [key: string]: unknown;
}

interface Product {
  id?: string | number;
  slug?: string;
  nameBn?: string;
  category?: string;
  categoryNameBn?: string;
  today?: number | string;
  price?: number | string;
  unitBn?: string;
  unit?: string;
  changePct?: number | string;
  change_pct?: number | string;
  change?: number | string | { dir?: string; pct?: string | number };
  isUp?: boolean;
  emoji?: string;
  categoryIcon?: string;
  image?: string;
  [key: string]: unknown;
}

// English numbers to Bangla digits converter
const toBanglaDigit = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null || num === "") return "০";
  const banglaDigits: { [key: string]: string } = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
};

export default function Header() {
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "user" });
  const [showDropdown, setShowDropdown] = useState(false);

  // Dynamic Date State
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

    async function fetchData() {
      try {
        setLoading(true);

        const [catRes, prodRes] = await Promise.all([
          fetch("https://api.api-store.workers.dev/api/bazardor/categories"),
          fetch("https://api.api-store.workers.dev/api/bazardor/products"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          const list = Array.isArray(catData)
            ? catData
            : catData.categories || catData.data || catData.result || [];
          setCategories(list);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const list = Array.isArray(prodData)
            ? prodData
            : prodData.products || prodData.data || prodData.result || [];
          setProducts(list);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcfdfd] border-b border-gray-200 text-gray-800 font-sans">
      {/* 1. Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Dynamic Bangla Date */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-[#009247] p-2 flex items-center justify-center shadow-xs">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#009247] transition">
                বাজার দর
              </span>
              <span className="text-xs text-gray-500 font-medium min-h-[16px]">
                {formattedDate}
              </span>
            </div>
          </Link>

          {/* Right Side: Auth Buttons */}
          <div className="flex items-center gap-5">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 rounded-full hover:bg-gray-100 transition focus:outline-hidden"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden relative">
                    <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      প্রোফাইল
                    </Link>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  href="/login"
                  className="text-base font-semibold text-gray-900 hover:text-[#009247] transition px-2 py-1"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-base font-semibold text-white bg-[#008a3d] hover:bg-[#007a36] rounded-xl shadow-md transition-all duration-200"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Categories Row */}
      <div className="border-t border-gray-100 bg-[#f9fbf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start md:justify-center space-x-6 overflow-x-auto py-3 no-scrollbar">
            {loading ? (
              <div className="flex gap-6 py-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              categories.map((cat, index) => {
                const name = cat.nameBn || (cat.name as string) || "";
                const icon = cat.icon || "📦";
                const href = `/category/${cat.slug || cat.id || index}`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={cat.id || index}
                    href={href}
                    className={`flex items-center gap-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 px-3 py-1.5 rounded-md ${
                      isActive
                        ? "text-[#009247] bg-green-50/80 font-bold border-b-2 border-[#009247]"
                        : "text-gray-700 hover:text-[#009247] hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base">{icon}</span>
                    <span className="text-gray-900 font-semibold">{name}</span>
                  </Link>
                );
              })
            )}
          </nav>
        </div>
      </div>

     {/* 3. Plain Text Ticker Marquee with FULL HEIGHT Divider Border */}
<div className="border-y border-gray-200/80 bg-[#f4f7f4] overflow-hidden flex items-stretch h-11">
  {loading ? (
    <div className="flex gap-4 px-6 w-full animate-pulse items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-6 w-48 bg-gray-200 rounded"></div>
      ))}
    </div>
  ) : products.length > 0 ? (
    <div
      className="flex w-max animate-marquee hover:[animation-play-state:paused] items-stretch"
      style={{ animationDuration: "90s" }}
    >
      {[...products, ...products, ...products].map((item, idx) => {
        const productName = item.nameBn || "পণ্য";
        
        // Extract Today price safely from API
        const rawPrice = item.today ?? item.price ?? "";
        const priceText = rawPrice !== "" ? toBanglaDigit(rawPrice) : "";
        
        const unitRaw = item.unitBn || item.unit || "kg";
        const unitText = unitRaw === "kg" ? "কেজি" : unitRaw;

        let isUp = true;
        let changeStr = "০.০%";

        const rawChange = item.changePct ?? item.change_pct ?? item.change;
        if (rawChange !== undefined && rawChange !== null) {
          if (typeof rawChange === "object") {
            const cObj = rawChange as Record<string, unknown>;
            if (cObj.dir) isUp = cObj.dir === "up";
            if (cObj.pct !== undefined) changeStr = `${toBanglaDigit(cObj.pct)}%`;
          } else {
            const num = parseFloat(String(rawChange).replace("%", "").trim());
            if (!isNaN(num)) {
              isUp = num >= 0;
              changeStr = `${toBanglaDigit(Math.abs(num).toFixed(1))}%`;
            }
          }
        }

        const icon = item.categoryIcon || item.image || item.emoji || item.icon || "🍚";

        return (
          <div
            key={idx}
            className="flex items-center gap-3.5 px-6 border-r border-gray-300/80 self-stretch whitespace-nowrap text-base font-semibold text-gray-900"
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="font-bold text-gray-900">{productName}</span>
            {priceText && (
              <span className="text-gray-800 font-semibold">
                {priceText} টাকা/{unitText}
              </span>
            )}
            <span
              className={`flex items-center gap-1 font-bold ${
                isUp ? "text-[#d93838]" : "text-[#009247]"
              }`}
            >
              <span className="text-xs">{isUp ? "▲" : "▼"}</span>
              {changeStr}
            </span>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="px-6 text-xs text-gray-400 flex items-center">কোনো তথ্য পাওয়া যায়নি</div>
  )}
</div>
    </header>
  );
}