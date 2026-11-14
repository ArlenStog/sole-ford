"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { rsd } from "@/lib/format";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    clearTimeout(t.current);
    if (q.trim().length < 2) { setRes([]); return; }
    t.current = setTimeout(async () => {
      try { setRes(await fetch("/api/products?q=" + encodeURIComponent(q.trim())).then((r) => r.json())); setOpen(true); } catch {}
    }, 250);
  }, [q]);

  useEffect(() => {
    const h = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  function submit(e) {
    e.preventDefault();
    setOpen(false);
    router.push("/delovi?q=" + encodeURIComponent(q.trim()));
  }

  return (
    <div ref={box} className="relative w-full">
      <form onSubmit={submit} className="flex overflow-hidden rounded-md bg-white">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => res.length && setOpen(true)}
          placeholder="Pretražite delove po nazivu, šifri ili kataloškom broju…"
          className="w-full px-4 py-2.5 text-gray-800 outline-none"
          aria-label="Pretraga"
        />
        <button className="bg-accent px-5 font-semibold text-ford-dark hover:bg-accent-dark">Traži</button>
      </form>
      {open && res.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-white text-gray-800 shadow-xl">
          {res.map((p) => (
            <a key={p.id} href={`/proizvod/${p.slug}`} className="flex items-center justify-between gap-3 border-b px-4 py-2 text-sm last:border-0 hover:bg-gray-50">
              <span>
                <span className="font-medium">{p.name}</span>
                <span className="block text-xs text-gray-500">{p.carModel ? `Ford ${p.carModel.name} · ` : ""}Šifra: {p.sku}</span>
              </span>
              <span className="whitespace-nowrap font-bold text-ford">{rsd(p.price)}</span>
            </a>
          ))}
          <button onClick={submit} className="w-full bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-ford hover:bg-gray-100">Prikaži sve rezultate →</button>
        </div>
      )}
    </div>
  );
}
