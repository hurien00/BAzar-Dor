"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

// API Response Structure 
interface Product {
  id: string | number;
  slug?: string;
  nameBn?: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit?: string;
  today?: number | string;
  yesterday?: number | string;
  lastWeek?: number | string;
  lastMonth?: number | string;
  change?: {
    dir?: "up" | "down" | "flat" | string;
    pct?: number | string;
  };
  [key: string]: unknown;
}

const getRawPrice = (item: Product): number => {
  const p = item.today ?? item.yesterday ?? 0;
  if (typeof p === "number") return p;
  const parsed = parseFloat(String(p));
  return isNaN(parsed) ? 0 : parsed;
};

// 2. Convert English digits to Bangla digits
const toBanglaDigit = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null || num === "") return "০";
  const banglaDigits: { [key: string]: string } = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
};

const formatBanglaPrice = (priceVal: number): string => {
  if (!priceVal || isNaN(priceVal)) return "০";
  return toBanglaDigit(priceVal.toLocaleString("en-IN"));
};

const getEmojiForProduct = (item: Product): string => {
  return item.categoryIcon || item.image || "📦";
};

export default function ProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products");
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.products || data.data || [];
          setProducts(list);
        }
      } catch (error) {
        console.error("Products API Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const getProductChangeDetails = (item: Product) => {
    const cObj = item.change;
    let dir = cObj?.dir || "flat";
    let pct = typeof cObj?.pct === "number" ? cObj.pct : parseFloat(String(cObj?.pct || 0));
    if (isNaN(pct)) pct = 0;

    const banglaPct = toBanglaDigit(Math.abs(pct).toFixed(1)) + "%";

    if (dir === "up" && pct > 0) {
      return { dir: "up", pctText: `▲ ${banglaPct}`, val: pct };
    }
    if (dir === "down" || pct < 0) {
      return { dir: "down", pctText: `▼ ${banglaPct}`, val: -Math.abs(pct) };
    }
    return { dir: "flat", pctText: `— ${toBanglaDigit("0.0")}%`, val: 0 };
  };

  // Section A: Top 6 Risers 
  const topRisers = useMemo(() => {
    return [...products]
      .map((p) => ({ product: p, changeInfo: getProductChangeDetails(p) }))
      .filter((item) => item.changeInfo.dir === "up")
      .sort((a, b) => b.changeInfo.val - a.changeInfo.val)
      .slice(0, 6)
      .map((item) => item.product);
  }, [products]);

  // Section B: Top 6 Fallers
  const topFallers = useMemo(() => {
    return [...products]
      .map((p) => ({ product: p, changeInfo: getProductChangeDetails(p) }))
      .filter((item) => item.changeInfo.dir === "down")
      .sort((a, b) => a.changeInfo.val - b.changeInfo.val)
      .slice(0, 6)
      .map((item) => item.product);
  }, [products]);

  // Section C: Sort All Products (Pure mathematical sorting using 'today' price)
  const sortedAllProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "price-asc") {
      return list.sort((a, b) => getRawPrice(a) - getRawPrice(b));
    }
    if (sortBy === "price-desc") {
      return list.sort((a, b) => getRawPrice(b) - getRawPrice(a));
    }
    return list;
  }, [products, sortBy]);

  // Product Card Component
  const ProductCard = ({ item }: { item: Product }) => {
    const changeInfo = getProductChangeDetails(item);
    const emoji = getEmojiForProduct(item);
    const price = getRawPrice(item);
    const unitStr = item.unit ? (item.unit === "kg" ? "কেজি" : item.unit) : "কেজি";

    return (
      <Link
        href={`/product/${item.slug || item.id}`}
        className="block bg-white border border-gray-200/80 rounded-2xl p-4 md:p-5 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f5f7f5] flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate group-hover:text-[#009247] transition">
              {item.nameBn || "পণ্য"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              প্রতি {unitStr}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
          <div>
            <span className="block text-[11px] sm:text-xs text-gray-400 font-medium">
              আজকের দাম
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900">
              {formatBanglaPrice(price)}{" "}
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                টাকা
              </span>
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-md text-xs sm:text-sm font-bold flex items-center gap-1 ${
              changeInfo.dir === "up"
                ? "bg-red-50 text-[#d93838]"
                : changeInfo.dir === "down"
                ? "bg-emerald-50 text-[#0f9f6e]"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {changeInfo.pctText}
          </div>
        </div>
      </Link>
    );
  };

  const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200/80 rounded-2xl p-5 animate-pulse space-y-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/3 pt-2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#f0f4f1] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* SECTION A */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-lg sm:text-xl font-black">▲</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              আজ দাম বেড়েছে
            </h2>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {topRisers.map((p) => (
                <ProductCard key={p.id} item={p} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION B */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#009247] text-lg sm:text-xl font-black">▼</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              আজ দাম কমেছে
            </h2>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {topFallers.map((p) => (
                <ProductCard key={p.id} item={p} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION C: sorting*/}
        <section id="সব-পণ্য" className="space-y-4 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                সব পণ্য
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                মোট {toBanglaDigit(products.length)}টি পণ্য দেখানো হচ্ছে
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs sm:text-sm font-medium text-gray-600">সাজান:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-3.5 py-2 pr-9 text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#009247]/20 focus:border-[#009247] transition-all"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="price-asc">দাম: কম থেকে বেশি</option>
                  <option value="price-desc">দাম: বেশি থেকে কম</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={9} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {sortedAllProducts.map((p) => (
                <ProductCard key={p.id} item={p} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}