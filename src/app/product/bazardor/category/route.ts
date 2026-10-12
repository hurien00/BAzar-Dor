import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "chal";

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/bazardor/products?category=${category}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, data: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}