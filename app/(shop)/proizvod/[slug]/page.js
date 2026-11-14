import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { rsd } from "@/lib/format";
import { site } from "@/lib/site";
import PartImage from "@/components/PartImage";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

async function load(slug) {
  return prisma.product.findFirst({ where: { slug, active: true }, include: { carModel: true, category: true } });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await load(slug);
  return p ? { title: p.name, description: p.description.slice(0, 160) } : { title: "Artikal nije pronađen" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();
  const related = await prisma.product.findMany({
    where: { active: true, id: { not: p.id }, OR: [{ carModelId: p.carModelId }, { categoryId: p.categoryId }] },
    include: { carModel: true, category: true },
    take: 4,
  });
  const discount = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const cartProduct = { id: p.id, name: p.name, slug: p.slug, sku: p.sku, price: p.price, stock: p.stock, image: p.image, carModel: p.carModel ? { name: p.carModel.name } : null };

  return (
    <div className="container-x py-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-ford">Početna</Link> / <Link href="/delovi" className="hover:text-ford">Delovi</Link>
        {p.carModel && <> / <Link href={`/delovi/${p.carModel.slug}`} className="hover:text-ford">Ford {p.carModel.name}</Link></>}
        {" "}/ <span className="text-gray-800">{p.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card relative aspect-[4/3] overflow-hidden">
          <PartImage product={p} />
          {discount > 0 && <span className="badge absolute left-3 top-3 bg-red-600 text-base text-white">-{discount}%</span>}
        </div>

        <div>
          {p.carModel && <Link href={`/delovi/${p.carModel.slug}`} className="text-sm font-semibold uppercase text-accent-dark">Ford {p.carModel.name}</Link>}
          <h1 className="mt-1 text-3xl font-extrabold text-ford-dark">{p.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ford">{rsd(p.price)}</span>
            {discount > 0 && <span className="text-lg text-gray-400 line-through">{rsd(p.oldPrice)}</span>}
          </div>
          <p className="text-xs text-gray-500">Cena sa uključenim PDV-om</p>

          <div className="mt-4">
            {p.stock > 0 ? (
              <span className="badge bg-green-100 text-green-700">✓ Na stanju ({p.stock} kom.)</span>
            ) : (
              <span className="badge bg-gray-200 text-gray-600">Trenutno nema na stanju</span>
            )}
          </div>

          <div className="mt-6"><AddToCart product={cartProduct} /></div>

          <table className="mt-6 w-full text-sm">
            <tbody className="divide-y">
              <tr><td className="py-2 text-gray-500">Šifra artikla</td><td className="py-2 font-medium">{p.sku}</td></tr>
              {p.partNumber && <tr><td className="py-2 text-gray-500">Kataloški broj (OEM)</td><td className="py-2 font-medium">{p.partNumber}</td></tr>}
              <tr><td className="py-2 text-gray-500">Stanje dela</td><td className="py-2 font-medium">{p.condition}</td></tr>
              {p.category && <tr><td className="py-2 text-gray-500">Kategorija</td><td className="py-2 font-medium"><Link className="text-ford hover:underline" href={`/delovi?kategorija=${p.category.slug}`}>{p.category.name}</Link></td></tr>}
              {p.carModel && <tr><td className="py-2 text-gray-500">Odgovara za</td><td className="py-2 font-medium">Ford {p.carModel.name} {p.carModel.years || ""}</td></tr>}
            </tbody>
          </table>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            {[["🚚", "Slanje isti dan", "za porudžbine do 14h"], ["↩", "30 dana", "povraćaj novca"], ["🛡", "90 dana", "garancije"]].map(([i, t, s]) => (
              <div key={t} className="rounded-lg bg-white p-2 text-center text-xs shadow-sm sm:p-3 sm:text-sm">
                <div className="text-2xl">{i}</div><div className="font-bold">{t}</div><div className="text-xs text-gray-500">{s}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-ford/30 bg-blue-50 p-4 text-sm">
            Niste sigurni da li deo odgovara vašem vozilu? Pošaljite nam broj šasije (VIN):{" "}
            <a className="font-semibold text-ford underline" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Zdravo, zanima me artikal ${p.sku} - ${p.name}. Moj VIN je: `)}`} target="_blank" rel="noreferrer">WhatsApp</a>
            {" "}ili <a className="font-semibold text-ford underline" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>.
          </div>
        </div>
      </div>

      <section className="card mt-10 p-6">
        <h2 className="text-xl font-bold text-ford-dark">Opis</h2>
        <div className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">{p.description}</div>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="h-section mb-4">Slični delovi</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
