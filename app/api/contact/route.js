import { z } from "zod";
import { prisma } from "@/lib/db";
import { ok, err, body } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2, "Unesite ime"),
  email: z.string().trim().email("Neispravna e-mail adresa"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  body: z.string().trim().min(10, "Poruka mora imati najmanje 10 karaktera"),
});

export async function POST(req) {
  const p = schema.safeParse(await body(req));
  if (!p.success) return err(p.error.issues[0].message);
  await prisma.message.create({ data: p.data });
  return ok({ ok: true });
}
