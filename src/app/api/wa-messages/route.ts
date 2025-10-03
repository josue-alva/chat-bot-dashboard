// src/app/api/wa-messages/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const base = process.env.API_BASE!;
  const key  = process.env.API_KEY!;
  const url  = new URL(req.url);
  const limit = url.searchParams.get("limit") || "100";

  try {
    const r = await fetch(`${base}/wa-messages?limit=${limit}`, {
      headers: { "X-API-Key": key },
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err: any) {
    console.error("Proxy /wa-messages error:", err);
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}