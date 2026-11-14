import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";
import { productSchema } from "@/lib/validation";

export async function PUT(req, { params }) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const { id } = await params;
  const p = productSchema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  const dup = await prisma.product.findFirst({ where: { sku: p.data.sku, NOT: { id: Number(id) } } });
  if (dup) return err("Šifra artikla već postoji");
  return ok(await prisma.product.update({ where: { id: Number(id) }, data: p.data }));
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return ok({ ok: true });
}
