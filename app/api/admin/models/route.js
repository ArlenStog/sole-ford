import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, err, body } from "@/lib/api";
import { slugify } from "@/lib/format";

// type: "model" (Ford model) ili "category" (kategorija dela)
export async function POST(req) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const { type, name, years } = await body(req);
  if (!name || name.trim().length < 2) return err("Unesite naziv");
  const data = { name: name.trim(), slug: slugify(name) };
  try {
    if (type === "category") return ok(await prisma.category.create({ data }));
    const sort = (await prisma.carModel.count()) + 1;
    return ok(await prisma.carModel.create({ data: { ...data, years: years || null, sort } }));
  } catch {
    return err("Naziv već postoji");
  }
}
