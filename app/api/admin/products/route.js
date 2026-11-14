import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/format";

export async function POST(req) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const p = productSchema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  if (await prisma.product.findUnique({ where: { sku: p.data.sku } })) return err("Šifra artikla već postoji");
  let slug = slugify(p.data.name);
  if (await prisma.product.findUnique({ where: { slug } })) slug = `${slug}-${slugify(p.data.sku)}`;
  const prod = await prisma.product.create({ data: { ...p.data, slug } });
  return ok(prod);
}
