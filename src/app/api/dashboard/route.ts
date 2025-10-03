/* eslint-disable @typescript-eslint/no-explicit-any */


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.API_BASE!;   // ← tu ngrok url (en Vercel ENV)
  const key  = process.env.API_KEY!;    // ← el token seguro

  try {
    const r = await fetch(`${base}/dashboard`, {
      headers: { "X-API-Key": key },
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err: any) {
    console.error("Proxy /dashboard error:", err);
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}