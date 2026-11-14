import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";

const pub = { id: true, name: true, slug: true, sku: true, price: true, stock: true, image: true, carModel: { select: { name: true } } };

async function load(userId) {
  const items = await prisma.cartItem.findMany({ where: { userId }, include: { product: { select: pub } } });
  return items.map((i) => ({ ...i.product, quantity: i.quantity }));
}

export async function GET() {
  const u = await getUser();
  if (!u) return ok({ items: null });
  return ok({ items: await load(u.id) });
}

// Zamenjuje celu korpu prijavljenog korisnika
export async function PUT(req) {
  const u = await getUser();
  if (!u) return err("Niste prijavljeni", 401);
  const { items = [] } = await body(req);
  await prisma.cartItem.deleteMany({ where: { userId: u.id } });
  for (const it of items) {
    const q = Math.max(1, Math.floor(Number(it.quantity) || 1));
    const p = await prisma.product.findUnique({ where: { id: Number(it.id) } });
    if (p && p.active && p.stock > 0) {
      await prisma.cartItem.create({ data: { userId: u.id, productId: p.id, quantity: Math.min(q, p.stock) } });
    }
  }
  return ok({ items: await load(u.id) });
}
