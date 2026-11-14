"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STATUS } from "@/lib/format";

async function call(url, method, data) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: data ? JSON.stringify(data) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { alert(j.error || "Greška"); return false; }
  return true;
}

export function DeleteButton({ url, confirmText = "Da li ste sigurni?", redirectTo, label = "Obriši" }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (!confirm(confirmText)) return;
        if (await call(url, "DELETE")) redirectTo ? router.push(redirectTo) : router.refresh();
      }}
      className="text-sm text-red-600 hover:underline"
    >
      {label}
    </button>
  );
}

export function OrderStatusSelect({ id, status }) {
  const router = useRouter();
  const [v, setV] = useState(status);
  return (
    <select
      value={v}
      onChange={async (e) => {
        const next = e.target.value;
        if (next === "OTKAZANA" && !confirm("Otkazivanjem se artikli vraćaju na stanje. Nastaviti?")) return;
        if (await call(`/api/admin/orders/${id}`, "PUT", { status: next })) { setV(next); router.refresh(); }
      }}
      className="input w-auto py-1"
      aria-label="Status porudžbine"
    >
      {Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  );
}

export function RoleToggle({ id, role }) {
  const router = useRouter();
  const next = role === "ADMIN" ? "CUSTOMER" : "ADMIN";
  return (
    <button
      onClick={async () => { if (confirm(next === "ADMIN" ? "Dodeliti administratorska prava?" : "Ukloniti administratorska prava?")) if (await call(`/api/admin/users/${id}`, "PUT", { role: next })) router.refresh(); }}
      className="text-sm text-ford hover:underline"
    >
      {role === "ADMIN" ? "Ukloni admin" : "Postavi za admina"}
    </button>
  );
}

export function MessageRead({ id, read }) {
  const router = useRouter();
  return (
    <button onClick={async () => { if (await call(`/api/admin/messages/${id}`, "PUT", { read: !read })) router.refresh(); }} className="text-sm text-ford hover:underline">
      {read ? "Označi kao nepročitano" : "Označi kao pročitano"}
    </button>
  );
}

export function TaxonomyForm({ type }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [years, setYears] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (await call("/api/admin/models", "POST", { type, name, years })) { setName(""); setYears(""); router.refresh(); }
      }}
      className="flex flex-wrap gap-2 p-4"
    >
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder={type === "category" ? "Nova kategorija" : "Novi model (npr. Focus)"} className="input w-auto flex-1" required />
      {type !== "category" && <input value={years} onChange={(e) => setYears(e.target.value)} placeholder="Godišta (npr. 2011–2018)" className="input w-auto flex-1" />}
      <button className="btn-primary btn-sm">Dodaj</button>
    </form>
  );
}
