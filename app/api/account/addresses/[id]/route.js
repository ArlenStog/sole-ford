import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";
import { addressSchema } from "@/lib/validation";

async function own(params) {
  const u = await getUser();
  if (!u) return [null, err("Niste prijavljeni", 401)];
  const { id } = await params;
  const a = await prisma.address.findFirst({ where: { id: Number(id), userId: u.id } });
  if (!a) return [null, err("Adresa nije pronađena", 404)];
  return [{ u, a }, null];
}

export async function PUT(req, { params }) {
  const [r, e] = await own(params);
  if (e) return e;
  const p = addressSchema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  if (p.data.isDefault) await prisma.address.updateMany({ where: { userId: r.u.id }, data: { isDefault: false } });
  return ok(await prisma.address.update({ where: { id: r.a.id }, data: p.data }));
}

export async function DELETE(req, { params }) {
  const [r, e] = await own(params);
  if (e) return e;
  await prisma.address.delete({ where: { id: r.a.id } });
  return ok({ ok: true });
}
