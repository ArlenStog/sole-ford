import Link from "next/link";
import { rsd } from "@/lib/format";
import PartImage from "./PartImage";
import AddToCart from "./AddToCart";

export default function ProductCard({ p }) {
  const discount = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="card group flex flex-col overflow-hidden transition hover:shadow-md">
      <Link href={`/proizvod/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <PartImage product={p} className="transition group-hover:scale-105" />
        {discount > 0 && <span className="badge absolute left-2 top-2 bg-red-600 text-white">-{discount}%</span>}
        {p.stock === 0 && <span className="badge absolute right-2 top-2 bg-gray-800 text-white">Rasprodato</span>}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {p.carModel && <span className="text-xs font-semibold uppercase text-gray-500">Ford {p.carModel.name}</span>}
        <Link href={`/proizvod/${p.slug}`} className="mt-1 line-clamp-2 font-semibold text-gray-900 hover:text-ford">{p.name}</Link>
        <span className="mt-1 text-xs text-gray-500">Šifra: {p.sku}</span>
        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-bold text-ford">{rsd(p.price)}</span>
            {discount > 0 && <span className="text-sm text-gray-400 line-through">{rsd(p.oldPrice)}</span>}
          </div>
          <AddToCart product={{ id: p.id, name: p.name, slug: p.slug, sku: p.sku, price: p.price, stock: p.stock, image: p.image, carModel: p.carModel ? { name: p.carModel.name } : null }} compact />
        </div>
      </div>
    </div>
  );
}
