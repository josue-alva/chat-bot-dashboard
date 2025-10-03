// src/app/api/db-ping/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.API_BASE!;
  const key  = process.env.API_KEY!;

  try {
    const r = await fetch(`${base}/api/db-ping`, {
      headers: { "X-API-Key": key },
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err: any) {
    console.error("Proxy /db-ping error:", err);
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}