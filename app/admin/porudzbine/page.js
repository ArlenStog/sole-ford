import Link from "next/link";
import { prisma } from "@/lib/db";
import { rsd, STATUS, PAYMENT } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/AdminActions";

export default async function Page({ searchParams }) {
  const { status = "", q = "" } = await searchParams;
  const where = {};
  if (STATUS[status]) where.status = status;
  if (q) where.OR = [{ number: { contains: q } }, { fullName: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }];
  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { _count: { select: { items: true } } } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-ford-dark">Porudžbine</h1>
      <form className="mt-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Broj, kupac, e-mail, telefon…" className="input max-w-xs" />
        <select name="status" defaultValue={status} className="input w-auto" aria-label="Status">
          <option value="">Svi statusi</option>
          {Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <button className="btn-outline">Filtriraj</button>
      </form>
      <div className="card mt-4 overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Broj</th><th>Datum</th><th>Kupac</th><th>Plaćanje</th><th className="text-right">Ukupno</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/admin/porudzbine/${o.id}`} className="font-semibold text-ford hover:underline">{o.number}</Link><div className="text-xs text-gray-500">{o._count.items} stavki</div></td>
                <td className="whitespace-nowrap">{new Date(o.createdAt).toLocaleString("sr-RS")}</td>
                <td>{o.fullName}<div className="text-xs text-gray-500">{o.city} · {o.phone}</div></td>
                <td className="text-xs">{PAYMENT[o.payment]}</td>
                <td className="whitespace-nowrap text-right font-semibold">{rsd(o.total)}</td>
                <td><OrderStatusSelect id={o.id} status={o.status} /></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="text-gray-500">Nema porudžbina.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
