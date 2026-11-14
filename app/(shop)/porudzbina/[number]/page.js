import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { rsd, PAYMENT, DELIVERY } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata = { title: "Porudžbina primljena" };

export default async function Page({ params }) {
  const { number } = await params;
  const order = await prisma.order.findUnique({ where: { number }, include: { items: true } });
  if (!order) notFound();
  const user = await getUser();
  const canSeeDetails = user && (user.role === "ADMIN" || user.id === order.userId);

  return (
    <div className="container-x max-w-3xl py-12">
      <div className="card p-5 text-center sm:p-8">
        <div className="text-6xl">✅</div>
        <h1 className="mt-4 text-3xl font-extrabold text-ford-dark">Hvala na porudžbini!</h1>
        <p className="mt-2 text-gray-600">Vaša porudžbina <b>{order.number}</b> je uspešno primljena. Kontaktiraćemo vas radi potvrde.</p>
        <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded bg-gray-50 p-3"><div className="text-xs text-gray-500">Ukupno</div><div className="font-bold">{rsd(order.total)}</div></div>
          <div className="rounded bg-gray-50 p-3"><div className="text-xs text-gray-500">Isporuka</div><div className="font-bold">{DELIVERY[order.delivery]}</div></div>
          <div className="rounded bg-gray-50 p-3"><div className="text-xs text-gray-500">Plaćanje</div><div className="font-bold">{PAYMENT[order.payment]}</div></div>
        </div>
        {order.payment === "UPLATNICA" && (
          <div className="mt-6 rounded-lg border border-accent bg-amber-50 p-4 text-left text-sm">
            <b>Podaci za uplatu:</b>
            <ul className="mt-2 space-y-1">
              <li>Primalac: {site.name}, {site.address}</li>
              <li>Račun: 000-0000000000000-00</li>
              <li>Iznos: <b>{rsd(order.total)}</b></li>
              <li>Poziv na broj: <b>{order.number}</b></li>
            </ul>
          </div>
        )}
      </div>

      {canSeeDetails && (
        <div className="card mt-6 p-6">
          <h2 className="font-bold">Stavke</h2>
          <ul className="mt-2 divide-y text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between py-2"><span>{i.name} × {i.quantity}</span><span>{rsd(i.price * i.quantity)}</span></li>
            ))}
            <li className="flex justify-between py-2"><span>Dostava</span><span>{rsd(order.shipping)}</span></li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">Adresa: {order.fullName}, {order.street}, {order.postalCode} {order.city} · {order.phone}</p>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <Link href="/delovi" className="btn-primary">Nastavi kupovinu</Link>
        {user && <Link href="/nalog/porudzbine" className="btn-outline">Moje porudžbine</Link>}
      </div>
    </div>
  );
}
