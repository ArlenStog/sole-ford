import Link from "next/link";
import LogoutButton from "./LogoutButton";

const LINKS = [
  ["/nalog", "Kontrolna tabla"],
  ["/nalog/porudzbine", "Porudžbine"],
  ["/nalog/adrese", "Adrese"],
  ["/nalog/podaci", "Podaci o nalogu"],
];

export default function AccountShell({ active, user, children }) {
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold text-ford-dark">Moj nalog</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="card h-fit p-2">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className={`block rounded px-3 py-2 text-sm font-medium ${active === href ? "bg-ford text-white" : "hover:bg-gray-100"}`}>{label}</Link>
          ))}
          {user.role === "ADMIN" && <Link href="/admin" className="block rounded px-3 py-2 text-sm font-medium hover:bg-gray-100">⚙ Admin panel</Link>}
          <LogoutButton className="block w-full rounded px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50" />
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
