import Link from "next/link";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { site } from "@/lib/site";
import SearchBox from "./SearchBox";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";

export default async function Header() {
  const [user, models] = await Promise.all([getUser(), prisma.carModel.findMany({ orderBy: { sort: "asc" } })]);
  return (
    <header className="sticky top-0 z-40 shadow">
      <div className="bg-ford-dark text-xs text-white/90">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-2">
          <div className="flex flex-wrap gap-4">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent">📞 {site.phone}</a>
            <a href={`tel:${site.phone2.replace(/\s/g, "")}`} className="hidden hover:text-accent sm:inline">☎ {site.phone2}</a>
            <a href={`mailto:${site.email}`} className="hidden hover:text-accent md:inline">✉ {site.email}</a>
          </div>
          <div className="hidden gap-4 md:flex">
            <span>✔ 30 dana povraćaj novca</span>
            <span>✔ 90 dana garancije</span>
            <span>✔ Besplatna dostava preko {new Intl.NumberFormat("sr-RS").format(site.shipping.freeOver)} RSD</span>
          </div>
        </div>
      </div>
      <div className="bg-ford text-white">
        <div className="container-x flex items-center gap-2 py-3 sm:gap-4">
          <MobileMenu models={models.map((m) => ({ name: m.name, slug: m.slug }))} user={user} />
          <Link href="/" className="shrink-0"><Logo /></Link>
          <div className="hidden flex-1 md:block"><SearchBox /></div>
          <div className="ml-auto flex shrink-0 items-center md:ml-0 sm:gap-1">
            <Link href="/nalog" className="flex flex-col items-center rounded px-2 py-1 text-xs hover:bg-white/10 sm:px-3">
              <span className="text-xl">👤</span>
              <span className="hidden sm:block">{user ? user.firstName : "Moj nalog"}</span>
            </Link>
            {user?.role === "ADMIN" && (
              <Link href="/admin" className="flex flex-col items-center rounded px-2 py-1 text-xs hover:bg-white/10 sm:px-3">
                <span className="text-xl">⚙</span>
                <span className="hidden sm:block">Admin</span>
              </Link>
            )}
            <CartButton />
          </div>
        </div>
        <div className="container-x pb-3 md:hidden"><SearchBox /></div>
      </div>
      <nav className="hidden border-b bg-white md:block">
        <div className="container-x flex items-center gap-1 text-sm font-semibold text-ford-dark">
          <div className="group relative">
            <Link href="/delovi" className="flex items-center gap-1 px-4 py-3 hover:bg-gray-100">Ford polovni delovi ▾</Link>
            <div className="invisible absolute left-0 top-full grid w-[560px] grid-cols-3 gap-1 rounded-b-lg border bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              {models.map((m) => (
                <Link key={m.id} href={`/delovi/${m.slug}`} className="rounded px-3 py-2 font-medium hover:bg-ford hover:text-white">Ford {m.name}</Link>
              ))}
              <Link href="/delovi" className="col-span-3 mt-1 rounded bg-accent px-3 py-2 text-center text-ford-dark hover:bg-accent-dark">Svi Ford delovi →</Link>
            </div>
          </div>
          <Link href="/akcije" className="px-4 py-3 text-red-600 hover:bg-gray-100">🔥 Akcije</Link>
          <Link href="/o-nama" className="px-4 py-3 hover:bg-gray-100">O nama</Link>
          <Link href="/dostava" className="px-4 py-3 hover:bg-gray-100">Dostava</Link>
          <Link href="/kontakt" className="px-4 py-3 hover:bg-gray-100">Kontakt</Link>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="ml-auto px-4 py-3 text-green-600 hover:bg-gray-100">WhatsApp upit</a>
        </div>
      </nav>
    </header>
  );
}
