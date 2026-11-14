"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCart({ product, compact = false }) {
  const { add, items } = useCart();
  const [qty, setQty] = useState(1);
  const inCart = items.find((i) => i.id === product.id)?.quantity || 0;
  const left = product.stock - inCart;

  if (product.stock <= 0) return <button disabled className={`btn mt-2 w-full bg-gray-200 text-gray-500 ${compact ? "btn-sm px-2 text-xs sm:text-sm" : ""}`}>Nema na stanju</button>;

  if (compact)
    return (
      <button onClick={() => add(product, 1)} disabled={left <= 0} className="btn-primary btn-sm mt-2 w-full px-2 text-xs sm:text-sm">
        {left <= 0 ? "Sve je u korpi" : "Dodaj u korpu"}
      </button>
    );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-md border">
        <button className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Manje">−</button>
        <input value={qty} onChange={(e) => setQty(Math.max(1, Math.min(left || 1, Number(e.target.value) || 1)))} className="w-12 text-center outline-none" aria-label="Količina" />
        <button className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.min(Math.max(left, 1), q + 1))} aria-label="Više">+</button>
      </div>
      <button onClick={() => { add(product, qty); setQty(1); }} disabled={left <= 0} className="btn-accent flex-1 py-3 text-lg">
        🛒 {left <= 0 ? "Sve dostupne količine su u korpi" : "Dodaj u korpu"}
      </button>
    </div>
  );
}
