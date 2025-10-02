// src/app/api/wa-messages/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 200);

    const [rows] = await getPool().query(
      `SELECT message_id, reply_to_id, flow, intent_seed, text
       FROM wa_messages
       ORDER BY message_id DESC
       LIMIT ?`,
      [limit]
    );

    return NextResponse.json({ ok: true, rows });
  } catch (err: any) {
    console.error("WA-MESSAGES ERROR:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || String(err),
        code: err?.code,
        errno: err?.errno,
        sqlState: err?.sqlState,
        sqlMessage: err?.sqlMessage,
      },
      { status: 500 }
    );
  }
}