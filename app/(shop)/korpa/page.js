"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import PartImage from "@/components/PartImage";
import { rsd } from "@/lib/format";
import { site } from "@/lib/site";

export default function CartPage() {
  const { items, ready, update, remove, subtotal } = useCart();
  const toFree = site.shipping.freeOver - subtotal;

  if (!ready) return <div className="container-x py-16 text-center text-gray-500">Učitavanje korpe…</div>;

  if (items.length === 0)
    return (
      <div className="container-x py-16 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold text-ford-dark">Vaša korpa je prazna</h1>
        <p className="mt-2 text-gray-600">Pogledajte našu ponudu Ford delova.</p>
        <Link href="/delovi" className="btn-primary mt-6">Nastavi kupovinu</Link>
      </div>
    );

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold text-ford-dark">Korpa</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card divide-y">
          {items.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded"><PartImage product={i} /></div>
              <div className="min-w-0 flex-1">
                <Link href={`/proizvod/${i.slug}`} className="font-semibold hover:text-ford">{i.name}</Link>
                <div className="text-xs text-gray-500">{i.carModel ? `Ford ${i.carModel.name} · ` : ""}Šifra: {i.sku}</div>
                <div className="mt-1 text-sm font-semibold text-ford">{rsd(i.price)}</div>
              </div>
              <div className="flex items-center rounded-md border">
                <button className="px-3 py-1" onClick={() => update(i.id, i.quantity - 1)} aria-label="Manje">−</button>
                <span className="w-8 text-center">{i.quantity}</span>
                <button className="px-3 py-1" onClick={() => update(i.id, i.quantity + 1)} disabled={i.quantity >= i.stock} aria-label="Više">+</button>
              </div>
              <div className="w-28 text-right font-bold">{rsd(i.price * i.quantity)}</div>
              <button onClick={() => remove(i.id)} className="text-sm text-red-600 hover:underline">Ukloni</button>
            </div>
          ))}
        </div>
        <aside className="card h-fit space-y-3 p-5">
          <h2 className="text-lg font-bold">Pregled</h2>
          <div className="flex justify-between"><span>Međuzbir</span><b>{rsd(subtotal)}</b></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Dostava</span><span>{toFree <= 0 ? "Besplatna" : `od ${rsd(site.shipping.courier)}`}</span></div>
          {toFree > 0 && (
            <div className="rounded bg-blue-50 p-3 text-sm text-ford-dark">
              Dodajte još <b>{rsd(toFree)}</b> za besplatnu dostavu.
              <div className="mt-2 h-2 overflow-hidden rounded bg-white"><div className="h-full bg-accent" style={{ width: `${Math.min(100, (subtotal / site.shipping.freeOver) * 100)}%` }} /></div>
            </div>
          )}
          <Link href="/placanje" className="btn-accent w-full py-3 text-lg">Nastavi na plaćanje →</Link>
          <Link href="/delovi" className="block text-center text-sm text-gray-500 hover:text-ford">← Nastavi kupovinu</Link>
        </aside>
      </div>
    </div>
  );
}
