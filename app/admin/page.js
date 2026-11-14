import Link from "next/link";
import { prisma } from "@/lib/db";
import { rsd, STATUS } from "@/lib/format";

export default async function Dashboard() {
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const [orders30, revenue, products, users, unread, lowStock, recent] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: since }, status: { not: "OTKAZANA" } } }),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.message.count({ where: { read: false } }),
    prisma.product.findMany({ where: { active: true, stock: { lte: 1 } }, orderBy: { stock: "asc" }, take: 8 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const stats = [
    ["Porudžbine (30 dana)", orders30],
    ["Promet (30 dana)", rsd(revenue._sum.total || 0)],
    ["Aktivni proizvodi", products],
    ["Registrovani kupci", users],
    ["Nepročitane poruke", unread],
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-ford-dark">Kontrolna tabla</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(([l, v]) => (
          <div key={l} className="card p-4"><div className="text-xs text-gray-500">{l}</div><div className="mt-1 text-2xl font-bold text-ford-dark">{v}</div></div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card overflow-x-auto">
          <div className="flex items-center justify-between p-4"><h2 className="font-bold">Poslednje porudžbine</h2><Link href="/admin/porudzbine" className="text-sm text-ford hover:underline">Sve →</Link></div>
          <table className="tbl">
            <thead><tr><th>Broj</th><th>Kupac</th><th>Status</th><th className="text-right">Ukupno</th></tr></thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/admin/porudzbine/${o.id}`} className="font-semibold text-ford hover:underline">{o.number}</Link></td>
                  <td>{o.fullName}</td><td>{STATUS[o.status]}</td><td className="text-right">{rsd(o.total)}</td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={4} className="text-gray-500">Nema porudžbina.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card overflow-x-auto">
          <div className="p-4"><h2 className="font-bold">Niske zalihe (≤ 1 kom.)</h2></div>
          <table className="tbl">
            <thead><tr><th>Artikal</th><th>Šifra</th><th className="text-right">Stanje</th></tr></thead>
            <tbody>
              {lowStock.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/admin/proizvodi/${p.id}`} className="text-ford hover:underline">{p.name}</Link></td>
                  <td>{p.sku}</td><td className={`text-right font-bold ${p.stock === 0 ? "text-red-600" : ""}`}>{p.stock}</td>
                </tr>
              ))}
              {lowStock.length === 0 && <tr><td colSpan={3} className="text-gray-500">Sve zalihe su u redu.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
