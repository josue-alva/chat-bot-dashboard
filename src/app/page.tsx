// src/app/page.tsx
import MessagesTable, { type Message } from "./components/MessagesTable";

export default async function Home() {
  const res = await fetch(`/api/dashboard`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API /dashboard ${res.status}: ${text.slice(0,200)}`);
  }

  const data = (await res.json()) as {
    ok: boolean;
    users: number;
    messages: Message[];
  };

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
}