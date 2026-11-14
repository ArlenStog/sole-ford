import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
const COOKIE = "sf_session";

export async function hashPassword(p) { return bcrypt.hash(p, 10); }
export async function verifyPassword(p, h) { return bcrypt.compare(p, h); }

export async function createSession(user) {
  const token = await new SignJWT({ id: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);
  const c = await cookies();
  c.set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "production" });
}

export async function destroySession() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function getUser() {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const u = await getUser();
  if (!u || u.role !== "ADMIN") return null;
  return u;
}
