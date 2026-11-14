import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="text-7xl">🔧</div>
      <h1 className="mt-4 text-3xl font-extrabold text-ford-dark">Stranica nije pronađena</h1>
      <p className="mt-2 text-gray-600">Stranica ili artikal koji tražite ne postoji ili je uklonjen.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">Početna</Link>
        <Link href="/delovi" className="btn-outline">Svi delovi</Link>
      </div>
    </div>
  );
}
