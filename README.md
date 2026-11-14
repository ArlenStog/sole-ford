# Sole Ford — webshop za Ford delove

Next.js 15 (App Router) + Node.js API rute + Prisma ORM + SQLite baza.

## Pokretanje

```bash
npm install
npm run setup      # kreira bazu (prisma/dev.db) i ubacuje početne podatke
npm run dev        # razvojni server na http://localhost:3000
```

Produkcija: `npm run build` pa `npm start`.

## Admin nalog (početni)

- E-mail: `admin@soleford.rs`
- Lozinka: `SoleFord2026!`

Promenite lozinku odmah nakon prve prijave (Moj nalog → Podaci o nalogu), ili pre seed-a postavite
`ADMIN_EMAIL` i `ADMIN_PASSWORD` u okruženju. **Napomena:** `npm run db:seed` briše sve artikle i porudžbine i ponovo ubacuje primer podatke.

## Podešavanja

- `lib/site.js` — naziv, telefoni, WhatsApp broj, e-mail, adresa, radno vreme, cena dostave i prag za besplatnu dostavu.
- `lib/pages.js` — tekstovi stranica O nama, Dostava, Povraćaj, Uslovi, Privatnost, Preuzimanje.
- `app/(shop)/porudzbina/[number]/page.js` — broj žiro-računa za uplatu.
- `.env` — `DATABASE_URL` i `JWT_SECRET` (obavezno promenite tajni ključ u produkciji).

Za PostgreSQL/MySQL promenite `provider` u `prisma/schema.prisma` i `DATABASE_URL`, pa `npx prisma db push`.

## Funkcionalnosti

**Kupci:** početna (pretraga, izbor po modelu, izdvojeno, akcije, garancije, kontakt forma, radno vreme) · katalog sa filterima
(model, kategorija, stanje, cena, na stanju), sortiranjem i paginacijom · stranice po modelu · akcije · detalj proizvoda sa sličnim
delovima · pretraga uživo · korpa (čuva se i za goste, a za prijavljene u bazi) · plaćanje (kurir/lično preuzimanje; pouzećem,
uplatnica, u radnji) · besplatna dostava iznad praga · registracija/prijava · Moj nalog (porudžbine, adrese, podaci, promena lozinke)
· WhatsApp dugme · obaveštenje o kolačićima · informativne stranice.

**Admin (`/admin`):** kontrolna tabla (promet, porudžbine, niske zalihe) · proizvodi (dodavanje, izmena, brisanje, upload slike,
akcijska cena, izdvajanje, skrivanje) · porudžbine (pretraga, filtriranje, promena statusa, automatsko vraćanje zaliha pri
otkazivanju) · korisnici (uloge, brisanje) · poruke sa kontakt forme · Ford modeli i kategorije.

Slike proizvoda se čuvaju u folderu `uploads/`.

## Besplatni demo hosting (Render)

Repo sadrži `render.yaml`. Na [render.com](https://render.com): **New → Blueprint** → izaberite ovaj GitHub repo → **Apply**.
`JWT_SECRET` se generiše automatski. Prvo učitavanje posle mirovanja traje ~30–60 s (besplatni plan uspava servis).

Disk na besplatnom planu je privremen: pri svakom pokretanju baza se ponovo kreira i puni demo podacima
(`npm run start:demo`), a upload-ovane slike se brišu. Za demo je to poželjno, jer se sve izmene posetilaca same resetuju.
