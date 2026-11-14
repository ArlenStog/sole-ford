import ProductListing from "@/components/ProductListing";

export const metadata = { title: "Akcije i specijalne ponude" };

export default async function Page({ searchParams }) {
  return (
    <ProductListing
      searchParams={await searchParams}
      offersOnly
      basePath="/akcije"
      title="🔥 Akcije i specijalne ponude"
      intro="Delovi po sniženim cenama — ponuda važi do isteka zaliha."
    />
  );
}
