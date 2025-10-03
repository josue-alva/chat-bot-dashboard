"use client";

import { useMemo, useState } from "react";

export type Message = {
  message_id: string;
  reply_to_id: string | null;
  flow: string | null;
  intent_seed: string | null;
  text: string | null;
  created_at?: string | null;
  // Opcionales si tu SELECT los devuelve
  name?: string | null;
  email?: string | null;
  direction?: string | null;
};

type Props = {
  messages: Message[];
};

type SortKey = "created_at" | "name" | "email" | "intent_seed" | "direction";
type SortDir = "asc" | "desc";

export default function MessagesTable({ messages }: Props) {
  // UI state
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState<string>("__ALL__");
  const [direction, setDirection] = useState<string>("__ALL__");

  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Opciones únicas para el combo de intent
  const intents = useMemo(() => {
    const set = new Set<string>();
    for (const m of messages) if (m.intent_seed) set.add(m.intent_seed);
    return ["__ALL__", ...Array.from(set).sort()];
  }, [messages]);

    // Opciones únicas para el combo de dirección
  const directions = useMemo(() => {
    const set = new Set<string>();
    for (const m of messages) if (m.direction) set.add(m.direction);
    return ["__ALL__", ...Array.from(set).sort()];
  }, [messages]);


  // Filtrado + orden
  const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();

  const rows = messages.filter((m) => {
    const intentOk = intent === "__ALL__" || m.intent_seed === intent;
    const dirOk = direction === "__ALL__" || m.direction === direction;

    if (!q) return intentOk && dirOk;

    const haystack = [
      m.name ?? "",
      m.email ?? "",
      m.intent_seed ?? "",
      m.direction ?? "",   // <- incluir direction en el texto buscable
      m.text ?? "",
      m.message_id ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return intentOk && dirOk && haystack.includes(q);
  });

  rows.sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;

    const get = (m: Message) => {
      if (sortKey === "created_at") {
        const t = m.created_at ? Date.parse(m.created_at) : -Infinity;
        return t;
      }
      return (m[sortKey] ?? "").toString().toLowerCase();
    };

    const av = get(a);
    const bv = get(b);

    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  return rows;
}, [messages, query, intent, direction, sortKey, sortDir]);

  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm text-black scrollbar max-h-[600px] overflow-y-auto">
      {/* Filtros */}
      <div className="px-4 py-3 border-b border-gray-200 grid gap-3 md:grid-cols-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Buscar</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, email, mensaje…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Intent</label>
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {intents.map((v) => (
              <option key={v} value={v}>
                {v === "__ALL__" ? "Todos" : v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Dirección</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {directions.map((v) => (
              <option key={v} value={v}>
                {v === "__ALL__" ? "Todos" : v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Ordenar por</label>
          <select
            value={`${sortKey}:${sortDir}`}
            onChange={(e) => {
              const [k, d] = e.target.value.split(":") as [SortKey, SortDir];
              setSortKey(k);
              setSortDir(d);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="created_at:desc">Fecha ↓</option>
            <option value="created_at:asc">Fecha ↑</option>
            <option value="name:asc">Nombre A–Z</option>
            <option value="name:desc">Nombre Z–A</option>
            <option value="email:asc">Email A–Z</option>
            <option value="email:desc">Email Z–A</option>
            <option value="intent_seed:asc">Intent A–Z</option>
            <option value="intent_seed:desc">Intent Z–A</option>
          </select>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500">
        <span>
          Mostrando <b>{filtered.length}</b> de <b>{messages.length}</b> registros
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Correo</th>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium">Interés en</th>
              <th className="px-4 py-2 font-medium">Mensaje</th>
              <th className="px-4 py-2 font-medium">Fecha mensaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((m) => (
              <tr key={m.message_id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{m.name ?? "—"}</td>
                <td className="px-4 py-2">{m.email ?? "—"}</td>
                <td className="px-4 py-2">{m.direction ?? "—"}</td>
                <td className="px-4 py-2">{m.intent_seed ?? "—"}</td>
                <td className="px-4 py-2 whitespace-pre-wrap">{m.text ?? "—"}</td>
                <td className="px-4 py-2">
                  {m.created_at ? new Date(m.created_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}