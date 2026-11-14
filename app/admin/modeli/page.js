import { prisma } from "@/lib/db";
import { TaxonomyForm, DeleteButton } from "@/components/admin/AdminActions";

export default async function Page() {
  const [models, categories] = await Promise.all([
    prisma.carModel.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { products: true } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
  ]);
  const Block = ({ title, type, rows }) => (
    <div className="card">
      <h2 className="border-b p-4 font-bold">{title}</h2>
      <TaxonomyForm type={type} />
      <table className="tbl">
        <thead><tr><th>Naziv</th>{type === "model" && <th>Godišta</th>}<th className="text-right">Proizvoda</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="font-medium">{r.name}</td>
              {type === "model" && <td>{r.years || "—"}</td>}
              <td className="text-right">{r._count.products}</td>
              <td className="text-right"><DeleteButton url={`/api/admin/models/${r.id}?type=${type}`} confirmText={`Obrisati „${r.name}“? Proizvodi ostaju, ali bez ove oznake.`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <div>
      <h1 className="text-2xl font-bold text-ford-dark">Modeli i kategorije</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Block title="Ford modeli" type="model" rows={models} />
        <Block title="Kategorije delova" type="category" rows={categories} />
      </div>
    </div>
  );
}
