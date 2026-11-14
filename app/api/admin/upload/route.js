import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/lib/auth";
import { ok, err } from "@/lib/api";

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(req) {
  if (!(await requireAdmin())) return err("Zabranjen pristup", 403);
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return err("Fajl nije poslat");
  const ext = TYPES[file.type];
  if (!ext) return err("Dozvoljeni formati: JPG, PNG, WEBP");
  if (file.size > 5 * 1024 * 1024) return err("Maksimalna veličina je 5 MB");
  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${crypto.randomUUID()}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return ok({ url: `/api/uploads/${name}` });
}
