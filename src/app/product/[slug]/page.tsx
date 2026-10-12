"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const BN: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
};
const toBn = (v: string | number) => String(v).replace(/[0-9]/g, (d) => BN[d]);
const fmt = (n: number) => toBn(Number.isInteger(n) ? n : n.toFixed(2));

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

type Market = { market: string; division: string; min: number; max: number };
type Row = Market & { avg: number };

type Product = {
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  unitBn: string;
  today: number;
  yesterday: number;
  changePct: number;
  dir: "up" | "down" | "flat";
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  minMarket: string;
  maxMarket: string;
  rows: Row[];
};

// API response 
function normalize(d: any): Product {
  const rows: Row[] = (d.markets ?? []).map((m: Market) => ({
    ...m,
    avg: (m.min + m.max) / 2,
  }));

  const minRow = rows.reduce((a, b) => (b.min < a.min ? b : a), rows[0]);
  const maxRow = rows.reduce((a, b) => (b.max > a.max ? b : a), rows[0]);
  const avg = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.avg, 0) / rows.length)
    : d.today;

  return {
    slug: d.slug,
    nameBn: d.nameBn,
    categoryNameBn: d.categoryNameBn,
    categoryIcon: d.categoryIcon,
    image: d.image || d.categoryIcon,
    unitBn: UNIT_BN[d.unit] ?? d.unit,
    today: d.today,
    yesterday: d.yesterday,
    changePct: Math.abs(d.change?.pct ?? 0),
    dir: d.change?.dir ?? "flat",
    minPrice: minRow?.min ?? d.today,
    maxPrice: maxRow?.max ?? d.today,
    avgPrice: avg,
    minMarket: minRow?.market ?? "",
    maxMarket: maxRow?.market ?? "",
    rows,
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Auth guard: if not login go to sign
  useEffect(() => {
    if (isPending || session) return;
    if (slug) localStorage.setItem("bazar_redirect_product", String(slug));
    router.replace(`/signin?redirect=${encodeURIComponent(`/product/${slug}`)}`);
  }, [isPending, session, slug, router]);

  // 2. Data fetch
  useEffect(() => {
    if (!session || !slug) return;
    let cancelled = false;

    const pick = (json: any): any | null => {
      const d = json?.data ?? json;
      const list = Array.isArray(d) ? d : Array.isArray(d?.products) ? d.products : [d];
      return list.find((p: any) => p && (p.slug === slug || String(p.id) === slug)) ?? null;
    };

    (async () => {
      setLoading(true);
      let found: any = null;

      for (const url of [
        "https://openapi.programming-hero.com/api/bazardor/products",
        `/api/bazardor?slug=${encodeURIComponent(slug)}`,
      ]) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          found = pick(await res.json());
          if (found) break;
        } catch (err) {
          console.error("Fetch failed:", url, err);
        }
      }

      if (!cancelled) {
        setProduct(found ? normalize(found) : null);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session, slug]);

  if (isPending || !session || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f1] text-gray-500 font-semibold">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f0f4f1]">
        <p className="text-gray-700 font-bold">পণ্যটি পাওয়া যায়নি</p>
        <Link href="/" className="text-[#009247] font-semibold hover:underline">
          হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  const diff = Math.abs(product.today - product.yesterday);
  const trendText =
    product.dir === "up" ? "বেড়েছে" : product.dir === "down" ? "কমেছে" : "অপরিবর্তিত";
  const trendColor =
    product.dir === "up" ? "text-[#d93838]" : product.dir === "down" ? "text-[#009247]" : "text-gray-500";
  const trendArrow = product.dir === "up" ? "▲" : product.dir === "down" ? "▼" : "–";

  return (
    <div className="w-full min-h-screen bg-[#f0f4f1] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-[#009247] transition">হোম</Link>
          <span>&gt;</span>
          <span>{product.categoryNameBn}</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-bold">{product.nameBn}</span>
        </nav>

        {/* Top Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f5f7f5] flex items-center justify-center text-3xl sm:text-4xl shrink-0 border border-gray-100">
              {product.image}
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {product.nameBn}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500">
                <span>প্রতি {product.unitBn}</span>
                <span>•</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs font-bold">
                  {product.categoryIcon} {product.categoryNameBn}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 pt-1">
                গতকালের তুলনায় আজ দাম{" "}
                <span className="font-bold text-gray-900">{trendText}</span>
                {diff > 0 && <> - {fmt(diff)} টাকা</>}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto bg-[#f8faf8] border border-gray-200/80 rounded-2xl p-4 sm:px-6 text-center min-w-[160px] flex flex-col justify-center">
            <span className="text-xs font-bold text-gray-400 mb-1">আজকের দাম</span>
            <div className="text-3xl sm:text-4xl font-black text-gray-900">{fmt(product.today)}</div>
            <span className="text-xs font-semibold text-gray-600 mt-0.5">টাকা / {product.unitBn}</span>
            <div className={`text-xs font-bold mt-2 ${trendColor}`}>
              {trendArrow} {fmt(product.changePct)}%
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-gray-900">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard label="সর্বনিম্ন দাম" value={product.minPrice} color="text-[#009247]" note={`সবচেয়ে কম দামের বাজার: ${product.minMarket}`} />
            <SummaryCard label="সর্বাধিক দাম" value={product.maxPrice} color="text-[#d93838]" note={`সবচেয়ে বেশি দামের বাজার: ${product.maxMarket}`} />
            <SummaryCard label="গড় দাম" value={product.avgPrice} color="text-[#009247]" note={`প্রতি ${product.unitBn}-এর হিসাব`} />
          </div>
        </div>

        {/* Market table */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 border-b border-gray-100">
                    <th className="pb-3.5 px-4">বাজার</th>
                    <th className="pb-3.5 px-4">বিভাগ</th>
                    <th className="pb-3.5 px-4 text-center">সর্বনিম্ন</th>
                    <th className="pb-3.5 px-4 text-center">সর্বাধিক</th>
                    <th className="pb-3.5 px-4 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {product.rows.length ? (
                    product.rows.map((m, i) => (
                      <tr key={m.market} className={`border-b border-gray-100 ${i % 2 ? "bg-[#f8faf8]" : "bg-white"}`}>
                        <td className="py-4 px-4 font-extrabold text-gray-900">{m.market}</td>
                        <td className="py-4 px-4 font-semibold text-gray-600">{m.division}</td>
                        <td className="py-4 px-4 text-center font-semibold text-gray-800">{fmt(m.min)} টাকা</td>
                        <td className="py-4 px-4 text-center font-semibold text-gray-800">{fmt(m.max)} টাকা</td>
                        <td className="py-4 px-4 text-right font-black text-gray-900">{fmt(m.avg)} টাকা</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500 font-semibold">
                        কোনো বাজারের তথ্য পাওয়া যায়নি
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, note }: { label: string; value: number; color: string; note: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 space-y-2">
      <span className="text-xs font-bold text-gray-400 block">{label}</span>
      <div className={`text-2xl font-black ${color}`}>
        {fmt(value)} <span className="text-base font-bold">টাকা</span>
      </div>
      <span className="text-xs font-medium text-gray-500 block">{note}</span>
    </div>
  );
}
