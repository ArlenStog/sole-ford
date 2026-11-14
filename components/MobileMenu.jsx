"use client";
import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ models, user }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="-ml-2 shrink-0 rounded p-2 text-2xl hover:bg-white/10 md:hidden" aria-label="Meni">☰</button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white text-gray-800 shadow-xl">
            <div className="flex items-center justify-between bg-ford p-4 text-white">
              <span className="font-bold">Meni</span>
              <button onClick={close} className="text-2xl" aria-label="Zatvori">×</button>
            </div>
            <nav className="flex flex-col p-2 font-medium">
              <Link onClick={close} href="/" className="rounded px-3 py-2 hover:bg-gray-100">Početna</Link>
              <Link onClick={close} href="/delovi" className="rounded px-3 py-2 hover:bg-gray-100">Svi Ford delovi</Link>
              <Link onClick={close} href="/akcije" className="rounded px-3 py-2 text-red-600 hover:bg-gray-100">🔥 Akcije</Link>
              <div className="mt-2 px-3 text-xs font-bold uppercase text-gray-400">Delovi po modelu</div>
              {models.map((m) => (
                <Link key={m.slug} onClick={close} href={`/delovi/${m.slug}`} className="rounded px-3 py-1.5 text-sm hover:bg-gray-100">Ford {m.name}</Link>
              ))}
              <div className="my-2 border-t" />
              <Link onClick={close} href="/nalog" className="rounded px-3 py-2 hover:bg-gray-100">{user ? "Moj nalog" : "Prijava / Registracija"}</Link>
              {user?.role === "ADMIN" && <Link onClick={close} href="/admin" className="rounded px-3 py-2 hover:bg-gray-100">Admin panel</Link>}
              <Link onClick={close} href="/o-nama" className="rounded px-3 py-2 hover:bg-gray-100">O nama</Link>
              <Link onClick={close} href="/dostava" className="rounded px-3 py-2 hover:bg-gray-100">Dostava</Link>
              <Link onClick={close} href="/kontakt" className="rounded px-3 py-2 hover:bg-gray-100">Kontakt</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
