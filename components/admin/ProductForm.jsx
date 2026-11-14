"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CONDITIONS = ["Polovno - ispravno", "Polovno - odlično stanje", "Polovno - potrebna sitna popravka", "Novo - originalno", "Novo - zamenski deo"];

export default function ProductForm({ product, models, categories }) {
  const router = useRouter();
  const [f, setF] = useState(
    product || { name: "", sku: "", partNumber: "", description: "", price: "", oldPrice: "", stock: 1, condition: CONDITIONS[0], image: "", featured: false, active: true, carModelId: "", categoryId: "" }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await r.json();
    setUploading(false);
    if (!r.ok) return setError(j.error);
    setF((s) => ({ ...s, image: j.url }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...f,
      partNumber: f.partNumber || null,
      oldPrice: f.oldPrice === "" || f.oldPrice === null ? null : Number(f.oldPrice),
      image: f.image || null,
      carModelId: f.carModelId ? Number(f.carModelId) : null,
      categoryId: f.categoryId ? Number(f.categoryId) : null,
    };
    delete payload.id; delete payload.slug; delete payload.createdAt; delete payload.carModel; delete payload.category;
    const r = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();
    setSaving(false);
    if (!r.ok) return setError(j.error);
    router.push("/admin/proizvodi");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 md:grid-cols-2">
      <div className="md:col-span-2"><label className="label" htmlFor="p-name">Naziv *</label><input id="p-name" className="input" required value={f.name} onChange={set("name")} /></div>
      <div><label className="label" htmlFor="p-sku">Šifra artikla (SKU) *</label><input id="p-sku" className="input" required value={f.sku} onChange={set("sku")} /></div>
      <div><label className="label" htmlFor="p-pn">Kataloški broj (OEM)</label><input id="p-pn" className="input" value={f.partNumber || ""} onChange={set("partNumber")} /></div>
      <div><label className="label" htmlFor="p-model">Model</label>
        <select id="p-model" className="input" value={f.carModelId || ""} onChange={set("carModelId")}>
          <option value="">— bez modela (univerzalno) —</option>
          {models.map((m) => <option key={m.id} value={m.id}>Ford {m.name}</option>)}
        </select>
      </div>
      <div><label className="label" htmlFor="p-cat">Kategorija</label>
        <select id="p-cat" className="input" value={f.categoryId || ""} onChange={set("categoryId")}>
          <option value="">— bez kategorije —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div><label className="label" htmlFor="p-price">Cena (RSD) *</label><input id="p-price" type="number" min="0" className="input" required value={f.price} onChange={set("price")} /></div>
      <div><label className="label" htmlFor="p-old">Stara cena (za akciju)</label><input id="p-old" type="number" min="0" className="input" value={f.oldPrice ?? ""} onChange={set("oldPrice")} placeholder="Ostavite prazno ako nije na akciji" /></div>
      <div><label className="label" htmlFor="p-stock">Količina na stanju *</label><input id="p-stock" type="number" min="0" className="input" required value={f.stock} onChange={set("stock")} /></div>
      <div><label className="label" htmlFor="p-cond">Stanje dela</label>
        <select id="p-cond" className="input" value={f.condition} onChange={set("condition")}>
          {[...new Set([...CONDITIONS, f.condition])].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="md:col-span-2"><label className="label" htmlFor="p-desc">Opis *</label><textarea id="p-desc" rows={6} className="input" required value={f.description} onChange={set("description")} /></div>
      <div className="md:col-span-2">
        <span className="label">Slika</span>
        <div className="flex flex-wrap items-center gap-4">
          {f.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.image} alt="" className="h-24 w-32 rounded object-cover" />
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="text-sm" aria-label="Otpremi sliku" />
          {uploading && <span className="text-sm text-gray-500">Otpremanje…</span>}
          {f.image && <button type="button" onClick={() => setF((s) => ({ ...s, image: "" }))} className="text-sm text-red-600 hover:underline">Ukloni sliku</button>}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.featured} onChange={set("featured")} /> Izdvojeno na početnoj</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.active} onChange={set("active")} /> Aktivno (vidljivo u prodavnici)</label>
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</p>}
      <div className="flex gap-2 md:col-span-2">
        <button disabled={saving || uploading} className="btn-primary">{saving ? "Čuvanje…" : "Sačuvaj"}</button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Otkaži</button>
      </div>
    </form>
  );
}
