import { NextResponse } from "next/server";
export const ok = (data, status = 200) => NextResponse.json(data, { status });
export const err = (message, status = 400) => NextResponse.json({ error: message }, { status });
export async function body(req) { try { return await req.json(); } catch { return {}; } }
