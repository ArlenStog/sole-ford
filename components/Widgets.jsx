"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Zdravo, imam pitanje u vezi delova.")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-105"
      aria-label="Pišite nam na WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor"><path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.9 2 7L3 29l6.5-2.1c2 1.1 4.2 1.7 6.5 1.7 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23.2c-2.1 0-4.1-.6-5.8-1.7l-.4-.3-3.9 1.2 1.3-3.8-.3-.4c-1.2-1.8-1.9-3.9-1.9-6.1C5 9.9 9.9 5 16 5s11 4.9 11 10.9-4.9 10.3-11 10.3zm6-7.7c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.6-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>
    </a>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(!localStorage.getItem("sf_cookies")); } catch {}
  }, []);
  if (!show) return null;
  const set = (v) => { try { localStorage.setItem("sf_cookies", v); } catch {} setShow(false); };
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 shadow-2xl">
      <div className="container-x flex flex-col items-center gap-3 text-sm md:flex-row">
        <p className="flex-1">
          Koristimo kolačiće neophodne za rad sajta (prijava, korpa). Više informacija u <Link href="/privatnost" className="text-ford underline">politici privatnosti</Link>.
        </p>
        <div className="flex gap-2">
          <button onClick={() => set("neophodni")} className="btn-outline btn-sm">Samo neophodni</button>
          <button onClick={() => set("svi")} className="btn-primary btn-sm">Prihvatam</button>
        </div>
      </div>
    </div>
  );
}
