// src/app/page.tsx
import { headers } from "next/headers";
import MessagesTable, { type Message } from "./components/MessagesTable";

export default async function Home() {
  const h = await headers();
  const host = h.get("host")!;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;

  // const res = await fetch(`${base}/api/dashboard`, { cache: "no-store" });
  // if (!res.ok) {
  //   const text = await res.text();
  //   throw new Error(`API /dashboard ${res.status}: ${text.slice(0, 300)}`);
  // }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
    cache: "no-store",
    headers: { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY! },
  });

  const data = (await res.json()) as {
    ok: boolean;
    users: number;
    messages: Message[];
  };

  return (
    <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Tarjeta: total usuarios que utilizaron el chat bot*/}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1 sm:col-span-1 rounded-lg border border-gray-200 bg-white shadow-sm p-5 text-black">
          <div className="text-sm text-gray-500">Usuarios registrados</div>
          <div className="mt-1 text-3xl font-semibold">{data.users}</div>
        </div>

        <div className="col-span-1 sm:col-span-1 rounded-lg border border-gray-200 bg-white shadow-sm p-5 text-black">
          <div className="text-sm text-gray-500">Leads Generados</div>
          <div className="mt-1 text-3xl font-semibold">{data.users}</div>
        </div>  
      </section>
      

      {/* Tabla con filtros y orden */}
      <MessagesTable messages={data.messages} />
    </main>
  );
}