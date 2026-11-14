import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";
import { site } from "@/lib/site";
import { shippingFor } from "@/lib/format";

const schema = z.object({
  email: z.string().trim().email("Neispravna e-mail adresa"),
  fullName: z.string().trim().min(3, "Unesite ime i prezime"),
  phone: z.string().trim().min(6, "Unesite telefon"),
  street: z.string().trim().min(3, "Unesite ulicu i broj"),
  city: z.string().trim().min(2, "Unesite grad"),
  postalCode: z.string().trim().min(5, "Unesite poštanski broj"),
  note: z.string().trim().optional(),
  delivery: z.enum(["KURIR", "LICNO"]),
  payment: z.enum(["POUZECE", "UPLATNICA", "LICNO"]),
  acceptTerms: z.boolean(),
  items: z.array(z.object({ id: z.number(), quantity: z.number().int().min(1) })).min(1, "Korpa je prazna"),
});

export async function GET() {
  const u = await getUser();
  if (!u) return err("Niste prijavljeni", 401);
  return ok(await prisma.order.findMany({ where: { userId: u.id }, include: { items: true }, orderBy: { createdAt: "desc" } }));
}

export async function POST(req) {
  const p = schema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  const d = p.data;
  if (!d.acceptTerms) return err("Morate prihvatiti uslove kupovine");
  if (d.delivery === "KURIR" && d.payment === "LICNO") return err("Plaćanje u radnji je moguće samo uz lično preuzimanje");
  const user = await getUser();

  try {
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const lines = [];
      for (const it of d.items) {
        const prod = await tx.product.findUnique({ where: { id: it.id } });
        if (!prod || !prod.active) throw new Error("Neki artikal više nije dostupan");
        if (prod.stock < it.quantity) throw new Error(`Nema dovoljno na stanju: ${prod.name} (dostupno ${prod.stock})`);
        await tx.product.update({ where: { id: prod.id }, data: { stock: { decrement: it.quantity } } });
        subtotal += prod.price * it.quantity;
        lines.push({ productId: prod.id, name: prod.name, sku: prod.sku, price: prod.price, quantity: it.quantity });
      }
      const shipping = shippingFor(subtotal, d.delivery, site.shipping);
      const last = await tx.order.findFirst({ orderBy: { id: "desc" }, select: { id: true } });
      const number = `SF-${new Date().getFullYear()}-${String((last?.id || 0) + 1).padStart(5, "0")}`;
      const { items, acceptTerms, ...info } = d;
      const o = await tx.order.create({
        data: { ...info, number, userId: user?.id ?? null, subtotal, shipping, total: subtotal + shipping, items: { create: lines } },
      });
      if (user) await tx.cartItem.deleteMany({ where: { userId: user.id } });
      return o;
    });
    return ok({ number: order.number });
  } catch (e) {
    return err(e.message || "Greška pri kreiranju porudžbine");
  }
}
