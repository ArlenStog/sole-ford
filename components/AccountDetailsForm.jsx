"use client";
import { useState } from "react";

export default function AccountDetailsForm({ user }) {
  const [msg, setMsg] = useState({ ok: "", err: "" });
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.newPassword && data.newPassword !== data.confirm) return setMsg({ ok: "", err: "Nove lozinke se ne poklapaju" });
    delete data.confirm;
    if (!data.newPassword) { delete data.newPassword; delete data.currentPassword; }
    const r = await fetch("/api/account", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await r.json();
    if (!r.ok) return setMsg({ ok: "", err: j.error });
    form.currentPassword.value = form.newPassword.value = form.confirm.value = "";
    setMsg({ ok: "Podaci su sačuvani.", err: "" });
  }
  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2">
      <div><label className="label" htmlFor="d-fn">Ime</label><input id="d-fn" name="firstName" defaultValue={user.firstName} required className="input" /></div>
      <div><label className="label" htmlFor="d-ln">Prezime</label><input id="d-ln" name="lastName" defaultValue={user.lastName} required className="input" /></div>
      <div><label className="label" htmlFor="d-email">E-mail (ne može se menjati)</label><input id="d-email" value={user.email} disabled className="input bg-gray-100" /></div>
      <div><label className="label" htmlFor="d-phone">Telefon</label><input id="d-phone" name="phone" defaultValue={user.phone || ""} className="input" /></div>
      <h3 className="mt-2 font-bold sm:col-span-2">Promena lozinke</h3>
      <div className="sm:col-span-2"><label className="label" htmlFor="d-cur">Trenutna lozinka</label><input id="d-cur" name="currentPassword" type="password" className="input" autoComplete="current-password" /></div>
      <div><label className="label" htmlFor="d-new">Nova lozinka</label><input id="d-new" name="newPassword" type="password" className="input" autoComplete="new-password" /></div>
      <div><label className="label" htmlFor="d-conf">Ponovite novu lozinku</label><input id="d-conf" name="confirm" type="password" className="input" autoComplete="new-password" /></div>
      {msg.err && <p className="text-sm text-red-600 sm:col-span-2">{msg.err}</p>}
      {msg.ok && <p className="text-sm text-green-700 sm:col-span-2">✓ {msg.ok}</p>}
      <div className="sm:col-span-2"><button className="btn-primary">Sačuvaj izmene</button></div>
    </form>
  );
}
