// src/app/api/dashboard/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db";

export async function GET() {
  try {
    const pool = getPool();

    // Cuenta de usuarios en wa_sessions (ajusta si necesitas DISTINCT por alguna columna)
    const [[{ users }]] = await pool.query<any[]>(
      `SELECT COUNT(*) AS users FROM wa_sessions`
    );

    // Trae todos los mensajes (ajusta columnas según tu tabla)
    const [messages] = await pool.query<any[]>(
      `SELECT name, direction, email ,message_id, reply_to_id, flow, intent_seed, text, created_at
       FROM wa_messages
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ ok: true, users, messages });
  } catch (err: any) {
    console.error("DASHBOARD API ERROR:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "unknown",
        code: err?.code,
        errno: err?.errno,
        info: {
          DB_HOST: process.env.DB_HOST,
          DB_PORT: process.env.DB_PORT,
          DB_NAME: process.env.DB_NAME,
          NODE_ENV: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}