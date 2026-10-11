import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("id") || "1";

  // Map slug or ID to API numeric ID (1, 2, 3 etc.)
  let apiId = "1";
  if (/^\d+$/.test(rawId)) {
    apiId = rawId;
  } else if (rawId.includes("moric") || rawId.includes("chili") || rawId.includes("2")) {
    apiId = "2";
  } else if (rawId.includes("alu") || rawId.includes("potato") || rawId.includes("3")) {
    apiId = "3";
  } else {
    apiId = "1";
  }

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/bazardor/products/${apiId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, data: null }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}