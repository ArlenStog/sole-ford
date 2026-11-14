import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Kontakt" };

export default function Page() {
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold text-ford-dark">Kontakt</h1>
      <p className="mt-2 text-gray-600">Imate pitanje ili tražite deo koji nije u ponudi? Pozovite nas, pišite na WhatsApp ili popunite formu — odgovaramo u roku od 24h.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="card p-6"><ContactForm /></div>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-ford-dark">{site.name}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>📍 {site.address}</li>
              <li><a className="hover:text-ford" href={`tel:${site.phone.replace(/\s/g, "")}`}>📞 {site.phone}</a></li>
              <li><a className="hover:text-ford" href={`tel:${site.phone2.replace(/\s/g, "")}`}>☎ {site.phone2}</a></li>
              <li><a className="hover:text-ford" href={`mailto:${site.email}`}>✉ {site.email}</a></li>
              <li><a className="hover:text-ford" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">💬 WhatsApp poruka</a></li>
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="font-bold text-ford-dark">Radno vreme</h2>
            <ul className="mt-3 divide-y text-sm">
              {site.hours.map(([d, h]) => <li key={d} className="flex justify-between py-1.5"><span>{d}</span><b>{h}</b></li>)}
            </ul>
          </div>
          <div className="card overflow-hidden">
            <iframe
              title="Mapa"
              className="h-64 w-full"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
