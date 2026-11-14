"use client";

export default function LogoutButton({ className = "" }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    try { localStorage.removeItem("sf_cart"); } catch {}
    window.location.href = "/";
  }
  return <button onClick={logout} className={className}>Odjava</button>;
}
