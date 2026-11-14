import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";
import { STATUS } from "@/lib/format";

export async function PUT(req, { params }) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const { id } = await params;
  const { status } = await body(req);
  if (!STATUS[status]) return err("Nepoznat status");
  const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true } });
  if (!order) return err("Porudžbina nije pronađena", 404);

  await prisma.$transaction(async (tx) => {
    // Vraćanje zaliha pri otkazivanju, ponovno skidanje ako se otkazivanje poništi
    if (status === "OTKAZANA" && order.status !== "OTKAZANA") {
      for (const i of order.items) if (i.productId) await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.quantity } } });
    } else if (order.status === "OTKAZANA" && status !== "OTKAZANA") {
      for (const i of order.items) if (i.productId) await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.quantity } } });
    }
    await tx.order.update({ where: { id: order.id }, data: { status } });
  });
  return ok({ ok: true });
}
