"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { rsd, shippingFor, PAYMENT, DELIVERY } from "@/lib/format";
import { site } from "@/lib/site";

export default function CheckoutForm({ user, addresses }) {
  const { items, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const def = addresses[0];
  const [f, setF] = useState({
    email: user?.email || "",
    fullName: def?.fullName || (user ? `${user.firstName} ${user.lastName}` : ""),
    phone: def?.phone || user?.phone || "",
    street: def?.street || "",
    city: def?.city || "",
    postalCode: def?.postalCode || "",
    note: "",
    delivery: "KURIR",
    payment: "POUZECE",
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const shipping = shippingFor(subtotal, f.delivery, site.shipping);
  const payments = f.delivery === "LICNO" ? ["LICNO", "UPLATNICA"] : ["POUZECE", "UPLATNICA"];

  function pickAddress(id) {
    const a = addresses.find((x) => x.id === Number(id));
    if (a) setF((s) => ({ ...s, fullName: a.fullName, phone: a.phone, street: a.street, city: a.city, postalCode: a.postalCode }));
  }

  function setDelivery(d) {
    setF((s) => ({ ...s, delivery: d, payment: d === "LICNO" ? "LICNO" : "POUZECE" }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, items: items.map((i) => ({ id: i.id, quantity: i.quantity })) }),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) return setError(j.error);
    clear();
    router.push(`/porudzbina/${j.number}`);
  }

  if (!ready) return <p className="py-10 text-gray-500">Učitavanje…</p>;
  if (items.length === 0)
    return (
      <div className="py-10">
        <p>Korpa je prazna.</p>
        <Link href="/delovi" className="btn-primary mt-4">Nazad na delove</Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {!user && (
          <div className="rounded-lg bg-blue-50 p-4 text-sm">
            Imate nalog? <Link href="/nalog?next=/placanje" className="font-semibold text-ford underline">Prijavite se</Link> za brže plaćanje i praćenje porudžbina. Možete nastaviti i kao gost.
          </div>
        )}
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-bold">1. Način isporuke</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(DELIVERY).map(([k, l]) => (
              <label key={k} className={`cursor-pointer rounded-lg border-2 p-4 ${f.delivery === k ? "border-ford bg-blue-50" : "border-gray-200"}`}>
                <input type="radio" name="delivery" className="mr-2" checked={f.delivery === k} onChange={() => setDelivery(k)} />
                <b>{l}</b>
                <div className="mt-1 text-sm text-gray-600">
                  {k === "KURIR" ? (subtotal >= site.shipping.freeOver ? "Besplatno" : `${rsd(site.shipping.courier)} · 1–2 radna dana`) : `Besplatno · ${site.address}`}
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 text-lg font-bold">2. Podaci za {f.delivery === "KURIR" ? "dostavu" : "račun"}</h2>
          {addresses.length > 0 && (
            <div className="mb-4">
              <label className="label" htmlFor="co-addr">Sačuvane adrese</label>
              <select id="co-addr" className="input" defaultValue={def?.id} onChange={(e) => pickAddress(e.target.value)}>
                {addresses.map((a) => <option key={a.id} value={a.id}>{a.label} — {a.street}, {a.city}</option>)}
              </select>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="co-name">Ime i prezime *</label><input id="co-name" className="input" required value={f.fullName} onChange={set("fullName")} /></div>
            <div><label className="label" htmlFor="co-email">E-mail *</label><input id="co-email" type="email" className="input" required value={f.email} onChange={set("email")} /></div>
            <div><label className="label" htmlFor="co-phone">Telefon *</label><input id="co-phone" className="input" required value={f.phone} onChange={set("phone")} /></div>
            <div><label className="label" htmlFor="co-street">Ulica i broj *</label><input id="co-street" className="input" required value={f.street} onChange={set("street")} /></div>
            <div><label className="label" htmlFor="co-city">Grad *</label><input id="co-city" className="input" required value={f.city} onChange={set("city")} /></div>
            <div><label className="label" htmlFor="co-zip">Poštanski broj *</label><input id="co-zip" className="input" required value={f.postalCode} onChange={set("postalCode")} /></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="co-note">Napomena (VIN, godište, posebni zahtevi)</label><textarea id="co-note" rows={3} className="input" value={f.note} onChange={set("note")} /></div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 text-lg font-bold">3. Način plaćanja</h2>
          <div className="space-y-2">
            {payments.map((k) => (
              <label key={k} className={`block cursor-pointer rounded-lg border-2 p-4 ${f.payment === k ? "border-ford bg-blue-50" : "border-gray-200"}`}>
                <input type="radio" name="payment" className="mr-2" checked={f.payment === k} onChange={() => setF((s) => ({ ...s, payment: k }))} />
                <b>{PAYMENT[k]}</b>
                <div className="mt-1 text-sm text-gray-600">
                  {k === "POUZECE" && "Plaćate kuriru gotovinom prilikom preuzimanja paketa."}
                  {k === "UPLATNICA" && "Nakon porudžbine dobijate podatke za uplatu. Paket šaljemo po prijemu uplate."}
                  {k === "LICNO" && "Plaćate gotovinom ili karticom u našoj radnji pri preuzimanju."}
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-44">
        <h2 className="text-lg font-bold">Vaša porudžbina</h2>
        <ul className="divide-y text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-2 py-2">
              <span>{i.name} <span className="text-gray-500">× {i.quantity}</span></span>
              <span className="whitespace-nowrap font-semibold">{rsd(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t pt-3"><span>Međuzbir</span><span>{rsd(subtotal)}</span></div>
        <div className="flex justify-between"><span>Dostava</span><span>{shipping === 0 ? "Besplatno" : rsd(shipping)}</span></div>
        <div className="flex justify-between border-t pt-3 text-xl font-bold text-ford-dark"><span>Ukupno</span><span>{rsd(subtotal + shipping)}</span></div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={f.acceptTerms} onChange={set("acceptTerms")} className="mt-1" required />
          <span>Pročitao/la sam i prihvatam <Link href="/uslovi" target="_blank" className="text-ford underline">uslove kupovine</Link> i <Link href="/privatnost" target="_blank" className="text-ford underline">politiku privatnosti</Link>.</span>
        </label>
        {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="btn-accent w-full py-3 text-lg">{loading ? "Obrada…" : "Potvrdi porudžbinu"}</button>
      </aside>
    </form>
  );
}
