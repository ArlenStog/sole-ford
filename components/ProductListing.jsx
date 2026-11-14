import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "./ProductCard";

const PER_PAGE = 12;
const SORTS = {
  novo: { createdAt: "desc" },
  "cena-rastuce": { price: "asc" },
  "cena-opadajuce": { price: "desc" },
  naziv: { name: "asc" },
};

export default async function ProductListing({ searchParams, model = null, offersOnly = false, basePath, title, intro }) {
  const sp = searchParams || {};
  const page = Math.max(1, Number(sp.strana) || 1);
  const sort = SORTS[sp.sort] ? sp.sort : "novo";
  const q = (sp.q || "").trim();

  const where = { active: true };
  if (model) where.carModelId = model.id;
  else if (sp.model) where.carModel = { slug: sp.model };
  if (sp.kategorija) where.category = { slug: sp.kategorija };
  if (offersOnly) where.oldPrice = { not: null };
  if (sp.stanje) where.condition = sp.stanje;
  if (sp.naStanju === "1") where.stock = { gt: 0 };
  const min = Number(sp.min), max = Number(sp.max);
  if (min || max) where.price = { ...(min ? { gte: min } : {}), ...(max ? { lte: max } : {}) };
  if (q) where.OR = [{ name: { contains: q } }, { sku: { contains: q } }, { partNumber: { contains: q } }, { description: { contains: q } }];

  const [products, total, categories, models, conditions] = await Promise.all([
    prisma.product.findMany({ where, include: { carModel: true, category: true }, orderBy: SORTS[sort], skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    model ? [] : prisma.carModel.findMany({ orderBy: { sort: "asc" } }),
    prisma.product.findMany({ where: { active: true }, select: { condition: true }, distinct: ["condition"] }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const qs = (over) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...over })) if (v !== undefined && v !== null && v !== "") p.set(k, v);
    const s = p.toString();
    return `${basePath}${s ? "?" + s : ""}`;
  };

  return (
    <div className="container-x py-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-ford">Početna</Link> / <Link href="/delovi" className="hover:text-ford">Delovi</Link>
        {model && <> / <span className="text-gray-800">Ford {model.name}</span></>}
      </nav>
      <h1 className="text-3xl font-extrabold text-ford-dark">{title}</h1>
      {intro && <p className="mt-2 max-w-3xl text-gray-600">{intro}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside>
          <input type="checkbox" id="toggle-filters" className="peer hidden" />
          <label htmlFor="toggle-filters" className="btn-outline w-full cursor-pointer lg:hidden">⚙ Prikaži / sakrij filtere</label>
          <form method="get" action={basePath} className="card mt-3 hidden space-y-4 p-4 peer-checked:block lg:sticky lg:top-44 lg:mt-0 lg:block">
            <h2 className="font-bold text-ford-dark">Filteri</h2>
            <div>
              <label className="label" htmlFor="f-q">Pretraga</label>
              <input id="f-q" name="q" defaultValue={q} className="input" placeholder="Naziv, šifra…" />
            </div>
            {!model && (
              <div>
                <label className="label" htmlFor="f-model">Model</label>
                <select id="f-model" name="model" defaultValue={sp.model || ""} className="input">
                  <option value="">Svi modeli</option>
                  {models.map((m) => <option key={m.id} value={m.slug}>Ford {m.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="label" htmlFor="f-cat">Kategorija</label>
              <select id="f-cat" name="kategorija" defaultValue={sp.kategorija || ""} className="input">
                <option value="">Sve kategorije</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="f-cond">Stanje dela</label>
              <select id="f-cond" name="stanje" defaultValue={sp.stanje || ""} className="input">
                <option value="">Sve</option>
                {conditions.map((c) => <option key={c.condition} value={c.condition}>{c.condition}</option>)}
              </select>
            </div>
            <div>
              <span className="label">Cena (RSD)</span>
              <div className="flex gap-2">
                <input name="min" type="number" min="0" defaultValue={sp.min || ""} placeholder="od" className="input" aria-label="Cena od" />
                <input name="max" type="number" min="0" defaultValue={sp.max || ""} placeholder="do" className="input" aria-label="Cena do" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="naStanju" value="1" defaultChecked={sp.naStanju === "1"} /> Samo na stanju
            </label>
            <input type="hidden" name="sort" value={sort} />
            <button className="btn-primary w-full">Primeni filtere</button>
            <Link href={basePath} className="block text-center text-sm text-gray-500 hover:text-ford">Poništi filtere</Link>
          </form>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">Pronađeno artikala: <b>{total}</b>{q && <> za „{q}“</>}</p>
            <div className="flex flex-wrap gap-1 text-sm">
              {[["novo", "Najnovije"], ["cena-rastuce", "Cena ↑"], ["cena-opadajuce", "Cena ↓"], ["naziv", "Naziv A–Ž"]].map(([k, l]) => (
                <Link key={k} href={qs({ sort: k, strana: 1 })} className={`rounded px-3 py-1.5 ${sort === k ? "bg-ford text-white" : "bg-white hover:bg-gray-100"}`}>{l}</Link>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-5xl">🔍</div>
              <p className="mt-3 font-semibold">Nema artikala za izabrane filtere.</p>
              <p className="mt-1 text-sm text-gray-600">Deo koji tražite možda još nije postavljen — <Link href="/kontakt" className="text-ford underline">pošaljite nam upit</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}

          {pages > 1 && (
            <div className="mt-8 flex flex-wrap justify-center gap-1">
              {page > 1 && <Link href={qs({ strana: page - 1 })} className="rounded bg-white px-3 py-2 hover:bg-gray-100">← Prethodna</Link>}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={qs({ strana: n })} className={`rounded px-3 py-2 ${n === page ? "bg-ford text-white" : "bg-white hover:bg-gray-100"}`}>{n}</Link>
              ))}
              {page < pages && <Link href={qs({ strana: page + 1 })} className="rounded bg-white px-3 py-2 hover:bg-gray-100">Sledeća →</Link>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
