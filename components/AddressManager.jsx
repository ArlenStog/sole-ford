"use client";
import { useState } from "react";

const empty = (name, phone) => ({ label: "Kućna adresa", fullName: name, street: "", city: "", postalCode: "", phone, isDefault: false });

export default function AddressManager({ initial, defaultName, defaultPhone }) {
  const [list, setList] = useState(initial);
  const [edit, setEdit] = useState(null); // null | {id?, ...fields}
  const [error, setError] = useState("");

  async function reload() {
    setList(await fetch("/api/account/addresses").then((r) => r.json()));
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    const { id, userId, ...data } = edit;
    const r = await fetch(id ? `/api/account/addresses/${id}` : "/api/account/addresses", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const j = await r.json();
    if (!r.ok) return setError(j.error);
    setEdit(null);
    reload();
  }

  async function del(id) {
    if (!confirm("Obrisati ovu adresu?")) return;
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    reload();
  }

  const f = (k) => ({ value: edit[k] ?? "", onChange: (e) => setEdit((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value })) });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((a) => (
          <div key={a.id} className="card p-4 text-sm">
            <div className="flex items-center justify-between">
              <b>{a.label}</b>
              {a.isDefault && <span className="badge bg-ford text-white">Podrazumevana</span>}
            </div>
            <p className="mt-2 text-gray-700">{a.fullName}<br />{a.street}<br />{a.postalCode} {a.city}<br />{a.phone}</p>
            <div className="mt-3 flex gap-3">
              <button onClick={() => setEdit(a)} className="text-ford hover:underline">Izmeni</button>
              <button onClick={() => del(a.id)} className="text-red-600 hover:underline">Obriši</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-gray-600">Nemate sačuvanih adresa.</p>}
      </div>
      {!edit && <button onClick={() => setEdit(empty(defaultName, defaultPhone))} className="btn-primary">+ Dodaj adresu</button>}
      {edit && (
        <form onSubmit={save} className="card grid gap-4 p-5 sm:grid-cols-2">
          <h3 className="font-bold sm:col-span-2">{edit.id ? "Izmena adrese" : "Nova adresa"}</h3>
          <div><label className="label" htmlFor="a-label">Naziv (npr. Kuća, Posao)</label><input id="a-label" className="input" required {...f("label")} /></div>
          <div><label className="label" htmlFor="a-name">Ime i prezime</label><input id="a-name" className="input" required {...f("fullName")} /></div>
          <div><label className="label" htmlFor="a-street">Ulica i broj</label><input id="a-street" className="input" required {...f("street")} /></div>
          <div><label className="label" htmlFor="a-city">Grad</label><input id="a-city" className="input" required {...f("city")} /></div>
          <div><label className="label" htmlFor="a-zip">Poštanski broj</label><input id="a-zip" className="input" required {...f("postalCode")} /></div>
          <div><label className="label" htmlFor="a-phone">Telefon</label><input id="a-phone" className="input" required {...f("phone")} /></div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={!!edit.isDefault} onChange={f("isDefault").onChange} /> Postavi kao podrazumevanu</label>
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <button className="btn-primary">Sačuvaj</button>
            <button type="button" onClick={() => setEdit(null)} className="btn-outline">Otkaži</button>
          </div>
        </form>
      )}
    </div>
  );
}
