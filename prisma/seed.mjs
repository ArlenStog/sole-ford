// Početni podaci: admin nalog, Ford modeli, kategorije i primer artikala.
// Pokretanje: npm run db:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@soleford.rs";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SoleFord2026!";

const slug = (s) =>
  s.replace(/[šđčćžŠĐČĆŽ]/g, (c) => ({ š: "s", đ: "dj", č: "c", ć: "c", ž: "z", Š: "s", Đ: "dj", Č: "c", Ć: "c", Ž: "z" })[c])
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const MODELS = [
  ["Fiesta", "2002–2023"], ["Focus", "1998–2025"], ["Mondeo", "2000–2022"], ["Kuga", "2008–2025"], ["C-Max", "2003–2019"],
  ["S-Max", "2006–2023"], ["Galaxy", "2006–2023"], ["Fusion", "2002–2012"], ["Ka", "1996–2020"], ["EcoSport", "2013–2023"],
  ["Puma", "2019–2025"], ["B-Max", "2012–2017"], ["Transit", "2000–2025"], ["Transit Connect", "2002–2025"], ["Transit Custom", "2012–2025"],
  ["Ranger", "2011–2025"], ["Mustang", "2015–2025"], ["Edge", "2016–2021"],
];

const CATEGORIES = ["Motor", "Menjač", "Karoserija", "Svetla", "Elektrika", "Enterijer", "Kočioni sistem", "Vešanje", "Hlađenje", "Izduvni", "Felne i gume", "Ostalo"];

// [naziv, kategorija, osnovna cena, opis, stanje]
const PARTS = [
  ["Far prednji levi", "Svetla", 14500, "Originalni Ford far, ispravan, bez napuklina i oštećenja nosača. Stakla bez ogrebotina."],
  ["Far prednji desni", "Svetla", 14500, "Originalni Ford far, ispravan, nosači celi. Testiran pre skidanja sa vozila."],
  ["Stop svetlo zadnje levo", "Svetla", 5900, "Originalno stop svetlo, sva grla i konektor ispravni."],
  ["Retrovizor levi elektro", "Karoserija", 7800, "Elektro podesiv, grejan, sa žmigavcem. Proveren na vozilu."],
  ["Hauba", "Karoserija", 18900, "Originalna hauba, bez udubljenja i korozije. Moguće sitne ogrebotine na laku."],
  ["Branik prednji", "Karoserija", 16500, "Prednji branik sa nosačima. Bez pukotina, za farbanje u boju vozila."],
  ["Vrata prednja leva kompletna", "Karoserija", 24900, "Kompletna vrata sa staklom, podizačem i bravom."],
  ["Alternator", "Elektrika", 11900, "Alternator testiran na probnom stolu, puni ispravno."],
  ["Anlaser", "Elektrika", 8900, "Elektropokretač testiran, ispravan."],
  ["Kompjuter motora (ECU)", "Elektrika", 19900, "Upravljačka jedinica motora. Kod zamene potrebno programiranje — kontaktirajte nas za detalje."],
  ["Instrument tabla (kilometar sat)", "Elektrika", 9900, "Ispravna instrument tabla, sve lampice i kazaljke rade."],
  ["Turbina", "Motor", 39900, "Originalna turbina, proverena, bez zazora na osovini."],
  ["Glava motora", "Motor", 34900, "Glava motora sa ventilima, proverena na ravnost."],
  ["Bregasta osovina", "Motor", 12900, "Bregasta osovina bez vidljivog habanja."],
  ["Brizgaljka (dizna)", "Motor", 9900, "Dizna testirana na probnom stolu, ispravna."],
  ["Pumpa visokog pritiska", "Motor", 29900, "Pumpa visokog pritiska, testirana."],
  ["Menjač manuelni 5 brzina", "Menjač", 59900, "Manuelni menjač u ispravnom stanju, bez zvukova, sve brzine ulaze lako."],
  ["Menjač manuelni 6 brzina", "Menjač", 74900, "Šestostepeni manuelni menjač, testiran na vozilu."],
  ["Kvačilo komplet sa zamajcem", "Menjač", 32900, "Komplet kvačila sa dvomasnim zamajcem. Novo — originalni zamenski deo.", "Novo - zamenski deo"],
  ["Poluosovina prednja leva", "Menjač", 9500, "Poluosovina sa celim manžetnama."],
  ["Kočione čeljusti prednje (par)", "Kočioni sistem", 8900, "Prednje kočione čeljusti, klipovi se slobodno kreću."],
  ["ABS pumpa", "Kočioni sistem", 24900, "ABS modul i pumpa, testirani, bez grešaka."],
  ["Diskovi i pločice prednji (set)", "Kočioni sistem", 11900, "Novi set diskova i pločica, originalni Ford.", "Novo - originalno"],
  ["Amortizer prednji levi", "Vešanje", 6900, "Amortizer bez curenja ulja."],
  ["Viljuška prednja desna", "Vešanje", 5500, "Viljuška sa ispravnim silen blokovima i kuglom."],
  ["Hladnjak vode", "Hlađenje", 9900, "Hladnjak bez curenja, saće celo."],
  ["Hladnjak klime (kondenzator)", "Hlađenje", 8900, "Kondenzator klime bez oštećenja."],
  ["Ventilator hladnjaka sa kućištem", "Hlađenje", 10900, "Ventilator radi u obe brzine."],
  ["DPF filter", "Izduvni", 44900, "DPF filter, očišćen i proveren protok."],
  ["EGR ventil", "Izduvni", 9900, "EGR ventil očišćen i testiran."],
  ["Sedišta komplet (prednja + zadnja)", "Enterijer", 39900, "Komplet sedišta u odličnom stanju, bez oštećenja štofa.", "Polovno - odlično stanje"],
  ["Volan sa airbagom", "Enterijer", 14900, "Kožni volan sa komandama. Airbag nije aktiviran."],
  ["Radio / multimedija", "Enterijer", 12900, "Originalni radio sa kodom. Bluetooth i USB rade."],
  ["Felne aluminijumske 16\" (set 4)", "Felne i gume", 39900, "Set originalnih ALU felni, bez krivina. Moguća sitna oštećenja na ivicama."],
  ["Rezervni točak (tockić)", "Felne i gume", 4900, "Tockić za rezervu sa gumom."],
  ["Kuka za vuču", "Ostalo", 12900, "Originalna kuka sa elektro instalacijom."],
];

async function main() {
  console.log("Seed: brisanje postojećih podataka…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.category.deleteMany();
  await prisma.message.deleteMany();

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN" },
    create: { email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 10), firstName: "Sole", lastName: "Admin", role: "ADMIN" },
  });

  const models = [];
  for (let i = 0; i < MODELS.length; i++) {
    const [name, years] = MODELS[i];
    models.push(await prisma.carModel.create({ data: { name, slug: slug(name), years, sort: i + 1 } }));
  }
  const cats = {};
  for (const name of CATEGORIES) cats[name] = await prisma.category.create({ data: { name, slug: slug(name) } });

  // Pseudo-slučajan, ali deterministički izbor artikala po modelu
  let n = 0;
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (const m of models) {
    const count = ["Fiesta", "Focus", "Mondeo", "Transit", "Kuga"].includes(m.name) ? 9 : 4;
    const picked = [...PARTS].sort(() => rnd() - 0.5).slice(0, count);
    for (const [pname, cat, base, desc, cond] of picked) {
      n++;
      const factor = 0.8 + rnd() * 0.5;
      const price = Math.round((base * factor) / 100) * 100;
      const onSale = rnd() < 0.15;
      const name = `${pname} Ford ${m.name}`;
      await prisma.product.create({
        data: {
          name,
          slug: slug(name),
          sku: `SF-${String(n).padStart(4, "0")}`,
          partNumber: rnd() < 0.7 ? `${Math.floor(1000000 + rnd() * 8999999)}` : null,
          description: `${desc}\n\nOdgovara za Ford ${m.name} (${m.years}). Pre kupovine preporučujemo proveru kompatibilnosti putem broja šasije (VIN) — pozovite nas ili pošaljite poruku.\n\nGarancija 90 dana · Povraćaj novca 30 dana.`,
          price: onSale ? Math.round((price * 0.8) / 100) * 100 : price,
          oldPrice: onSale ? price : null,
          stock: Math.floor(rnd() * 4),
          condition: cond || "Polovno - ispravno",
          featured: rnd() < 0.15,
          carModelId: m.id,
          categoryId: cats[cat].id,
        },
      });
    }
  }
  // osiguraj bar 8 izdvojenih i dostupnih
  const feat = await prisma.product.findMany({ where: { stock: { gt: 0 } }, take: 8, orderBy: { price: "desc" } });
  await prisma.product.updateMany({ where: { id: { in: feat.map((f) => f.id) } }, data: { featured: true } });

  console.log(`Seed završen: ${models.length} modela, ${CATEGORIES.length} kategorija, ${n} artikala.`);
  console.log(`Admin nalog: ${ADMIN_EMAIL} (lozinka je u README.md / ADMIN_PASSWORD)`);
}

main().finally(() => prisma.$disconnect());
