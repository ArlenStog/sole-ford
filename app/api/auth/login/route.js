import { prisma } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";

export async function POST(req) {
  const { email, password } = await body(req);
  if (!email || !password) return err("Unesite e-mail i lozinku");
  const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.password))) return err("Pogrešan e-mail ili lozinka", 401);
  await createSession(user);
  return ok({ id: user.id, role: user.role });
}
