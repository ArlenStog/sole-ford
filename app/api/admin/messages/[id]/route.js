import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";

export async function PUT(req, { params }) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const { id } = await params;
  const { read } = await body(req);
  return ok(await prisma.message.update({ where: { id: Number(id) }, data: { read: !!read } }));
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const { id } = await params;
  await prisma.message.delete({ where: { id: Number(id) } });
  return ok({ ok: true });
}
