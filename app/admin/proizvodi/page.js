import Link from "next/link";
import { prisma } from "@/lib/db";
import { rsd } from "@/lib/format";
import { DeleteButton } from "@/components/admin/AdminActions";

export default async function Page({ searchParams }) {
  const { q = "", strana } = await searchParams;
  const page = Math.max(1, Number(strana) || 1);
  const where = q ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }, { partNumber: { contains: q } }] } : {};
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, include: { carModel: true, category: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * 25, take: 25 }),
    prisma.product.count({ where }),
  ]);
  const pages = Math.ceil(total / 25);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ford-dark">Proizvodi ({total})</h1>
        <Link href="/admin/proizvodi/novi" className="btn-primary">+ Novi proizvod</Link>
      </div>
      <form className="mt-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Pretraga po nazivu, šifri, OEM broju…" className="input max-w-md" />
        <button className="btn-outline">Traži</button>
      </form>
      <div className="card mt-4 overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Naziv</th><th>Šifra</th><th>Model</th><th>Kategorija</th><th className="text-right">Cena</th><th className="text-right">Stanje</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td className="max-w-xs"><Link href={`/admin/proizvodi/${p.id}`} className="font-medium text-ford hover:underline">{p.name}</Link>{p.featured && " ⭐"}</td>
                <td>{p.sku}</td>
                <td>{p.carModel?.name || "—"}</td>
                <td>{p.category?.name || "—"}</td>
                <td className="whitespace-nowrap text-right">{rsd(p.price)}{p.oldPrice && <div className="text-xs text-red-600">akcija</div>}</td>
                <td className={`text-right font-semibold ${p.stock === 0 ? "text-red-600" : ""}`}>{p.stock}</td>
                <td>{p.active ? <span className="badge bg-green-100 text-green-700">Aktivan</span> : <span className="badge bg-gray-200 text-gray-600">Skriven</span>}</td>
                <td className="whitespace-nowrap">
                  <Link href={`/proizvod/${p.slug}`} target="_blank" className="mr-3 text-sm text-gray-500 hover:underline">Vidi</Link>
                  <DeleteButton url={`/api/admin/products/${p.id}`} confirmText={`Obrisati „${p.name}“?`} />
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={8} className="text-gray-500">Nema proizvoda.</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-4 flex gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={`/admin/proizvodi?q=${encodeURIComponent(q)}&strana=${n}`} className={`rounded px-3 py-1 ${n === page ? "bg-ford text-white" : "bg-white"}`}>{n}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
