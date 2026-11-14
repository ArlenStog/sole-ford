import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { title: "Admin panel" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const user = await getUser();
  if (!user) redirect("/nalog?next=/admin");
  if (user.role !== "ADMIN") redirect("/");
  const [unread, newOrders] = await Promise.all([
    prisma.message.count({ where: { read: false } }),
    prisma.order.count({ where: { status: "NOVA" } }),
  ]);
  const links = [
    ["/admin", "📊 Kontrolna tabla"],
    ["/admin/porudzbine", "📦 Porudžbine", newOrders],
    ["/admin/proizvodi", "🔧 Proizvodi"],
    ["/admin/modeli", "🚗 Modeli i kategorije"],
    ["/admin/korisnici", "👥 Korisnici"],
    ["/admin/poruke", "✉ Poruke", unread],
  ];
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-ford-dark text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="p-4"><Link href="/admin"><Logo /></Link></div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible">
          {links.map(([href, label, badge]) => (
            <Link key={href} href={href} className="flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded px-3 py-2 text-sm hover:bg-white/10">
              <span>{label}</span>
              {badge > 0 && <span className="rounded-full bg-accent px-2 text-xs font-bold text-ford-dark">{badge}</span>}
            </Link>
          ))}
          <div className="my-2 hidden border-t border-white/10 md:block" />
          <Link href="/" className="shrink-0 whitespace-nowrap rounded px-3 py-2 text-sm hover:bg-white/10">← Nazad na sajt</Link>
          <LogoutButton className="shrink-0 rounded px-3 py-2 text-left text-sm text-red-300 hover:bg-white/10" />
        </nav>
      </aside>
      <main className="flex-1 overflow-x-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
