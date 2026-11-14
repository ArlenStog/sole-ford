import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductListing from "@/components/ProductListing";

export async function generateMetadata({ params }) {
  const { model } = await params;
  const m = await prisma.carModel.findUnique({ where: { slug: model } });
  return { title: m ? `Ford ${m.name} delovi` : "Delovi" };
}

export default async function Page({ params, searchParams }) {
  const { model } = await params;
  const m = await prisma.carModel.findUnique({ where: { slug: model } });
  if (!m) notFound();
  return (
    <ProductListing
      searchParams={await searchParams}
      model={m}
      basePath={`/delovi/${m.slug}`}
      title={`Ford ${m.name} — polovni delovi`}
      intro={`Originalni delovi za Ford ${m.name}${m.years ? ` (${m.years})` : ""}: motor i menjač, karoserija, svetla, elektrika, enterijer i još mnogo toga.`}
    />
  );
}
