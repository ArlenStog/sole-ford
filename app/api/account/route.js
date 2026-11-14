import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUser, hashPassword, verifyPassword } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";

const schema = z.object({
  firstName: z.string().trim().min(2, "Unesite ime"),
  lastName: z.string().trim().min(2, "Unesite prezime"),
  phone: z.string().trim().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function PUT(req) {
  const u = await getUser();
  if (!u) return err("Niste prijavljeni", 401);
  const p = schema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  const { currentPassword, newPassword, ...data } = p.data;
  if (newPassword) {
    if (newPassword.length < 6) return err("Nova lozinka mora imati najmanje 6 karaktera");
    const full = await prisma.user.findUnique({ where: { id: u.id } });
    if (!(await verifyPassword(currentPassword || "", full.password))) return err("Trenutna lozinka nije ispravna");
    data.password = await hashPassword(newPassword);
  }
  await prisma.user.update({ where: { id: u.id }, data });
  return ok({ ok: true });
}
