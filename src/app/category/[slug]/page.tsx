"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";

const BN: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
};

const toBn = (v: string | number | undefined | null) => {
  if (v === undefined || v === null || v === "") return "০";
  return String(v).replace(/[0-9]/g, (d) => BN[d] || d);
};

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const API = "https://openapi.programming-hero.com/api/bazardor/products";

type Product = {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  change?: { dir?: "up" | "down" | "flat"; pct?: number };
};

type SortKey = "default" | "asc" | "desc";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const { data: session, isPending } = authClient.useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("default");

  // 1. Auth guard
  useEffect(() => {
    if (isPending || session) return;
    router.replace(`/signin?redirect=${encodeURIComponent(`/category/${slug}`)}`);
  }, [isPending, session, slug, router]);

  // 2. Fetch and Normalize Category Products
  useEffect(() => {
    if (!session || !slug) return;
    let cancelled = false;

    const normalizeProduct = (item: any): Product => {
      let dir: "up" | "down" | "flat" = "flat";
      let pct = 0;

      const rawChange = item.changePct ?? item.change_pct ?? item.change;
      if (rawChange && typeof rawChange === "object") {
        if (rawChange.dir) dir = rawChange.dir;
        if (rawChange.pct !== undefined) pct = parseFloat(rawChange.pct);
      } else if (rawChange !== undefined && rawChange !== null) {
        const num = parseFloat(String(rawChange).replace("%", "").trim());
        if (!isNaN(num)) {
          dir = num > 0 ? "up" : num < 0 ? "down" : "flat";
          pct = Math.abs(num);
        }
      }

      return {
        id: item.id || item.slug || Math.random(),
        slug: item.slug || String(item.id || ""),
        nameBn: item.nameBn || item.name || "পণ্য",
        category: item.category || item.categorySlug || slug,
        categoryNameBn: item.categoryNameBn || item.category || "ক্যাটাগরি",
        categoryIcon: item.categoryIcon || item.emoji || item.image || item.icon || "📦",
        unit: item.unitBn || item.unit || "kg",
        today: item.todayPrice ?? item.today ?? item.price ?? 0,
        yesterday: item.yesterdayPrice ?? item.yesterday ?? 0,
        change: { dir, pct },
      };
    };

    const extractList = (json: any): any[] => {
      const d = json?.data ?? json;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.products)) return d.products;
      return [];
    };

    (async () => {
      setLoading(true);
      let rawList: any[] = [];

      try {
        const res = await fetch(`${API}?category=${encodeURIComponent(slug)}`);
        if (res.ok) rawList = extractList(await res.json());
      } catch (err) {
        console.error("Category fetch failed:", err);
      }

      if (!rawList.length) {
        try {
          const res = await fetch(API);
          if (res.ok) rawList = extractList(await res.json());
        } catch (err) {
          console.error("Fallback fetch failed:", err);
        }
      }

      const filtered = rawList
        .map(normalizeProduct)
        .filter(
          (p) =>
            p.category.toLowerCase() === slug.toLowerCase() ||
            p.slug.toLowerCase().includes(slug.toLowerCase())
        );

      if (!cancelled) {
        setProducts(filtered);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session, slug]);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "asc") arr.sort((a, b) => a.today - b.today);
    if (sort === "desc") arr.sort((a, b) => b.today - a.today);
    return arr;
  }, [products, sort]);

  if (isPending || !session) {
    return (
      <PageShell>
        <Skeleton />
      </PageShell>
    );
  }

  const first = products[0];

  return (
    <PageShell>
      {loading ? (
        <Skeleton />
      ) : !first ? (
        <EmptyState />
      ) : (
        <>
          {/* Title + icon */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#f5f7f5] flex items-center justify-center text-2xl border border-gray-100">
              {first.categoryIcon}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{first.categoryNameBn}</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </div>

          {/* Sort Control */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 flex justify-end items-center gap-3 shadow-2xs">
            <label htmlFor="sort" className="text-sm text-gray-500 font-medium">
              সাজান
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#009247]/30 cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
          </div>

          <p className="text-xs text-gray-500 font-medium">
            মোট {toBn(sorted.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          {/* Product cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

function ProductCard({ p }: { p: Product }) {
  const dir = p.change?.dir ?? "flat";
  const pct = Math.abs(p.change?.pct ?? 0);
  const badge =
    dir === "up"
      ? { cls: "bg-red-50 text-[#d93838]", arrow: "▲" }
      : dir === "down"
      ? { cls: "bg-green-50 text-[#009247]", arrow: "▼" }
      : { cls: "bg-gray-100 text-gray-500", arrow: "—" };

  return (
    <Link
      href={`/product/${p.slug}`}
      className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:shadow-md hover:border-[#009247]/40 transition group block"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#f5f7f5] flex items-center justify-center text-xl shrink-0 border border-gray-100">
          {p.categoryIcon}
        </div>
        <div>
          <h3 className="font-extrabold text-gray-900 group-hover:text-[#009247] transition">
            {p.nameBn}
          </h3>
          <p className="text-xs text-gray-500">প্রতি {UNIT_BN[p.unit] ?? p.unit}</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
        <div>
          <span className="text-xs text-gray-500 block">আজকের দাম</span>
          <span className="text-xl font-black text-gray-900">
            {toBn(p.today)} <span className="text-sm font-semibold">টাকা</span>
          </span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.cls}`}>
          {badge.arrow} {toBn(pct)}%
        </span>
      </div>
    </Link>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-[#f0f4f1] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">{children}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-20 bg-white rounded-2xl border border-gray-200/80" />
      <div className="h-16 bg-white rounded-2xl border border-gray-200/80" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-gray-200/80" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 py-16 px-6 text-center space-y-3">
      <div className="text-5xl font-black text-gray-300">৪০৪</div>
      <h2 className="text-xl font-extrabold text-gray-900">কোনো পণ্য পাওয়া যায়নি</h2>
      <p className="text-sm text-gray-500">
        এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা ক্যাটাগরিটি সঠিক নয়।
      </p>
      <Link
        href="/"
        className="inline-block mt-2 bg-[#009247] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#007a3b] transition shadow-md"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}