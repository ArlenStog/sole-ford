import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AccountShell from "@/components/AccountShell";
import { rsd, STATUS, PAYMENT, DELIVERY } from "@/lib/format";

export const metadata = { title: "Moje porudžbine" };

const COLORS = { NOVA: "bg-blue-100 text-blue-700", U_OBRADI: "bg-amber-100 text-amber-700", POSLATA: "bg-purple-100 text-purple-700", ISPORUCENA: "bg-green-100 text-green-700", OTKAZANA: "bg-gray-200 text-gray-600" };

export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/nalog?next=/nalog/porudzbine");
  const orders = await prisma.order.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } });
  return (
    <AccountShell active="/nalog/porudzbine" user={user}>
      {orders.length === 0 ? (
        <div className="card p-6 text-sm text-gray-600">Još nemate porudžbina.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <details key={o.id} className="card p-4">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                <span><b>{o.number}</b> <span className="text-sm text-gray-500">· {new Date(o.createdAt).toLocaleString("sr-RS")}</span></span>
                <span className="flex items-center gap-3"><span className={`badge ${COLORS[o.status]}`}>{STATUS[o.status]}</span><b>{rsd(o.total)}</b></span>
              </summary>
              <ul className="mt-3 divide-y border-t text-sm">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between py-2"><span>{i.name} <span className="text-gray-500">({i.sku}) × {i.quantity}</span></span><span>{rsd(i.price * i.quantity)}</span></li>
                ))}
                <li className="flex justify-between py-2"><span>Dostava</span><span>{rsd(o.shipping)}</span></li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">{DELIVERY[o.delivery]} · {PAYMENT[o.payment]} · {o.street}, {o.postalCode} {o.city}</p>
            </details>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
