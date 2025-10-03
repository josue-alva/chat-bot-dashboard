// src/app/page.tsx
// Server Component that calls the external API (dashboard-api via ngrok or your domain)

export const dynamic = "force-dynamic"; // evita cache en Vercel para esta página

import MessagesTable, { type Message } from "./components/MessagesTable";

type DashboardResponse = {
  ok: boolean;
  users: number;
  messages: Message[];
};

export default async function Home() {
  const API_BASE = process.env.API_BASE;
  const API_KEY = process.env.API_KEY;

  if (!API_BASE) {
    throw new Error(
      "Missing env API_BASE in Next.js (Vercel Settings ▸ Environment Variables)."
    );
  }

  // ¡OJO!: con Caddy/ngrok tu API pública cuelga de /api/*
  const url = `${API_BASE.replace(/\/+$/, "")}/api/dashboard`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: API_KEY ? { "X-API-Key": API_KEY } : {},
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`External API /api/dashboard ${res.status}: ${text.slice(0, 500)}`);
    }

    const data = (await res.json()) as DashboardResponse;

    return (
      <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-1 rounded-lg border border-gray-200 bg-white shadow-sm p-5 text-black">
            <div className="text-sm text-gray-500">Usuarios registrados</div>
            <div className="mt-1 text-3xl font-semibold">{data.users}</div>
          </div>

          <div className="col-span-1 rounded-lg border border-gray-200 bg-white shadow-sm p-5 text-black">
            <div className="text-sm text-gray-500">Leads Generados</div>
            <div className="mt-1 text-3xl font-semibold">{data.users}</div>
          </div>
        </section>

        <MessagesTable messages={data.messages} />
      </main>
    );
  } catch (err: any) {
    // Render amigable (y no truena en Vercel)
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-xl font-semibold text-red-600">No se pudo cargar el dashboard</h1>
        <pre className="text-sm bg-gray-100 p-3 rounded">
          {String(err?.message ?? err)}
        </pre>
      </main>
    );
  }
}