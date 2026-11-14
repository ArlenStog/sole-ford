"use client";
import { useState } from "react";

export default function ContactForm({ defaultSubject = "" }) {
  const [state, setState] = useState({ loading: false, error: "", done: false });

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ loading: true, error: "", done: false });
    const data = Object.fromEntries(new FormData(form));
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await r.json();
    if (!r.ok) return setState({ loading: false, error: j.error, done: false });
    form.reset();
    setState({ loading: false, error: "", done: true });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="cf-name">Ime i prezime *</label>
        <input id="cf-name" name="name" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="cf-email">E-mail *</label>
        <input id="cf-email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="cf-phone">Telefon</label>
        <input id="cf-phone" name="phone" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="cf-subject">Tema / deo koji tražite</label>
        <input id="cf-subject" name="subject" defaultValue={defaultSubject} className="input" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="cf-body">Poruka *</label>
        <textarea id="cf-body" name="body" rows={5} required className="input" placeholder="Navedite model, godište i broj šasije (VIN) radi lakše provere kompatibilnosti." />
      </div>
      {state.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
      {state.done && <p className="rounded bg-green-50 p-3 text-sm text-green-700 sm:col-span-2">✓ Hvala! Vaša poruka je poslata. Odgovorićemo u roku od 24 sata.</p>}
      <div className="sm:col-span-2">
        <button disabled={state.loading} className="btn-primary">{state.loading ? "Slanje…" : "Pošalji poruku"}</button>
      </div>
    </form>
  );
}
