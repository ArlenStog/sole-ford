import { site } from "./site";

const fmt = (n) => new Intl.NumberFormat("sr-RS").format(n);

// Sadržaj informativnih stranica (naslov + sekcije [podnaslov, pasusi[] | lista])
export const pages = {
  "o-nama": {
    title: "O nama",
    sections: [
      [null, [`${site.name} je porodična firma specijalizovana isključivo za Ford vozila. Bavimo se otkupom, rastavljanjem i prodajom originalnih polovnih delova, kao i prodajom novih delova i potrošnog materijala.`]],
      ["Zašto baš mi?", { list: [
        "Radimo samo sa Ford vozilima — poznajemo svaki model i svaku generaciju.",
        "Svaki deo je testiran, očišćen i obeležen pre stavljanja u prodaju.",
        "Garancija 90 dana na delove i 30 dana za povraćaj novca.",
        "Slanje istog dana za porudžbine primljene do 14h.",
        "Stručna pomoć pri izboru dela na osnovu broja šasije (VIN).",
      ] }],
      ["Ekologija", ["Vozila rastavljamo u skladu sa važećim propisima o upravljanju otpadnim vozilima. Opasne tečnosti i materijali se odvajaju i predaju ovlašćenim operaterima, a ponovna upotreba delova smanjuje otpad i čuva prirodu."]],
    ],
  },
  dostava: {
    title: "Dostava",
    sections: [
      [null, [`Porudžbine šaljemo kurirskom službom na teritoriji cele Srbije. Porudžbine primljene radnim danima do 14h šaljemo istog dana, a isporuka traje 1–2 radna dana.`]],
      ["Cena dostave", { list: [
        `Standardna dostava: ${fmt(site.shipping.courier)} RSD po porudžbini.`,
        `Besplatna dostava za porudžbine preko ${fmt(site.shipping.freeOver)} RSD.`,
        "Za glomazne delove (haube, vrata, motori, menjači) cena dostave se dogovara posebno — kontaktiraćemo vas pre slanja.",
      ] }],
      ["Praćenje pošiljke", ["Nakon slanja dobićete broj pošiljke putem e-maila ili SMS-a. Status porudžbine možete pratiti i u sekciji „Moj nalog → Porudžbine“."]],
    ],
  },
  povracaj: {
    title: "Povraćaj i reklamacije",
    sections: [
      ["Povraćaj novca u roku od 30 dana", ["Ukoliko deo ne odgovara vašem vozilu ili se predomislite, možete ga vratiti u roku od 30 dana od prijema. Deo mora biti neoštećen, nemontiran (osim radi provere) i sa svim oznakama koje smo postavili."]],
      ["Garancija 90 dana", ["Na mehaničke i električne delove dajemo garanciju od 90 dana. Ukoliko deo ne radi ispravno, zamenićemo ga istim ili vratiti novac. Garancija ne važi za oštećenja nastala nestručnom ugradnjom, kao ni za potrošne delove."]],
      ["Kako da vratite deo?", { list: [
        `Kontaktirajte nas na ${site.email} ili ${site.phone} i navedite broj porudžbine.`,
        "Spakujte deo bezbedno i pošaljite ga na našu adresu ili ga donesite lično.",
        "Novac vraćamo u roku od 14 dana od prijema i provere dela.",
      ] }],
    ],
  },
  preuzimanje: {
    title: "Lično preuzimanje",
    sections: [
      [null, [`Delove možete preuzeti lično u našoj radnji na adresi: ${site.address}. Pri plaćanju izaberite opciju „Lično preuzimanje u radnji“ — javićemo vam kada je porudžbina spremna.`]],
      ["Radno vreme", { list: site.hours.map(([d, h]) => `${d}: ${h}`) }],
      ["Plaćanje u radnji", ["U radnji možete platiti gotovinom ili platnom karticom."]],
    ],
  },
  uslovi: {
    title: "Uslovi korišćenja i kupovine",
    sections: [
      ["Opšte odredbe", [`Ovi uslovi regulišu korišćenje internet prodavnice ${site.name} i kupovinu artikala. Poručivanjem prihvatate ove uslove.`]],
      ["Cene", ["Sve cene su izražene u dinarima (RSD) sa uključenim PDV-om. Zadržavamo pravo izmene cena bez prethodne najave; za već potvrđene porudžbine važi cena u trenutku poručivanja."]],
      ["Porudžbina i ugovor", ["Ugovor o kupovini zaključen je kada potvrdimo porudžbinu telefonom ili e-mailom. Zadržavamo pravo da otkažemo porudžbinu ukoliko artikal u međuvremenu nije dostupan, uz povraćaj eventualno uplaćenog iznosa."]],
      ["Pravo na odustanak", ["U skladu sa Zakonom o zaštiti potrošača, kupac ima pravo da odustane od ugovora zaključenog na daljinu u roku od 14 dana, a mi taj rok produžavamo na 30 dana. Detalji su na stranici „Povraćaj i reklamacije“."]],
      ["Polovni delovi", ["Polovni delovi mogu imati tragove korišćenja koji ne utiču na funkcionalnost. Stanje dela je navedeno u opisu svakog artikla."]],
    ],
  },
  privatnost: {
    title: "Politika privatnosti i kolačići",
    sections: [
      ["Koje podatke prikupljamo", ["Prikupljamo samo podatke neophodne za obradu porudžbina i komunikaciju: ime i prezime, adresu, telefon i e-mail adresu. Lozinke se čuvaju isključivo u šifrovanom (hash) obliku."]],
      ["Svrha obrade", ["Podatke koristimo radi isporuke porudžbina, izdavanja računa i odgovora na vaše upite. Podatke ne prodajemo niti ustupamo trećim licima, osim kurirskoj službi u meri potrebnoj za isporuku."]],
      ["Kolačići", ["Koristimo samo neophodne kolačiće — za održavanje prijave na nalog i sadržaja korpe. Ne koristimo kolačiće za praćenje ili reklamiranje."]],
      ["Vaša prava", [`U skladu sa Zakonom o zaštiti podataka o ličnosti imate pravo na uvid, ispravku i brisanje vaših podataka. Zahtev možete poslati na ${site.email}.`]],
    ],
  },
};
