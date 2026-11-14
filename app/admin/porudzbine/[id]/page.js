import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { rsd, PAYMENT, DELIVERY } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/AdminActions";

export default async function Page({ params }) {
  const { id } = await params;
  const o = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: { include: { product: { select: { slug: true, stock: true } } } }, user: true } });
  if (!o) notFound();
  return (
    <div className="max-w-5xl">
      <Link href="/admin/porudzbine" className="text-sm text-gray-500 hover:text-ford">← Sve porudžbine</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ford-dark">Porudžbina {o.number}</h1>
        <div className="flex items-center gap-2 text-sm">Status: <OrderStatusSelect id={o.id} status={o.status} /></div>
      </div>
      <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString("sr-RS")}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="card p-4 text-sm">
          <h2 className="mb-2 font-bold">Kupac</h2>
          <p>{o.fullName}<br /><a href={`mailto:${o.email}`} className="text-ford">{o.email}</a><br /><a href={`tel:${o.phone}`} className="text-ford">{o.phone}</a></p>
          <p className="mt-2 text-xs text-gray-500">{o.user ? `Registrovan korisnik (#${o.user.id})` : "Kupovina kao gost"}</p>
        </div>
        <div className="card p-4 text-sm">
          <h2 className="mb-2 font-bold">Adresa</h2>
          <p>{o.street}<br />{o.postalCode} {o.city}</p>
        </div>
        <div className="card p-4 text-sm">
          <h2 className="mb-2 font-bold">Isporuka i plaćanje</h2>
          <p>{DELIVERY[o.delivery]}<br />{PAYMENT[o.payment]}</p>
        </div>
      </div>

      {o.note && <div className="card mt-6 bg-amber-50 p-4 text-sm"><b>Napomena kupca:</b> {o.note}</div>}

      <div className="card mt-6 overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Artikal</th><th>Šifra</th><th className="text-right">Cena</th><th className="text-right">Kol.</th><th className="text-right">Iznos</th></tr></thead>
          <tbody>
            {o.items.map((i) => (
              <tr key={i.id}>
                <td>{i.product ? <Link href={`/proizvod/${i.product.slug}`} target="_blank" className="text-ford hover:underline">{i.name}</Link> : i.name}</td>
                <td>{i.sku}</td><td className="text-right">{rsd(i.price)}</td><td className="text-right">{i.quantity}</td><td className="text-right">{rsd(i.price * i.quantity)}</td>
              </tr>
            ))}
            <tr><td colSpan={4} className="text-right">Međuzbir</td><td className="text-right">{rsd(o.subtotal)}</td></tr>
            <tr><td colSpan={4} className="text-right">Dostava</td><td className="text-right">{rsd(o.shipping)}</td></tr>
            <tr><td colSpan={4} className="text-right font-bold">Ukupno</td><td className="text-right text-lg font-bold">{rsd(o.total)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
