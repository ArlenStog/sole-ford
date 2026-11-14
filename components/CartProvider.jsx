"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const CartCtx = createContext(null);
const KEY = "sf_cart";

export function CartProvider({ loggedIn, children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const syncTimer = useRef(null);

  // Učitavanje: lokalna korpa + (ako je korisnik prijavljen) spajanje sa korpom iz baze
  useEffect(() => {
    (async () => {
      let local = [];
      try { local = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch {}
      let merged = local;
      if (loggedIn) {
        try {
          const r = await fetch("/api/cart").then((r) => r.json());
          const server = r.items || [];
          const map = new Map(server.map((i) => [i.id, i]));
          for (const l of local) {
            const s = map.get(l.id);
            map.set(l.id, s ? { ...s, quantity: Math.min(Math.max(s.quantity, l.quantity), s.stock) } : l);
          }
          merged = [...map.values()];
          if (local.length) {
            const res = await fetch("/api/cart", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: merged }) }).then((r) => r.json());
            merged = res.items || merged;
          }
        } catch {}
      } else if (local.length) {
        // osveži cene i zalihe
        try {
          const fresh = await fetch("/api/products?ids=" + local.map((i) => i.id).join(",")).then((r) => r.json());
          merged = fresh.filter((f) => f.stock > 0).map((f) => ({ ...f, quantity: Math.min(local.find((l) => l.id === f.id).quantity, f.stock) }));
        } catch {}
      }
      setItems(merged);
      setReady(true);
    })();
  }, [loggedIn]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
    if (loggedIn) {
      clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => {
        fetch("/api/cart", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) }).catch(() => {});
      }, 400);
    }
  }, [items, ready, loggedIn]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => (i.id === product.id ? { ...i, quantity: Math.min(i.quantity + qty, product.stock) } : i));
      return [...prev, { ...product, quantity: Math.min(qty, product.stock) }];
    });
    setToast(`„${product.name}“ je dodat u korpu`);
    setTimeout(() => setToast(null), 2500);
  }, []);
  const update = useCallback((id, quantity) => setItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i))), []);
  const remove = useCallback((id) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <CartCtx.Provider value={{ items, ready, add, update, remove, clear, count, subtotal }}>
      {children}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-md bg-ford-dark px-5 py-3 text-sm text-white shadow-lg">
          ✓ {toast} — <a href="/korpa" className="underline">Pogledaj korpu</a>
        </div>
      )}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
