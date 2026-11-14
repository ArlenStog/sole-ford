import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";

const schema = z.object({
  firstName: z.string().trim().min(2, "Unesite ime"),
  lastName: z.string().trim().min(2, "Unesite prezime"),
  email: z.string().trim().toLowerCase().email("Neispravna e-mail adresa"),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
});

export async function POST(req) {
  const p = schema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  const exists = await prisma.user.findUnique({ where: { email: p.data.email } });
  if (exists) return err("Korisnik sa ovom e-mail adresom već postoji");
  const user = await prisma.user.create({ data: { ...p.data, password: await hashPassword(p.data.password) } });
  await createSession(user);
  return ok({ id: user.id });
}
