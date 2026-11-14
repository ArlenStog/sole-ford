import { prisma } from "@/lib/db";
import { ok } from "@/lib/api";

const select = { id: true, name: true, slug: true, sku: true, price: true, stock: true, image: true, carModel: { select: { name: true } } };

// Brza pretraga (autocomplete) i osvežavanje artikala u korpi (?ids=1,2,3)
export async function GET(req) {
  const sp = new URL(req.url).searchParams;
  const ids = sp.get("ids");
  if (ids) {
    const list = ids.split(",").map(Number).filter(Boolean);
    return ok(await prisma.product.findMany({ where: { id: { in: list }, active: true }, select }));
  }
  const q = (sp.get("q") || "").trim();
  if (q.length < 2) return ok([]);
  return ok(
    await prisma.product.findMany({
      where: { active: true, OR: [{ name: { contains: q } }, { sku: { contains: q } }, { partNumber: { contains: q } }] },
      take: 8,
      select,
    })
  );
}
