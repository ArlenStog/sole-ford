"use client";
import { useState } from "react";

function useSubmit(url, next) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await r.json();
    if (!r.ok) { setLoading(false); return setError(j.error); }
    // pun reload da bi se korpa spojila sa nalogom i header osvežio
    window.location.href = next || (j.role === "ADMIN" ? "/admin" : "/nalog");
  }
  return { error, loading, submit };
}

export default function AuthForms({ next }) {
  const login = useSubmit("/api/auth/login", next);
  const reg = useSubmit("/api/auth/register", next);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={login.submit} className="card space-y-4 p-6">
        <h2 className="text-xl font-bold text-ford-dark">Prijava</h2>
        <div><label className="label" htmlFor="l-email">E-mail</label><input id="l-email" name="email" type="email" required className="input" autoComplete="email" /></div>
        <div><label className="label" htmlFor="l-pass">Lozinka</label><input id="l-pass" name="password" type="password" required className="input" autoComplete="current-password" /></div>
        {login.error && <p className="text-sm text-red-600">{login.error}</p>}
        <button disabled={login.loading} className="btn-primary w-full">{login.loading ? "Prijava…" : "Prijavi se"}</button>
      </form>
      <form onSubmit={reg.submit} className="card space-y-4 p-6">
        <h2 className="text-xl font-bold text-ford-dark">Registracija</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="r-fn">Ime</label><input id="r-fn" name="firstName" required className="input" autoComplete="given-name" /></div>
          <div><label className="label" htmlFor="r-ln">Prezime</label><input id="r-ln" name="lastName" required className="input" autoComplete="family-name" /></div>
        </div>
        <div><label className="label" htmlFor="r-email">E-mail</label><input id="r-email" name="email" type="email" required className="input" autoComplete="email" /></div>
        <div><label className="label" htmlFor="r-phone">Telefon</label><input id="r-phone" name="phone" className="input" autoComplete="tel" /></div>
        <div><label className="label" htmlFor="r-pass">Lozinka (min. 6 karaktera)</label><input id="r-pass" name="password" type="password" minLength={6} required className="input" autoComplete="new-password" /></div>
        {reg.error && <p className="text-sm text-red-600">{reg.error}</p>}
        <button disabled={reg.loading} className="btn-accent w-full">{reg.loading ? "Kreiranje…" : "Napravi nalog"}</button>
        <p className="text-xs text-gray-500">Vaši podaci se koriste samo za obradu porudžbina, u skladu sa politikom privatnosti.</p>
      </form>
    </div>
  );
}
