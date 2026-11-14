import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, err } from "@/lib/api";

export async function DELETE(req, { params }) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const { id } = await params;
  const type = new URL(req.url).searchParams.get("type");
  if (type === "category") await prisma.category.delete({ where: { id: Number(id) } });
  else await prisma.carModel.delete({ where: { id: Number(id) } });
  return ok({ ok: true });
}
