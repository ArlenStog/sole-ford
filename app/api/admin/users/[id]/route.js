import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";

export async function PUT(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return err("Zabranjen pristup", 403);
  const { id } = await params;
  const { role } = await body(req);
  if (!["CUSTOMER", "ADMIN"].includes(role)) return err("Nepoznata uloga");
  if (Number(id) === admin.id) return err("Ne možete menjati sopstvenu ulogu");
  return ok(await prisma.user.update({ where: { id: Number(id) }, data: { role }, select: { id: true, role: true } }));
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return err("Zabranjen pristup", 403);
  const { id } = await params;
  if (Number(id) === admin.id) return err("Ne možete obrisati sopstveni nalog");
  await prisma.user.delete({ where: { id: Number(id) } });
  return ok({ ok: true });
}
