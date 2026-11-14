import Link from "next/link";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AuthForms from "@/components/AuthForms";
import AccountShell from "@/components/AccountShell";
import { rsd, STATUS } from "@/lib/format";

export const metadata = { title: "Moj nalog" };

export default async function Page({ searchParams }) {
  const user = await getUser();
  const { next } = await searchParams;
  if (!user)
    return (
      <div className="container-x py-8">
        <h1 className="mb-6 text-3xl font-extrabold text-ford-dark">Moj nalog</h1>
        <AuthForms next={next && next.startsWith("/") && !next.startsWith("//") ? next : undefined} />
      </div>
    );

  const [orders, count] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.order.count({ where: { userId: user.id } }),
  ]);

  return (
    <AccountShell active="/nalog" user={user}>
      <div className="card p-6">
        <p>Zdravo, <b>{user.firstName}</b>!</p>
        <p className="mt-2 text-sm text-gray-600">
          Na kontrolnoj tabli možete pregledati <Link href="/nalog/porudzbine" className="text-ford underline">porudžbine</Link>, upravljati{" "}
          <Link href="/nalog/adrese" className="text-ford underline">adresama za dostavu</Link> i izmeniti <Link href="/nalog/podaci" className="text-ford underline">podatke o nalogu i lozinku</Link>.
        </p>
      </div>
      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Poslednje porudžbine</h2>
          <span className="text-sm text-gray-500">Ukupno: {count}</span>
        </div>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">Još nemate porudžbina. <Link href="/delovi" className="text-ford underline">Pogledajte ponudu</Link>.</p>
        ) : (
          <ul className="mt-3 divide-y text-sm">
            {orders.map((o) => (
              <li key={o.id} className="flex justify-between py-2">
                <span><b>{o.number}</b> · {new Date(o.createdAt).toLocaleDateString("sr-RS")}</span>
                <span>{STATUS[o.status]} · <b>{rsd(o.total)}</b></span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AccountShell>
  );
}
