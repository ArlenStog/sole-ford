import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";
import { addressSchema } from "@/lib/validation";

export async function GET() {
  const u = await getUser();
  if (!u) return err("Niste prijavljeni", 401);
  return ok(await prisma.address.findMany({ where: { userId: u.id }, orderBy: { id: "asc" } }));
}

export async function POST(req) {
  const u = await getUser();
  if (!u) return err("Niste prijavljeni", 401);
  const p = addressSchema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  const count = await prisma.address.count({ where: { userId: u.id } });
  const isDefault = !!p.data.isDefault || count === 0;
  if (isDefault) await prisma.address.updateMany({ where: { userId: u.id }, data: { isDefault: false } });
  return ok(await prisma.address.create({ data: { ...p.data, isDefault, userId: u.id } }));
}
