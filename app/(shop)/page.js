import Link from "next/link";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import SearchBox from "@/components/SearchBox";

export const dynamic = "force-dynamic";

const include = { carModel: true, category: true };

export default async function Home() {
  const [models, featured, offers, counts] = await Promise.all([
    prisma.carModel.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { products: { where: { active: true } } } } } }),
    prisma.product.findMany({ where: { active: true, featured: true }, include, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { active: true, oldPrice: { not: null } }, include, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where: { active: true } }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ford-dark via-ford to-ford-light text-white">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 right-40 h-80 w-80 rounded-full bg-accent/10" />
        <div className="container-x relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="badge bg-accent text-ford-dark">Specijalizovani za Ford</span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">Originalni Ford delovi — provereni, sa garancijom</h1>
            <p className="mt-4 text-lg text-white/85">
              Preko {counts} artikala na stanju za sve popularne Ford modele. Porudžbine do 14h šaljemo istog dana kurirskom službom na teritoriji cele Srbije.
            </p>
            <div className="mt-8 max-w-xl"><SearchBox /></div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/delovi" className="btn-accent">Pogledaj sve delove</Link>
              <Link href="/kontakt" className="btn border border-white/40 text-white hover:bg-white/10">Ne možete da nađete deo? Pitajte nas</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["↩", "30 dana", "povraćaj novca"],
              ["🛡", "90 dana", "garancije na delove*"],
              ["🚚", "Isti dan", "slanje za porudžbine do 14h"],
              ["💳", "Pouzećem", "plaćanje pri preuzimanju"],
            ].map(([i, t, s]) => (
              <div key={t} className="rounded-xl bg-white/10 p-5 backdrop-blur">
                <div className="text-3xl">{i}</div>
                <div className="mt-2 text-xl font-bold">{t}</div>
                <div className="text-sm text-white/80">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRETRAGA PO MODELU */}
      <section className="container-x py-14">
        <div className="mb-8 text-center">
          <h2 className="h-section">Pretraga po modelu vozila</h2>
          <p className="mt-2 text-gray-600">Izaberite vaš Ford model i pogledajte sve dostupne delove</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {models.map((m) => (
            <Link key={m.id} href={`/delovi/${m.slug}`} className="card group p-3 text-center transition sm:p-5 hover:-translate-y-0.5 hover:border-ford hover:shadow-md">
              <svg viewBox="0 0 120 50" className="mx-auto h-12 w-auto text-ford/70 transition group-hover:text-ford" fill="currentColor" aria-hidden="true">
                <path d="M10 36c0-4 2-6 6-7l14-3 14-12c3-2 6-3 10-3h22c4 0 7 1 10 4l10 10 10 2c4 1 6 4 6 8v4H10z" />
                <circle cx="32" cy="40" r="7" fill="#fff" stroke="currentColor" strokeWidth="4" />
                <circle cx="90" cy="40" r="7" fill="#fff" stroke="currentColor" strokeWidth="4" />
              </svg>
              <div className="mt-2 font-bold text-ford-dark">Ford {m.name}</div>
              {m.years && <div className="text-xs text-gray-500">{m.years}</div>}
              <div className="mt-1 text-xs font-semibold text-accent-dark">{m._count.products} delova</div>
            </Link>
          ))}
        </div>
      </section>

      {/* UVOD */}
      <section className="bg-white py-14">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="h-section">Originalni Ford delovi po najboljim cenama</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              {site.name} se bavi isključivo Ford vozilima. Svako vozilo koje rastavljamo prolazi detaljnu proveru, a svaki deo se testira, čisti, fotografiše i
              obeležava pre nego što se nađe u ponudi. Zahvaljujući tome dobijate originalni OEM kvalitet po ceni koja je višestruko niža od novog dela.
            </p>
            <p className="mt-3 leading-relaxed text-gray-600">
              Porudžbine primljene radnim danima do 14h šaljemo istog dana, a isporuka na adresu traje 1–2 radna dana. Delove možete preuzeti i lično u našoj radnji.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["🏭", "Ovlašćeni otpad vozila", "Poslujemo u skladu sa propisima o upravljanju otpadnim vozilima i zaštiti životne sredine."],
              ["📦", "Brza dostava", "Saradnja sa kurirskim službama — paket je kod vas za 1–2 radna dana."],
              ["🔒", "Sigurna kupovina", "Plaćanje pouzećem, uplatom na račun ili u radnji. Bez rizika."],
              ["🧾", "Račun i garancija", "Za svaki deo dobijate fiskalni račun i garanciju od 90 dana."],
            ].map(([i, t, d]) => (
              <div key={t} className="rounded-lg bg-gray-50 p-5">
                <div className="text-3xl">{i}</div>
                <h3 className="mt-2 font-bold text-ford-dark">{t}</h3>
                <p className="mt-1 text-sm text-gray-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IZDVOJENO */}
      {featured.length > 0 && (
        <section className="container-x py-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="h-section">Izdvojeni delovi</h2>
            <Link href="/delovi" className="font-semibold text-ford hover:underline">Svi delovi →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* AKCIJE */}
      {offers.length > 0 && (
        <section className="bg-red-50 py-14">
          <div className="container-x">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="h-section text-red-700">🔥 Akcijska ponuda</h2>
              <Link href="/akcije" className="font-semibold text-red-700 hover:underline">Sve akcije →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {offers.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* O NAMA + GARANCIJE */}
      <section className="container-x grid gap-6 py-14 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-ford-dark">O prodavnici {site.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Mi smo porodična firma sa dugogodišnjim iskustvom u radu sa Ford vozilima. Naš tim čine ljudi koji Ford poznaju do poslednjeg šrafa — zato vam uvek
            možemo pomoći da pronađete tačno odgovarajući deo za vaše vozilo.
          </p>
          <Link href="/o-nama" className="mt-4 inline-block font-semibold text-ford hover:underline">Saznajte više →</Link>
        </div>
        <div className="card border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-bold text-green-800">↩ Garancija povraćaja novca</h2>
          <p className="mt-3 text-sm leading-relaxed text-green-900/80">
            Ukoliko deo ne odgovara ili niste zadovoljni, imate 30 dana da ga vratite. Novac vraćamo u celosti, bez komplikovanih procedura.
          </p>
          <Link href="/povracaj" className="mt-4 inline-block font-semibold text-green-800 hover:underline">Uslovi povraćaja →</Link>
        </div>
        <div className="card border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-ford-dark">🛡 90 dana garancije</h2>
          <p className="mt-3 text-sm leading-relaxed text-ford-dark/80">
            Na sve mehaničke i električne delove dajemo garanciju od 90 dana*. Ako deo ne radi ispravno, menjamo ga ili vraćamo novac.
          </p>
          <p className="mt-2 text-xs text-gray-500">* Važe uslovi garancije.</p>
        </div>
      </section>

      {/* KONTAKT + LOKACIJA */}
      <section className="bg-white py-14">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h-section">Pošaljite nam poruku</h2>
            <p className="mt-2 text-gray-600">Ne možete da pronađete deo? Pišite nam — odgovaramo u roku od 24 sata.</p>
            <div className="mt-6"><ContactForm /></div>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-ford-dark">📍 Naša radnja</h3>
              <p className="mt-2 text-gray-700">{site.address}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <a className="btn-primary btn-sm" href={`tel:${site.phone.replace(/\s/g, "")}`}>📞 {site.phone}</a>
                <a className="btn-outline btn-sm" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-ford-dark">🕒 Radno vreme</h3>
              <ul className="mt-3 divide-y text-sm">
                {site.hours.map(([d, h]) => (
                  <li key={d} className="flex justify-between py-2"><span>{d}</span><span className="font-semibold">{h}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
