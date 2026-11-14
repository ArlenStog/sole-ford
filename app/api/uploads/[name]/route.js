import { readFile } from "fs/promises";
import path from "path";

const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(req, { params }) {
  const { name } = await params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), "uploads", name));
    return new Response(buf, { headers: { "Content-Type": MIME[name.split(".").pop()], "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
