// src/app/api/db-ping/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await getPool().query("SELECT 1 AS ok");
    return NextResponse.json({ ok: true, rows });
  } catch (err: any) {
    // log al server para ver pila completa
    console.error("DB-PING ERROR:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || String(err),
        errno: err?.errno,
        code: err?.code,
        sqlState: err?.sqlState,
        sqlMessage: err?.sqlMessage,
        stack: err?.stack,
        info: {
          DB_HOST: process.env.DB_HOST,
          DB_PORT: process.env.DB_PORT,
          DB_USER: process.env.DB_USER,
          DB_NAME: process.env.DB_NAME,
          NODE_ENV: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}