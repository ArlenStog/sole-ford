export function rsd(n) {
  return new Intl.NumberFormat("sr-RS").format(n) + " RSD";
}
export function slugify(s) {
  const map = { š: "s", đ: "dj", č: "c", ć: "c", ž: "z", Š: "s", Đ: "dj", Č: "c", Ć: "c", Ž: "z" };
  return s.replace(/[šđčćžŠĐČĆŽ]/g, (c) => map[c]).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export const STATUS = {
  NOVA: "Nova",
  U_OBRADI: "U obradi",
  POSLATA: "Poslata",
  ISPORUCENA: "Isporučena",
  OTKAZANA: "Otkazana",
};
export const PAYMENT = {
  POUZECE: "Plaćanje pouzećem",
  UPLATNICA: "Uplata na račun (predračun)",
  LICNO: "Plaćanje pri ličnom preuzimanju",
};
export const DELIVERY = { KURIR: "Kurirska služba", LICNO: "Lično preuzimanje u radnji" };
export function shippingFor(subtotal, delivery, cfg) {
  if (delivery === "LICNO") return 0;
  return subtotal >= cfg.freeOver ? 0 : cfg.courier;
}
// Spaja broj i jedinicu neprelomivim razmakom ("600 RSD", "30 dana") da se ne lome u dva reda
export function nb(s) {
  return typeof s === "string" ? s.replace(/(\d) (?=(RSD|dana|radna|radnih|sata|h\b|kom))/g, "$1\u00A0").replace(/(\d)\u2013(\d)/g, "$1\u2013\u2060$2") : s;
}
