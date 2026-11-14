import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { rsd } from "@/lib/format";
import { RoleToggle, DeleteButton } from "@/components/admin/AdminActions";

export default async function Page({ searchParams }) {
  const { q = "" } = await searchParams;
  const me = await getUser();
  const where = q ? { OR: [{ email: { contains: q } }, { firstName: { contains: q } }, { lastName: { contains: q } }, { phone: { contains: q } }] } : {};
  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true, orders: { select: { total: true, status: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold text-ford-dark">Korisnici ({users.length})</h1>
      <form className="mt-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Ime, e-mail, telefon…" className="input max-w-md" />
        <button className="btn-outline">Traži</button>
      </form>
      <div className="card mt-4 overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Ime</th><th>E-mail</th><th>Telefon</th><th>Registrovan</th><th className="text-right">Porudžbine</th><th className="text-right">Potrošeno</th><th>Uloga</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => {
              const valid = u.orders.filter((o) => o.status !== "OTKAZANA");
              return (
                <tr key={u.id}>
                  <td className="font-medium">{u.firstName} {u.lastName}</td>
                  <td><a href={`mailto:${u.email}`} className="text-ford">{u.email}</a></td>
                  <td>{u.phone || "—"}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString("sr-RS")}</td>
                  <td className="text-right">{u.orders.length}</td>
                  <td className="whitespace-nowrap text-right">{rsd(valid.reduce((s, o) => s + o.total, 0))}</td>
                  <td>{u.role === "ADMIN" ? <span className="badge bg-ford text-white">Admin</span> : <span className="badge bg-gray-100">Kupac</span>}</td>
                  <td className="whitespace-nowrap">
                    {u.id !== me.id && (<><RoleToggle id={u.id} role={u.role} /> <span className="mx-1 text-gray-300">|</span> <DeleteButton url={`/api/admin/users/${u.id}`} confirmText={`Obrisati korisnika ${u.email}? Porudžbine ostaju sačuvane.`} /></>)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
