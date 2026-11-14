import Link from "next/link";
import { site } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ford-dark text-white/80">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed">
            {site.name} je specijalizovana prodavnica originalnih polovnih i novih delova za Ford vozila. Svaki deo je proveren pre slanja.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-white">Kontakt</h3>
          <ul className="space-y-1.5 text-sm">
            <li>📍 {site.address}</li>
            <li><a className="hover:text-accent" href={`tel:${site.phone.replace(/\s/g, "")}`}>📞 {site.phone}</a></li>
            <li><a className="hover:text-accent" href={`tel:${site.phone2.replace(/\s/g, "")}`}>☎ {site.phone2}</a></li>
            <li><a className="hover:text-accent" href={`mailto:${site.email}`}>✉ {site.email}</a></li>
            <li><a className="hover:text-accent" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">💬 WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-white">Radno vreme</h3>
          <ul className="space-y-1.5 text-sm">
            {site.hours.map(([d, h]) => (
              <li key={d} className="flex justify-between gap-4"><span>{d}</span><span className="text-white">{h}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-white">Informacije</h3>
          <ul className="grid grid-cols-1 gap-1.5 text-sm">
            <li><Link className="hover:text-accent" href="/o-nama">O nama</Link></li>
            <li><Link className="hover:text-accent" href="/kontakt">Kontakt</Link></li>
            <li><Link className="hover:text-accent" href="/uslovi">Uslovi korišćenja</Link></li>
            <li><Link className="hover:text-accent" href="/privatnost">Privatnost i kolačići</Link></li>
            <li><Link className="hover:text-accent" href="/dostava">Dostava</Link></li>
            <li><Link className="hover:text-accent" href="/povracaj">Povraćaj i reklamacije</Link></li>
            <li><Link className="hover:text-accent" href="/preuzimanje">Lično preuzimanje</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-4 text-xs">
          <span>© {new Date().getFullYear()} {site.name}. Sva prava zadržana.</span>
          <span>Plaćanje: pouzećem · uplatom na račun · u radnji</span>
        </div>
      </div>
    </footer>
  );
}
