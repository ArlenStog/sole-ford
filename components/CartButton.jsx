"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { rsd } from "@/lib/format";

export default function CartButton() {
  const { count, subtotal } = useCart();
  return (
    <Link href="/korpa" className="relative flex items-center gap-2 rounded px-2 py-1 hover:bg-white/10 sm:px-3">
      <span className="relative text-2xl">
        🛒
        <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-ford-dark">{count}</span>
      </span>
      <span className="hidden text-sm font-semibold lg:block">{rsd(subtotal)}</span>
    </Link>
  );
}
