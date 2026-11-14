// Prikazuje sliku dela ili generisani placeholder ako slika ne postoji
const ICONS = {
  motor: "⚙️", menjac: "🔩", karoserija: "🚗", svetla: "💡", elektrika: "🔌", enterijer: "💺",
  "kocioni-sistem": "🛑", vesanje: "🛞", hladjenje: "❄️", izduvni: "💨", "felne-i-gume": "🛞", ostalo: "🧰",
};

export default function PartImage({ product, className = "" }) {
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image} alt={product.name} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  const icon = ICONS[product.category?.slug] || "🔧";
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 ${className}`}>
      <span className="text-5xl">{icon}</span>
      {product.carModel && <span className="mt-2 text-xs font-bold uppercase tracking-wider text-ford/70">Ford {product.carModel.name}</span>}
    </div>
  );
}
